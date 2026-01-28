from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from datetime import datetime, timezone

from app.db import get_db
from app.schemas import ListenerSessionCreate, ListenerSessionRead, ListenerSessionUpdate
from app.models.models import ListenerSession, Meeting, UserOrganization, User
from app.core.auth import get_current_user
from app.tasks import enqueue_listener_join

router = APIRouter(prefix="/listeners", tags=["listeners"]) 


@router.post("/", response_model=ListenerSessionRead)
async def schedule_listener(payload: ListenerSessionCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    # If meeting_id provided, ensure membership
    if payload.meeting_id:
        q = await db.execute(select(Meeting).filter_by(id=payload.meeting_id))
        meeting = q.scalars().first()
        if not meeting:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Meeting not found")
        # check membership
        if meeting.organization_id:
            q2 = await db.execute(select(UserOrganization).filter_by(user_id=current_user.id, organization_id=meeting.organization_id))
            if not q2.scalars().first():
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not a member of the organization")

    session = ListenerSession(
        meeting_id=payload.meeting_id,
        external_link=payload.external_link,
        scheduled_at=payload.scheduled_at,
        status="scheduled",
        consent_record=None,
    )
    db.add(session)
    await db.commit()
    await db.refresh(session)

    # enqueue join job at scheduled time (or immediately)
    now = datetime.now(timezone.utc)
    countdown = 0
    if session.scheduled_at:
        delta = session.scheduled_at - now
        countdown = max(0, int(delta.total_seconds()))
    enqueue_listener_join(session.id, countdown=countdown)

    return session


@router.get("/{session_id}", response_model=ListenerSessionRead)
async def get_session(session_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    q = await db.execute(select(ListenerSession).filter_by(id=session_id))
    s = q.scalars().first()
    if not s:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listener session not found")
    # if linked to meeting, check membership
    if s.meeting_id:
        q2 = await db.execute(select(Meeting).filter_by(id=s.meeting_id))
        meeting = q2.scalars().first()
        if meeting and meeting.organization_id:
            q3 = await db.execute(select(UserOrganization).filter_by(user_id=current_user.id, organization_id=meeting.organization_id))
            if not q3.scalars().first():
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not a member of the organization")
    return s


@router.get("/org/{org_id}", response_model=List[ListenerSessionRead])
async def list_org_sessions(org_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    q = await db.execute(select(UserOrganization).filter_by(user_id=current_user.id, organization_id=org_id))
    if not q.scalars().first():
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not a member of the organization")
    q2 = await db.execute(select(ListenerSession).join(Meeting).filter(Meeting.organization_id == org_id))
    sessions = q2.scalars().all()
    return sessions


@router.patch("/{session_id}", response_model=ListenerSessionRead)
async def update_session(session_id: int, payload: ListenerSessionUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    q = await db.execute(select(ListenerSession).filter_by(id=session_id))
    s = q.scalars().first()
    if not s:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listener session not found")
    # basic permission: if linked to meeting, require membership
    if s.meeting_id:
        q2 = await db.execute(select(Meeting).filter_by(id=s.meeting_id))
        meeting = q2.scalars().first()
        if meeting and meeting.organization_id:
            q3 = await db.execute(select(UserOrganization).filter_by(user_id=current_user.id, organization_id=meeting.organization_id))
            if not q3.scalars().first():
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not a member of the organization")

    for field, value in payload.model_dump(exclude_unset=True).items():
        # map consent -> consent_record
        if field == "consent":
            setattr(s, "consent_record", value)
        else:
            setattr(s, field, value)
    db.add(s)
    await db.commit()
    await db.refresh(s)
    return s


@router.post("/{session_id}/cancel")
async def cancel_session(session_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    q = await db.execute(select(ListenerSession).filter_by(id=session_id))
    s = q.scalars().first()
    if not s:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listener session not found")
    # permission checks as above
    if s.meeting_id:
        q2 = await db.execute(select(Meeting).filter_by(id=s.meeting_id))
        meeting = q2.scalars().first()
        if meeting and meeting.organization_id:
            q3 = await db.execute(select(UserOrganization).filter_by(user_id=current_user.id, organization_id=meeting.organization_id))
            if not q3.scalars().first():
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not a member of the organization")
    s.status = "cancelled"
    db.add(s)
    await db.commit()
    return {"status": "cancelled"}
