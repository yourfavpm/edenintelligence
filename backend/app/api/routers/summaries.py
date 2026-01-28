from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional, List

from app.db import get_db
from app.schemas import SummaryCreate, SummaryRead
from app.models.models import Transcript, MeetingSummary, Meeting, UserOrganization, User
from app.core.auth import get_current_user
from app.tasks import enqueue_summarization

router = APIRouter(prefix="/summaries", tags=["summaries"]) 


@router.post("/", status_code=202)
async def request_summary(payload: SummaryCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    res = await db.execute(select(Transcript).filter_by(id=payload.transcript_id))
    t = res.scalars().first()
    if not t:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transcript not found")
    # permission check if linked to meeting
    if t.meeting_id:
        q = await db.execute(select(Meeting).filter_by(id=t.meeting_id))
        meeting = q.scalars().first()
        if meeting and meeting.organization_id:
            q2 = await db.execute(select(UserOrganization).filter_by(user_id=current_user.id, organization_id=meeting.organization_id))
            if not q2.scalars().first():
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not a member of the organization")

    enqueue_summarization(payload.transcript_id, length=payload.length or "short", tone=payload.tone or "formal")
    return {"status": "accepted", "transcript_id": payload.transcript_id}


@router.get("/{summary_id}", response_model=SummaryRead)
async def get_summary(summary_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    q = await db.execute(select(MeetingSummary).filter_by(id=summary_id))
    s = q.scalars().first()
    if not s:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Summary not found")
    # permission check if linked to meeting
    if s.meeting_id:
        q2 = await db.execute(select(Meeting).filter_by(id=s.meeting_id))
        meeting = q2.scalars().first()
        if meeting and meeting.organization_id:
            q3 = await db.execute(select(UserOrganization).filter_by(user_id=current_user.id, organization_id=meeting.organization_id))
            if not q3.scalars().first():
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not a member of the organization")
    # deserialize JSON lists
    import json
    key_points = json.loads(s.key_points) if s.key_points else []
    decisions = json.loads(s.decisions) if s.decisions else []
    risks = json.loads(s.risks) if s.risks else []
    return SummaryRead(id=s.id, transcript_id=s.transcript_id, meeting_id=s.meeting_id, executive_summary=s.executive_summary, key_points=key_points, decisions=decisions, risks=risks, length=s.length, tone=s.tone, created_at=s.created_at)


@router.post("/{summary_id}/deliver", status_code=202)
async def deliver_summary(summary_id: int, user_ids: List[int], include_transcript_link: bool = False, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    # require permission on summary's meeting
    q = await db.execute(select(MeetingSummary).filter_by(id=summary_id))
    s = q.scalars().first()
    if not s:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Summary not found")
    if s.meeting_id:
        q2 = await db.execute(select(Meeting).filter_by(id=s.meeting_id))
        meeting = q2.scalars().first()
        if meeting and meeting.organization_id:
            q3 = await db.execute(select(UserOrganization).filter_by(user_id=current_user.id, organization_id=meeting.organization_id))
            if not q3.scalars().first():
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not a member of the organization")

    from app.tasks import enqueue_send_summary
    for uid in user_ids:
        enqueue_send_summary(summary_id, uid, include_transcript_link=include_transcript_link)
    return {"status": "scheduled", "summary_id": summary_id, "recipients": len(user_ids)}
