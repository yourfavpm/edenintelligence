from . import ai
from celery.utils.log import get_task_logger
from celery_app import celery_app
from app.storage import storage
from app.ai import transcribe
import json
from app.ai import translate
from app.ai import summarize
from app.ai import extract
from app.core import crypto
import logging
import os

def debug_log(msg: str):
    try:
        with open("task_debug.log", "a") as f:
            f.write(f"{msg}\n")
    except Exception:
        pass

logger = logging.getLogger(__name__)

@celery_app.task(bind=True, name="app.tasks.process_recording")
def process_recording(self, recording_id: int):
    """Entry point for processing a recording: download -> transcribe -> translate -> summarize -> store results -> email participants"""
    debug_log(f"START: process_recording for recording {recording_id}")
    try:
        logger.info("Processing recording %s", recording_id)
        # Implement idempotent processing inside ai.pipeline.process_recording
        ai.pipeline.process_recording(recording_id=recording_id)
    except Exception as exc:
        logger.exception("Processing failed for recording %s", recording_id)
        raise self.retry(exc=exc, countdown=30, max_retries=3)

# Provide a convenience to enqueue via .delay
def enqueue_recording_processing(recording_id: int):
    return process_recording.delay(recording_id)


@celery_app.task(bind=True, name="app.tasks.process_listener_session")
def process_listener_session(self, session_id: int):
    """Mocked bot join flow: update status through joining -> joined -> left and record consent if any.
    This runs synchronously inside a Celery worker but uses the async DB session via asyncio.run.
    """
    import asyncio
    from datetime import datetime, timezone
    from app.db import AsyncSessionLocal
    from sqlalchemy import select
    from app.models.models import ListenerSession

    logger.info("Processing listener session %s", session_id)

    async def _run():
        async with AsyncSessionLocal() as db:
            # load session
            res = await db.execute(select(ListenerSession).filter_by(id=session_id))
            s = res.scalars().first()
            if not s:
                logger.warning("Listener session %s not found", session_id)
                return
            # if cancelled, skip
            if s.status == "cancelled":
                logger.info("Listener session %s cancelled, skipping", session_id)
                return
            try:
                s.status = "joining"
                s.join_at = datetime.now(timezone.utc)
                db.add(s)
                await db.commit()

                # simulate join processing time
                await asyncio.sleep(1)

                s.status = "joined"
                db.add(s)
                await db.commit()

                # remain joined for a short while then mark left
                await asyncio.sleep(2)
                s.left_at = datetime.now(timezone.utc)
                s.status = "left"
                db.add(s)
                await db.commit()
            except Exception as exc:
                logger.exception("Listener session processing failed %s", exc)
                s.status = "failed"
                db.add(s)
                await db.commit()

    return asyncio.run(_run())


def enqueue_listener_join(session_id: int, countdown: int = 0):
    return process_listener_session.apply_async(args=(session_id,), countdown=countdown)


@celery_app.task(bind=True, name="app.tasks.process_audio_file", max_retries=3)
def process_audio_file(self, audio_id: int):
    """Download audio from S3, chunk/process, and mark processed. Retries on failure."""
    from app.db import SyncSessionLocal
    from app.models.models import AudioFile
    
    logger.info("Processing audio file %s", audio_id)
    
    db = SyncSessionLocal()
    try:
        a = db.query(AudioFile).filter_by(id=audio_id).first()
        if not a:
            logger.warning("Audio file %s not found", audio_id)
            return
        if a.processed:
            logger.info("Audio file %s already processed", audio_id)
            return
        
        try:
            # Download from storage (storage methods need to be sync or wrapped)
            import asyncio
            data = asyncio.run(storage.download_to_bytes(a.s3_key))
            
            # Chunking mock: split into N parts
            chunk_size = 1024 * 64
            total = len(data)
            chunks = [data[i:i+chunk_size] for i in range(0, total, chunk_size)]
            logger.info("Audio %s split into %d chunks", audio_id, len(chunks))
            
            # Mock processing each chunk
            import time
            for idx, c in enumerate(chunks):
                time.sleep(0.01)
            
            # Mark processed
            a.processed = True
            db.add(a)
            db.commit()
            logger.info("Audio file %s marked as processed", audio_id)
            
        except Exception as exc:
            logger.exception("Audio processing failed %s", exc)
            db.rollback()
            raise self.retry(exc=exc, countdown=10)
    finally:
        db.close()



def enqueue_audio_processing(audio_id: int):
    return process_audio_file.delay(audio_id)


