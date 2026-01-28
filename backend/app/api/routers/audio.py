from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional
import uuid

from app.db import get_db
from app.schemas import AudioIngestRead, AudioIngestCreate
from app.models.models import AudioFile, Meeting, UserOrganization, User
from app.core.auth import get_current_user
from app.storage import storage
from app.tasks import enqueue_audio_processing, enqueue_transcription
from app.core.config import settings

router = APIRouter(prefix="/audio", tags=["audio"])


@router.post("/ingest", response_model=AudioIngestRead)
async def upload_audio(file: UploadFile = File(...), meeting_id: Optional[int] = None, title: Optional[str] = None, metadata: Optional[str] = None, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        # validate meeting membership if provided
        if meeting_id:
            q = await db.execute(select(Meeting).filter_by(id=meeting_id))
            meeting = q.scalars().first()
            if not meeting:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Meeting not found")
            if meeting.organization_id:
                q2 = await db.execute(select(UserOrganization).filter_by(user_id=current_user.id, organization_id=meeting.organization_id))
                if not q2.scalars().first():
                    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not a member of the organization")

        # Read data first so we don't start DB transaction too early or hold it open during slow upload
        print(f"DEBUG: Processing upload for {file.filename} (content_type: {file.content_type})")
        data = await file.read()
        print(f"DEBUG: Read {len(data)} bytes from upload")
        
        if len(data) == 0:
            print(f"ERROR: Received 0-byte file: {file.filename}")
            raise HTTPException(status_code=422, detail="File is empty")

        # If no meeting provided, create a placeholder meeting for this upload
        # We do this INSIDE the try block so it rolls back on failure
        if not meeting_id:
            from app.models.models import Meeting
            new_meeting = Meeting(
                title=title if title else f"Recording {file.filename}",
                organizer_id=current_user.id,
                ai_transcription=True,
                ai_recording=True,
                meeting_type=Meeting.MeetingType.NATIVE
            )
            db.add(new_meeting)
            await db.flush() # get ID
            meeting_id = new_meeting.id

        # generate s3 key
        key = f"audio/{uuid.uuid4().hex}/{file.filename}"
        
        # stream upload to storage
        import io
        buf = io.BytesIO(data)
        try:
            await storage.upload_fileobj(buf, key, content_type=file.content_type)
        except Exception as se:
            print(f"ERROR: Storage upload failed: {str(se)}")
            raise HTTPException(status_code=500, detail=f"Failed to save file to storage: {str(se)}")

        audio = AudioFile(meeting_id=meeting_id, s3_key=key, content_type=file.content_type, size_bytes=len(data), meta=metadata)
        db.add(audio)
        await db.commit()
        await db.refresh(audio)

        # enqueue processing and transcription
        enqueue_transcription(audio.id)

        return audio
    except HTTPException:
        await db.rollback()
        raise
    except Exception as e:
        await db.rollback()
        print(f"CRITICAL ERROR in upload_audio: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{audio_id}", response_model=AudioIngestRead)
async def get_audio(audio_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    q = await db.execute(select(AudioFile).filter_by(id=audio_id))
    a = q.scalars().first()
    if not a:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Audio not found")
    # membership check if linked to meeting
    if a.meeting_id:
        q2 = await db.execute(select(Meeting).filter_by(id=a.meeting_id))
        meeting = q2.scalars().first()
        if meeting and meeting.organization_id:
            q3 = await db.execute(select(UserOrganization).filter_by(user_id=current_user.id, organization_id=meeting.organization_id))
            if not q3.scalars().first():
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not a member of the organization")
    return a


@router.get("/{audio_id}/download")
async def download_audio(audio_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Stream audio file for playback in browser"""
    from fastapi.responses import FileResponse, StreamingResponse
    import io
    import os
    
    q = await db.execute(select(AudioFile).filter_by(id=audio_id))
    a = q.scalars().first()
    if not a:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Audio not found")
    
    # membership check if linked to meeting
    if a.meeting_id:
        q2 = await db.execute(select(Meeting).filter_by(id=a.meeting_id))
        meeting = q2.scalars().first()
        if meeting and meeting.organization_id:
            q3 = await db.execute(select(UserOrganization).filter_by(user_id=current_user.id, organization_id=meeting.organization_id))
            if not q3.scalars().first():
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not a member of the organization")
    
    # Download from storage
    try:
        if settings.USE_LOCAL_STORAGE:
            root = os.path.abspath(getattr(settings, "STORAGE_PATH", "storage_data"))
            full_path = os.path.join(root, a.s3_key)
            if not os.path.exists(full_path):
                print(f"ERROR: Local file not found at {full_path} (key: {a.s3_key})")
                raise HTTPException(status_code=404, detail=f"File not found on disk: {a.s3_key}")
            
            print(f"DEBUG: Serving local file {full_path} for audio {audio_id}")
            return FileResponse(
                path=full_path,
                media_type=a.content_type or "audio/mpeg",
                filename=a.s3_key.split("/")[-1]
            )
        else:
            print(f"DEBUG: Attempting to download audio {audio_id} from s3_key: {a.s3_key}")
            data = await storage.download_to_bytes(a.s3_key)
            size = len(data)
            print(f"DEBUG: Downloaded {size} bytes for audio {audio_id}")
            
            return StreamingResponse(
                io.BytesIO(data),
                media_type=a.content_type or "audio/mpeg",
                headers={
                    "Content-Disposition": f'inline; filename="{a.s3_key.split("/")[-1]}"',
                    "Content-Length": str(size),
                    "Accept-Ranges": "bytes"
                }
            )
    except HTTPException:
        raise
    except Exception as e:
        print(f"ERROR: Download failed for audio {audio_id}: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to download audio: {str(e)}")


@router.delete("/{audio_id}")
async def delete_audio(audio_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Delete audio file and all related data"""
    q = await db.execute(select(AudioFile).filter_by(id=audio_id))
    a = q.scalars().first()
    if not a:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Audio not found")
    
    # membership check if linked to meeting
    if a.meeting_id:
        q2 = await db.execute(select(Meeting).filter_by(id=a.meeting_id))
        meeting = q2.scalars().first()
        if meeting:
            # Only organizer can delete
            if meeting.organizer_id != current_user.id:
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only the organizer can delete recordings")
    
    # Delete from storage
    try:
        await storage.delete(a.s3_key)
    except Exception as e:
        # Log but don't fail if storage deletion fails
        print(f"Warning: Failed to delete from storage: {e}")
    
    # Delete from database (cascades to transcripts, summaries, etc via SQLAlchemy relationships)
    await db.delete(a)
    await db.commit()
    
    return {"message": "Audio file deleted successfully"}

