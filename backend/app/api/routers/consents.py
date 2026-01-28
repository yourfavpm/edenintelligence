from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional

from app.db import get_db
from app.models.models import ConsentRecord, Meeting, UserOrganization, User
from app.core.auth import get_current_user

from pydantic import BaseModel

router = APIRouter(prefix="/consents", tags=["consents"])


class ConsentCreate(BaseModel):
    meeting_id: Optional[int]
    recording_id: Optional[int]
    consent_given: bool
    method: Optional[str]


class ConsentRead(BaseModel):
    id: int
    user_id: Optional[int]
    meeting_id: Optional[int]
    recording_id: Optional[int]
    consent_given: bool
    method: Optional[str]
    created_at: Optional[str]

    class Config:
        orm_mode = True


@router.post("/", response_model=ConsentRead, status_code=201)
async def create_consent(payload: ConsentCreate, request: Request, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    # if meeting-scoped, ensure user is member
    if payload.meeting_id:
        q = await db.execute(select(Meeting).filter_by(id=payload.meeting_id))
        m = q.scalars().first()
        if m and m.organization_id:
            q2 = await db.execute(select(UserOrganization).filter_by(user_id=current_user.id, organization_id=m.organization_id))
            if not q2.scalars().first():
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not a member of the organization")

    cr = ConsentRecord(user_id=current_user.id, meeting_id=payload.meeting_id, recording_id=payload.recording_id, consent_given=bool(payload.consent_given), method=payload.method, ip_address=request.client.host if request.client else None)
    db.add(cr)
    await db.commit()
    await db.refresh(cr)
    return cr


@router.get("/meeting/{meeting_id}", response_model=List[ConsentRead])
async def list_consents_for_meeting(meeting_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    q = await db.execute(select(ConsentRecord).filter_by(meeting_id=meeting_id))
    items = q.scalars().all()
    return items
