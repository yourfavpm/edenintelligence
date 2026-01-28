from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.db import get_db
from app.schemas import TranslatedTranscriptRead
from app.models.models import TranslatedTranscript, Transcript, Meeting, UserOrganization, User
from app.core.auth import get_current_user
from app.tasks import enqueue_translation

router = APIRouter(prefix="/translations", tags=["translations"]) 


@router.post("/", status_code=202)
async def request_translation(transcript_id: int, target_language: str, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    # load transcript and basic permission check
    res = await db.execute(select(Transcript).filter_by(id=transcript_id))
    t = res.scalars().first()
    if not t:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transcript not found")
    # if linked to meeting, check membership
    if t.meeting_id:
        q = await db.execute(select(Meeting).filter_by(id=t.meeting_id))
        meeting = q.scalars().first()
        if meeting and meeting.organization_id:
            q2 = await db.execute(select(UserOrganization).filter_by(user_id=current_user.id, organization_id=meeting.organization_id))
            if not q2.scalars().first():
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not a member of the organization")

    enqueue_translation(t.id, target_language)
    return {"status": "accepted", "transcript_id": t.id, "target_language": target_language}


@router.get("/{translated_id}", response_model=TranslatedTranscriptRead)
async def get_translation(translated_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    q = await db.execute(select(TranslatedTranscript).filter_by(id=translated_id))
    tr = q.scalars().first()
    if not tr:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Translated transcript not found")
    # if linked to meeting, check membership
    if tr.meeting_id:
        q2 = await db.execute(select(Meeting).filter_by(id=tr.meeting_id))
        meeting = q2.scalars().first()
        if meeting and meeting.organization_id:
            q3 = await db.execute(select(UserOrganization).filter_by(user_id=current_user.id, organization_id=meeting.organization_id))
            if not q3.scalars().first():
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not a member of the organization")
    return tr
