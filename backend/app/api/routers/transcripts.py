from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional

from app.db import get_db
from app.schemas import TranscriptRead
from app.models.models import Transcript, Meeting, UserOrganization, User
from app.core.auth import get_current_user

router = APIRouter(prefix="/transcripts", tags=["transcripts"])


@router.get("/{transcript_id}", response_model=TranscriptRead)
async def get_transcript(transcript_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    q = await db.execute(select(Transcript).filter_by(id=transcript_id))
    t = q.scalars().first()
    if not t:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transcript not found")
    if t.meeting_id:
        q2 = await db.execute(select(Meeting).filter_by(id=t.meeting_id))
        meeting = q2.scalars().first()
        if meeting and meeting.organization_id:
            q3 = await db.execute(select(UserOrganization).filter_by(user_id=current_user.id, organization_id=meeting.organization_id))
            if not q3.scalars().first():
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not a member of the organization")
    # Deserialize segments into proper structure for schema
    import json
    segments = json.loads(t.segments) if t.segments else []
    return TranscriptRead(id=t.id, audio_file_id=t.audio_file_id, meeting_id=t.meeting_id, segments=segments, detected_language=t.detected_language, created_at=t.created_at)


@router.get("/{transcript_id}/download")
async def download_transcript(transcript_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    q = await db.execute(select(Transcript).filter_by(id=transcript_id))
    t = q.scalars().first()
    if not t:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transcript not found")
    # permission checks same as above
    if t.meeting_id:
        q2 = await db.execute(select(Meeting).filter_by(id=t.meeting_id))
        meeting = q2.scalars().first()
        if meeting and meeting.organization_id:
            q3 = await db.execute(select(UserOrganization).filter_by(user_id=current_user.id, organization_id=meeting.organization_id))
            if not q3.scalars().first():
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not a member of the organization")
    return {"transcript": t.segments, "detected_language": t.detected_language}