@celery_app.task(bind=True, name="app.tasks.process_transcription")
def process_transcription(self, audio_id: int):
    """Download audio bytes, transcribe with WhisperX + pyannote, and persist Transcript record."""
    from app.db import SyncSessionLocal
    from app.models.models import AudioFile, Transcript, Meeting
    
    debug_log(f"START: process_transcription for audio {audio_id}")
    
    db = SyncSessionLocal()
    try:
        a = db.query(AudioFile).filter_by(id=audio_id).first()
        if not a:
            logger.warning("Audio file %s not found for transcription", audio_id)
            return
        
        try:
            # Download audio
            import asyncio
            print(f"DEBUG: Downloading audio for transcription: {a.s3_key}")
            data = asyncio.run(storage.download_to_bytes(a.s3_key))
            print(f"DEBUG: Downloaded {len(data)} bytes")
            
            # Transcribe with WhisperX (internal model handles speaker-aware segments)
            from app.core.config import settings
            if settings.USE_MODAL_AI:
                print(f"DEBUG: Using Modal.com for transcription of audio {audio_id}")
                import modal
                f = modal.Function.lookup("eden-ai-worker", "transcribe_audio")
                result = f.remote(data)
            else:
                print(f"DEBUG: Using local worker for transcription of audio {audio_id}")
                result = transcribe.transcribe_bytes_to_segments(data)
            
            segments = result.get("segments", [])
            segments_json = json.dumps(segments)
            
            # Encrypt segments at rest if configured
            from app.core import crypto
            enc_segments = crypto.encrypt_text(segments_json)
            detected = result.get("detected_language")
            
            print(f"DEBUG: Saving transcript with {len(segments)} segments")
            # Save transcript
            tr = Transcript(
                audio_file_id=a.id,
                meeting_id=a.meeting_id,
                segments=enc_segments,
                detected_language=detected,
                encrypted=(enc_segments != segments_json)
            )
            db.add(tr)
            
            # Mark audio processed
            a.processed = True
            db.add(a)
            db.commit()

            print(f"DEBUG: Transcription completed and saved for audio {audio_id}")
            debug_log(f"SUCCESS: Transcription saved for audio {audio_id}. Enqueueing follow-ups.")

            # Enqueue follow-up AI tasks (fact-based summarization and extraction)
            enqueue_summarization(tr.id)
            enqueue_extraction(tr.id)
            print(f"DEBUG: Enqueued summarization and extraction for transcript {tr.id}")
            debug_log(f"ENQUEUED: Summarization and extraction for transcript {tr.id}")
            
        except Exception as exc:
            logger.exception("Transcription failed for %s", audio_id)
            db.rollback()
            raise self.retry(exc=exc, countdown=10)
    finally:
        db.close()



def enqueue_transcription(audio_id: int, countdown: int = 0):
    return process_transcription.apply_async(args=(audio_id,), countdown=countdown)


@celery_app.task(bind=True, name="app.tasks.process_translation")
def process_translation(self, transcript_id: int, target_language: str):
    """Load transcript, translate segments, and persist TranslatedTranscript."""
    import asyncio
    from app.db import AsyncSessionLocal
    from sqlalchemy import select
    from app.models.models import Transcript, TranslatedTranscript

    logger.info("Starting translation for transcript %s -> %s", transcript_id, target_language)

    async def _run():
        async with AsyncSessionLocal() as db:
            res = await db.execute(select(Transcript).filter_by(id=transcript_id))
            t = res.scalars().first()
            if not t:
                logger.warning("Transcript %s not found", transcript_id)
                return
            try:
                segments = json.loads(t.segments)
                result = translate.translate_segments(segments, target_language)
                segs_json = json.dumps(result.get("segments", []))
                tr = TranslatedTranscript(transcript_id=t.id, audio_file_id=t.audio_file_id, meeting_id=t.meeting_id, target_language=target_language, segments=segs_json)
                db.add(tr)
                await db.commit()
            except Exception as exc:
                logger.exception("Translation failed for %s", transcript_id)
                raise self.retry(exc=exc, countdown=10)

    return asyncio.run(_run())


def enqueue_translation(transcript_id: int, target_language: str, countdown: int = 0):
    return process_translation.apply_async(args=(transcript_id, target_language), countdown=countdown)


