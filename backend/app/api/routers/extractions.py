from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
import json

from app.db import get_db
from app.schemas import ExtractionRead, ExtractionItem
from app.models.models import Extraction, Transcript, Meeting, UserOrganization, User
from app.core.auth import get_current_user
from app.tasks import enqueue_extraction

from typing import Optional

router = APIRouter(prefix="/extractions", tags=["extractions"]) 


@router.get("/", response_model=List[ExtractionRead])
async def list_extractions(
    skip: int = 0, 
    limit: int = 20, 
    meeting_id: Optional[int] = None, 
    db: AsyncSession = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    query = select(Extraction).join(Meeting, Extraction.meeting_id == Meeting.id)
    
    # Filter by meeting if provided
    if meeting_id:
        query = query.filter(Extraction.meeting_id == meeting_id)
        
        # Verify access to this meeting
        q_meeting = await db.execute(select(Meeting).filter_by(id=meeting_id))
        meeting = q_meeting.scalars().first()
        if not meeting:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Meeting not found")
            
        # Check org membership if applicable
        if meeting.organization_id:
             q_org = await db.execute(select(UserOrganization).filter_by(user_id=current_user.id, organization_id=meeting.organization_id))
             if not q_org.scalars().first():
                 raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not a member of the organization")
        elif meeting.organizer_id != current_user.id:
             # Basic check for personal meetings
             raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    else:
        # If no specific meeting, filter by user's access
        # This is complex in a single query, so roughly:
        # 1. Get user's orgs
        # 2. Filter meetings by (organizer_id=user OR org_id IN user_orgs)
        
        # Access Check Logic:
        # User sees extractions from:
        # - Meetings they organized
        # - Meetings in their organizations
        
        # Get user's organization IDs
        org_res = await db.execute(select(UserOrganization.organization_id).filter_by(user_id=current_user.id))
        org_ids = [row[0] for row in org_res.all()]
        
        # Apply filter
        if org_ids:
            query = query.filter(
                (Meeting.organizer_id == current_user.id) | 
                (Meeting.organization_id.in_(org_ids))
            )
        else:
            query = query.filter(Meeting.organizer_id == current_user.id)

    query = query.offset(skip).limit(limit)
    res = await db.execute(query)
    extractions = res.scalars().all()
    
    # Parse items JSON
    results = []
    for ex in extractions:
         items = json.loads(ex.items)
         typed_items = [ExtractionItem(**i) for i in items]
         results.append(
             ExtractionRead(
                 id=ex.id, 
                 transcript_id=ex.transcript_id, 
                 meeting_id=ex.meeting_id, 
                 items=typed_items, 
                 confidence=float(ex.confidence) if ex.confidence else None, 
                 created_at=ex.created_at
             )
         )
         
    return results 


@router.post("/", status_code=202)
async def request_extraction(transcript_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    res = await db.execute(select(Transcript).filter_by(id=transcript_id))
    t = res.scalars().first()
    if not t:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transcript not found")
    if t.meeting_id:
        q = await db.execute(select(Meeting).filter_by(id=t.meeting_id))
        meeting = q.scalars().first()
        if meeting and meeting.organization_id:
            q2 = await db.execute(select(UserOrganization).filter_by(user_id=current_user.id, organization_id=meeting.organization_id))
            if not q2.scalars().first():
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not a member of the organization")

    enqueue_extraction(t.id)
    return {"status": "accepted", "transcript_id": t.id}


@router.get("/{extraction_id}", response_model=ExtractionRead)
async def get_extraction(extraction_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    q = await db.execute(select(Extraction).filter_by(id=extraction_id))
    ex = q.scalars().first()
    if not ex:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Extraction not found")
    if ex.meeting_id:
        q2 = await db.execute(select(Meeting).filter_by(id=ex.meeting_id))
        meeting = q2.scalars().first()
        if meeting and meeting.organization_id:
            q3 = await db.execute(select(UserOrganization).filter_by(user_id=current_user.id, organization_id=meeting.organization_id))
            if not q3.scalars().first():
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not a member of the organization")
    items = json.loads(ex.items)
    # map to typed objects
    typed = [ExtractionItem(**i) for i in items]
    return ExtractionRead(id=ex.id, transcript_id=ex.transcript_id, meeting_id=ex.meeting_id, items=typed, confidence=float(ex.confidence) if ex.confidence else None, created_at=ex.created_at)
