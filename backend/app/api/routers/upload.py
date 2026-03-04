from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from typing import Optional
import uuid

from app.db import get_db
from app.models.models import AudioFile, Meeting, User
from app.core.auth import get_current_user
from app.core.config import settings
from app.storage import storage
from app.tasks import enqueue_transcription

router = APIRouter(prefix="/upload", tags=["upload"])


# =============================================================================
# Request / Response schemas
# =============================================================================

class PresignRequest(BaseModel):
    filename: str
    content_type: str = "audio/webm"
    title: Optional[str] = None
    meeting_id: Optional[str] = None

class PresignResponse(BaseModel):
    upload_url: str
    s3_key: str

class ConfirmRequest(BaseModel):
    s3_key: str
    filename: str
    content_type: str = "audio/webm"
    size_bytes: Optional[int] = None
    title: Optional[str] = None
    meeting_id: Optional[str] = None
    metadata: Optional[str] = None

class ConfirmResponse(BaseModel):
    audio_id: str
    meeting_id: str
    message: str


# =============================================================================
# Step 1: Get a presigned upload URL
# =============================================================================

@router.post("/presign", response_model=PresignResponse)
async def presign_upload(
    payload: PresignRequest,
    current_user: User = Depends(get_current_user),
):
    """Generate a presigned S3 PUT URL for direct browser upload.
    
    The browser can then PUT the file directly to this URL,
    bypassing Render's 30-second timeout.
    """
    if settings.USE_LOCAL_STORAGE:
        raise HTTPException(
            status_code=501,
            detail="Presigned uploads are not supported with local storage. Use /audio/ingest instead.",
        )

    # Generate a unique S3 key
    s3_key = f"audio/{uuid.uuid4().hex}/{payload.filename}"

    try:
        upload_url = await storage.generate_presigned_upload_url(
            key=s3_key,
            content_type=payload.content_type,
            expires_in=900,  # 15 minutes
        )
    except Exception as e:
        print(f"ERROR: Failed to generate presigned URL: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate upload URL: {str(e)}")

    return PresignResponse(upload_url=upload_url, s3_key=s3_key)


# =============================================================================
# Step 2: Confirm upload is complete — create DB records + enqueue processing
# =============================================================================

@router.post("/confirm", response_model=ConfirmResponse)
async def confirm_upload(
    payload: ConfirmRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Called after the browser has uploaded the file directly to S3.
    
    Creates the Meeting + AudioFile database records and
    enqueues the transcription pipeline.
    """
    # Verify the file actually exists in S3
    if not settings.USE_LOCAL_STORAGE:
        exists = await storage.exists(payload.s3_key)
        if not exists:
            raise HTTPException(
                status_code=400,
                detail="File not found in storage. Upload may have failed.",
            )

    try:
        # Create or use existing meeting
        meeting_id = payload.meeting_id
        if not meeting_id:
            new_meeting = Meeting(
                title=payload.title or f"Recording {payload.filename}",
                organizer_id=current_user.id,
                ai_transcription=True,
                ai_recording=True,
                meeting_type=Meeting.MeetingType.NATIVE,
            )
            db.add(new_meeting)
            await db.flush()
            meeting_id = str(new_meeting.id)

        # Create audio file record
        audio = AudioFile(
            meeting_id=meeting_id,
            s3_key=payload.s3_key,
            content_type=payload.content_type,
            size_bytes=payload.size_bytes or 0,
            meta=payload.metadata,
        )
        db.add(audio)
        await db.commit()
        await db.refresh(audio)

        # Enqueue transcription
        try:
            enqueue_transcription(audio.id)
        except Exception as te:
            print(f"WARNING: Transcription enqueue failed: {te}. File saved, needs manual re-processing.")

        return ConfirmResponse(
            audio_id=str(audio.id),
            meeting_id=meeting_id,
            message="Upload confirmed. Transcription enqueued.",
        )
    except HTTPException:
        await db.rollback()
        raise
    except Exception as e:
        await db.rollback()
        print(f"CRITICAL ERROR in confirm_upload: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