@celery_app.task(bind=True, name="app.tasks.process_summarization")
def process_summarization(self, transcript_id: int, length: str = "short", tone: str = "formal"):
    """Load transcript, run summarizer, and persist MeetingSummary."""
    from app.db import SyncSessionLocal
    from app.models.models import Transcript, MeetingSummary
    
    debug_log(f"START: process_summarization for transcript {transcript_id}")
    logger.info("Starting summarization for transcript %s", transcript_id)

    db = SyncSessionLocal()
    try:
        t = db.query(Transcript).filter_by(id=transcript_id).first()
        if not t:
            logger.warning("Transcript %s not found for summarization", transcript_id)
            return
        try:
            if not t.segments:
                debug_log(f"WARNING: No segments found in transcript {transcript_id}")
                segments = []
            else:
                # decrypt if encrypted
                try:
                    raw_segments = crypto.decrypt_text(t.segments)
                    segments = json.loads(raw_segments)
                except Exception as e:
                    debug_log(f"DEBUG: Decryption failed for transcript {transcript_id}, trying raw: {str(e)}")
                    segments = json.loads(t.segments)
            
            debug_log(f"DEBUG: Summarizing {len(segments)} segments for transcript {transcript_id}")
            result = summarize.summarize_from_segments(segments, length=length, tone=tone)
            exec_text = result.get("executive_summary", "")
            enc_exec = crypto.encrypt_text(exec_text)
            ms = MeetingSummary(transcript_id=t.id, meeting_id=t.meeting_id, executive_summary=enc_exec, key_points=json.dumps(result.get("key_points",[])), decisions=json.dumps(result.get("decisions",[])), risks=json.dumps(result.get("risks",[])), length=length, tone=tone, encrypted=(enc_exec != exec_text))
            db.add(ms)
            db.commit()
            db.refresh(ms)
            debug_log(f"SUCCESS: process_summarization saved for transcript {transcript_id}")

            # enqueue delivery to registered meeting participants (if any)
            try:
                from app.models.models import Participant, User
                from app.tasks import enqueue_send_summary

                if ms.meeting_id:
                    participants = db.query(Participant).filter_by(meeting_id=ms.meeting_id).all()
                    for p in participants:
                        user = db.query(User).filter_by(email=p.email).first()
                        if user:
                            enqueue_send_summary(ms.id, user.id, include_transcript_link=True)
            except Exception:
                logger.exception("Failed to enqueue summary deliveries for summary %s", ms.id)

            return ms.id
        except Exception as exc:
            debug_log(f"FAILURE: process_summarization for transcript {transcript_id}: {str(exc)}")
            logger.exception("Summarization failed for %s", transcript_id)
            raise self.retry(exc=exc, countdown=10)
    finally:
        db.close()


def enqueue_summarization(transcript_id: int, length: str = "short", tone: str = "formal", countdown: int = 0):
    return process_summarization.apply_async(args=(transcript_id, length, tone), countdown=countdown)


@celery_app.task(bind=True, name="app.tasks.process_extraction")
def process_extraction(self, transcript_id: int):
    """Load transcript, run extractor, and persist Extraction record."""
    from app.db import SyncSessionLocal
    from app.models.models import Transcript, Extraction
    
    debug_log(f"START: process_extraction for transcript {transcript_id}")
    logger.info("Starting extraction for transcript %s", transcript_id)

    db = SyncSessionLocal()
    try:
        t = db.query(Transcript).filter_by(id=transcript_id).first()
        if not t:
            logger.warning("Transcript %s not found for extraction", transcript_id)
            return
        try:
            if not t.segments:
                debug_log(f"WARNING: No segments found for extraction {transcript_id}")
                segments = []
            else:
                try:
                    raw_segments = crypto.decrypt_text(t.segments)
                    segments = json.loads(raw_segments)
                except Exception as e:
                    debug_log(f"DEBUG: Decryption failed for extraction {transcript_id}, trying raw: {str(e)}")
                    segments = json.loads(t.segments)
            
            debug_log(f"DEBUG: Extracting from {len(segments)} segments for transcript {transcript_id}")
            result = extract.extract_from_segments(segments)
            items_json = json.dumps(result.get("items", []))
            conf = result.get("confidence")
            enc_items = crypto.encrypt_text(items_json)
            ex = Extraction(transcript_id=t.id, meeting_id=t.meeting_id, items=enc_items, confidence=str(conf) if conf is not None else None, encrypted=(enc_items != items_json))
            db.add(ex)
            db.commit()
            debug_log(f"SUCCESS: process_extraction saved for transcript {transcript_id}")
        except Exception as exc:
            debug_log(f"FAILURE: process_extraction for transcript {transcript_id}: {str(exc)}")
            logger.exception("Extraction failed for %s", transcript_id)
            raise self.retry(exc=exc, countdown=10)
    finally:
        db.close()


