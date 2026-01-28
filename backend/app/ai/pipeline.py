"""AI processing pipeline interfaces.

This module defines the high-level orchestration. Concrete implementations for
speech-to-text, translation and LLM summarization should be placed in
`app.ai.backends` and invoked here.

"""
from typing import Dict, Any
from celery.utils.log import get_task_logger
import asyncio
import json
from app.storage import storage
from app.ai import transcribe
from celery_app import celery_app

from app.db import AsyncSessionLocal
from sqlalchemy import select
from app.models.models import Recording, AudioFile, Transcript
from datetime import datetime, timezone
from app.core import crypto

logger = get_task_logger(__name__)


def process_recording(recording_id: int) -> Dict[str, Any]:
    """Idempotent orchestration for recording processing.

    Steps:
    1. Download audio from S3 (using S3 helper)
    2. Run speech-to-text with speaker attribution
    3. Normalize timestamps and speakers
    4. Run translation (if target languages specified)
    5. Run LLM for summary, action items, decisions
    6. Persist summary & artifacts and notify participants

    Concrete service integrations are not implemented here — implement adapters
    in `app.ai.backends` and wire via configuration.
    """
    logger.info("Starting AI pipeline for recording %s", recording_id)

    async def _run():
        async with AsyncSessionLocal() as db:
            res = await db.execute(select(Recording).filter_by(id=recording_id))
            rec = res.scalars().first()
            if not rec:
                logger.warning("Recording %s not found", recording_id)
                return {"error": "not_found"}
            # update status
            rec.processing_status = "processing"
            db.add(rec)
            await db.commit()

            try:
                # download bytes
                data = await storage.download_to_bytes(rec.s3_key)

                # Check if AudioFile already exists
                res_af = await db.execute(select(AudioFile).filter_by(s3_key=rec.s3_key))
                af = res_af.scalars().first()
                
                if not af:
                    # create an AudioFile record referencing the same s3_key
                    af = AudioFile(meeting_id=rec.meeting_id, s3_key=rec.s3_key, content_type=None, size_bytes=len(data), meta=None)
                    db.add(af)
                    await db.commit()
                    await db.refresh(af)
                else:
                    logger.info("AudioFile %s already exists for key %s, reusing", af.id, rec.s3_key)

                # run transcription (mocked) synchronously here
                result = transcribe.transcribe_bytes_to_segments(data)
                segments_json = json.dumps(result.get("segments", []))
                # encrypt segments at rest if configured
                enc_segments = crypto.encrypt_text(segments_json)
                detected = result.get("detected_language")
                tr = Transcript(audio_file_id=af.id, meeting_id=rec.meeting_id, segments=enc_segments, detected_language=detected, encrypted=(enc_segments != segments_json))
                db.add(tr)
                await db.commit()
                await db.refresh(tr)

                # link transcript to recording
                rec.transcript_id = tr.id
                rec.processed = True
                rec.processing_status = "processed"
                db.add(rec)
                await db.commit()

                # enqueue downstream AI tasks via celery send_task (avoid circular imports)
                celery_app.send_task("app.tasks.process_extraction", args=(tr.id,))
                celery_app.send_task("app.tasks.process_summarization", args=(tr.id, "short", "formal"))

                return {"transcript_id": tr.id}
            except Exception as exc:
                logger.exception("Pipeline failed for recording %s: %s", recording_id, exc)
                rec.processing_status = "failed"
                rec.processing_error = str(exc)
                db.add(rec)
                await db.commit()
                return {"error": str(exc)}

    return asyncio.run(_run())
