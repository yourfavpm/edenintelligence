from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_, distinct
from typing import List, Optional
from sqlalchemy.orm import selectinload

from app.db import get_db
from app.schemas import MeetingRead, ParticipantRead, RecordingRead, TranscriptRead, SummaryRead, ExtractionRead
from app.models.models import Meeting, Participant, Recording, Transcript, MeetingSummary, Extraction, UserOrganization, User
from app.core.auth import get_current_user

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/meetings", response_model=List[MeetingRead])
async def list_meetings_dashboard(org_id: Optional[int] = Query(None), limit: int = 20, offset: int = 0, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    from app.models.models import AudioFile
    from sqlalchemy.orm import selectinload
    from sqlalchemy import desc
    
    if org_id:
        q = await db.execute(select(UserOrganization).filter_by(user_id=current_user.id, organization_id=org_id))
        if not q.scalars().first():
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not a member of the organization")
        
        q2 = await db.execute(
            select(Meeting)
            .filter_by(organization_id=org_id)
            .options(
                selectinload(Meeting.participants),
                selectinload(Meeting.recordings),
                selectinload(Meeting.organizer)
            )
            .order_by(desc(Meeting.created_at))  # Sort by most recent first
            .limit(limit).offset(offset)
        )
        meetings = q2.scalars().unique().all()
    else:
        # Secure default: show meetings relevant to the user
        q2 = await db.execute(
            select(Meeting).distinct()
            .outerjoin(Participant, Meeting.participants)
            .outerjoin(UserOrganization, Meeting.organization_id == UserOrganization.organization_id)
            .filter(
                or_(
                    Meeting.organizer_id == current_user.id,
                    Participant.email == current_user.email,
                    UserOrganization.user_id == current_user.id
                )
            )
            .options(
                selectinload(Meeting.participants),
                selectinload(Meeting.recordings),
                selectinload(Meeting.organizer),
                selectinload(Meeting.audio_files)
            )
            .order_by(desc(Meeting.created_at))  # Sort by most recent first
            .limit(limit).offset(offset)
        )
        meetings = q2.scalars().unique().all() # Use .unique() for distinct results with relationships
    
    return meetings


from app.schemas import MeetingRead, ParticipantRead, RecordingRead, TranscriptRead, SummaryRead, ExtractionRead, MeetingDetailRead

@router.get("/meetings/{meeting_id}/detail", response_model=MeetingDetailRead)
async def meeting_detail(meeting_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    # fetch meeting with relationships to avoid lazy-loading during serialization
    q = await db.execute(
        select(Meeting)
        .filter_by(id=meeting_id)
        .options(
            selectinload(Meeting.participants),
            selectinload(Meeting.recordings),
            selectinload(Meeting.audio_files),
            selectinload(Meeting.summaries),
            selectinload(Meeting.extractions),
            selectinload(Meeting.transcripts),
            selectinload(Meeting.organizer)
        )
    )
    meeting = q.scalars().first()
    if not meeting:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Meeting not found")
    
    # Check access
    if meeting.organization_id:
        q2 = await db.execute(select(UserOrganization).filter_by(user_id=current_user.id, organization_id=meeting.organization_id))
        if not q2.scalars().first():
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not a member of the organization")

    print(f"DEBUG: Processing detail for meeting {meeting_id}")

    # fetch other components explicitly
    pr = await db.execute(select(Participant).filter_by(meeting_id=meeting_id))
    participants = pr.scalars().all()
    
    rr = await db.execute(select(Recording).filter_by(meeting_id=meeting_id))
    recordings = rr.scalars().all()
    
    from app.models.models import AudioFile
    af = await db.execute(select(AudioFile).filter_by(meeting_id=meeting_id))
    audio_files = af.scalars().all()
    
    tr = await db.execute(select(Transcript).filter_by(meeting_id=meeting_id))
    transcripts = tr.scalars().all()
    
    from app.models.models import MeetingSummary
    sr = await db.execute(select(MeetingSummary).filter_by(meeting_id=meeting_id))
    summaries = sr.scalars().all()
    
    from app.models.models import Extraction
    er = await db.execute(select(Extraction).filter_by(meeting_id=meeting_id))
    extractions = er.scalars().all()

    # assemble DTO
    print(f"DEBUG: Returning detail for meeting {meeting_id}: {len(audio_files)} audio files, {len(transcripts)} transcripts, {len(summaries)} summaries, {len(extractions)} extractions")
    
    return {
        "meeting": meeting,
        "participants": participants,
        "recordings": recordings,
        "audio_files": audio_files,
        "transcripts": transcripts,
        "summaries": summaries,
        "extractions": extractions,
    }