def enqueue_extraction(transcript_id: int, countdown: int = 0):
    return process_extraction.apply_async(args=(transcript_id,), countdown=countdown)


@celery_app.task(bind=True, name="app.tasks.process_send_summary", max_retries=3)
def process_send_summary(self, summary_id: int, user_id: int, include_transcript_link: bool = False):
    """Send a meeting summary email to a user and persist EmailDelivery status."""
    import asyncio
    import json
    from datetime import datetime, timezone
    from app.db import AsyncSessionLocal
    from sqlalchemy import select
    from app.models.models import MeetingSummary, User, EmailDelivery, Transcript
    from app.notifications.email import sender, format_summary_email

    logger.info("Sending summary %s to user %s", summary_id, user_id)

    async def _run():
        async with AsyncSessionLocal() as db:
            res = await db.execute(select(MeetingSummary).filter_by(id=summary_id))
            s = res.scalars().first()
            if not s:
                logger.warning("Summary %s not found", summary_id)
                return
            resu = await db.execute(select(User).filter_by(id=user_id))
            u = resu.scalars().first()
            if not u:
                logger.warning("User %s not found", user_id)
                return

            # prepare summary dict
            summary = {
                "executive_summary": s.executive_summary,
                "key_points": json.loads(s.key_points) if s.key_points else [],
                "decisions": json.loads(s.decisions) if s.decisions else [],
                "risks": json.loads(s.risks) if s.risks else [],
            }

            link = None
            if include_transcript_link and s.transcript_id:
                link = f"/transcripts/{s.transcript_id}"

            subject, body = await format_summary_email(u.display_name, u.email, s.meeting and getattr(s.meeting, 'title', 'Meeting'), summary, include_transcript_link=link)

            # create delivery record
            delivery = EmailDelivery(user_id=u.id, to_email=u.email, subject=subject, body=body, status="pending")
            db.add(delivery)
            await db.commit()
            await db.refresh(delivery)

            try:
                await sender.send(u.email, subject, body)
                delivery.status = "sent"
                delivery.sent_at = datetime.now(timezone.utc)
                db.add(delivery)
                await db.commit()
            except Exception as exc:
                logger.exception("Email send failed: %s", exc)
                delivery.status = "failed"
                delivery.error = str(exc)
                db.add(delivery)
                await db.commit()
                raise self.retry(exc=exc, countdown=30)

    return asyncio.run(_run())


def enqueue_send_summary(summary_id: int, user_id: int, include_transcript_link: bool = False, countdown: int = 0):
    return process_send_summary.apply_async(args=(summary_id, user_id, include_transcript_link), countdown=countdown)


@celery_app.task(bind=True, name="app.tasks.process_delete_user")
def process_delete_user(self, user_id: int):
    """GDPR-style deletion: remove user record, personal data, S3 objects, and audit."""
    import asyncio
    from app.db import AsyncSessionLocal
    from sqlalchemy import select
    from app.models.models import User, Participant, Recording, AudioFile, Transcript, TranslatedTranscript, MeetingSummary, Extraction, ConsentRecord, EmailDelivery
    from app.storage import storage

    async def _run():
        async with AsyncSessionLocal() as db:
            # load user
            res = await db.execute(select(User).filter_by(id=user_id))
            u = res.scalars().first()
            if not u:
                return
            # delete email deliveries and mark
            await db.execute(select(EmailDelivery).filter_by(user_id=user_id))
            # find recordings uploaded by meetings where this user was organizer or participant
            # remove S3 objects for recordings and audio files
            rres = await db.execute(select(Recording).filter_by(meeting_id=None))
            # best-effort: delete audio files and recordings referencing user's email via Participant
            pres = await db.execute(select(Participant).filter_by(email=u.email))
            parts = pres.scalars().all()
            for p in parts:
                # remove related recordings
                q = await db.execute(select(Recording).filter_by(meeting_id=p.meeting_id))
                recs = q.scalars().all()
                for rec in recs:
                    try:
                        await storage.download_to_bytes(rec.s3_key)  # ensure exists
                        await storage.delete(rec.s3_key)
                    except Exception:
                        pass
                    await db.delete(rec)
            # remove consent records
            cres = await db.execute(select(ConsentRecord).filter_by(user_id=user_id))
            for c in cres.scalars().all():
                await db.delete(c)
            # finally delete user
            await db.delete(u)
            await db.commit()

    return asyncio.run(_run())
