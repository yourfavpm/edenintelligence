from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, text
from typing import List
from app.db import get_db
from app.schemas import MeetingCreate, MeetingRead, MeetingUpdate, ParticipantCreate, ParticipantRead, RecordingCreate, RecordingRead
from app.models.models import Meeting, Participant, Recording, UserOrganization, User
from app.core.auth import get_current_user
from app.tasks import enqueue_recording_processing
from sqlalchemy import select as _select
from app.models.models import ConsentRecord

router = APIRouter(prefix="/meetings", tags=["meetings"])


@router.post("/", response_model=MeetingRead)
async def create_meeting(payload: MeetingCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    # validate external link for external meetings
    if payload.meeting_type and payload.meeting_type.name == "EXTERNAL" and not payload.external_link:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="external_link required for external meetings")

    # check organization membership if provided
    if payload.organization_id:
        q = await db.execute(select(UserOrganization).filter_by(user_id=current_user.id, organization_id=payload.organization_id))
        if not q.scalars().first():
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Must be a member of the organization to create meetings")

    meeting = Meeting(
        title=payload.title,
        description=payload.description,
        start_time=payload.start_time,
        duration_minutes=payload.duration_minutes,
        organizer_id=current_user.id if not payload.organizer_id else payload.organizer_id,
        organization_id=payload.organization_id,
        meeting_type=payload.meeting_type,
        external_link=payload.external_link,
        ai_transcription=bool(payload.ai_transcription),
        ai_translation=bool(payload.ai_translation),
        ai_recording=bool(payload.ai_recording),
    )
    db.add(meeting)
    await db.commit()
    await db.refresh(meeting)
    return meeting


@router.get("/{meeting_id}", response_model=MeetingRead)
async def get_meeting(meeting_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    q = await db.execute(select(Meeting).filter_by(id=meeting_id))
    meeting = q.scalars().first()
    if not meeting:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Meeting not found")
    # permission: user must belong to organization if meeting linked
    if meeting.organization_id:
        q2 = await db.execute(select(UserOrganization).filter_by(user_id=current_user.id, organization_id=meeting.organization_id))
        if not q2.scalars().first():
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not a member of the organization")
    return meeting


@router.get("/org/{org_id}", response_model=List[MeetingRead])
async def list_meetings(org_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    q = await db.execute(select(UserOrganization).filter_by(user_id=current_user.id, organization_id=org_id))
    if not q.scalars().first():
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not a member of the organization")
    q2 = await db.execute(select(Meeting).filter_by(organization_id=org_id))
    meetings = q2.scalars().all()
    return meetings


@router.put("/{meeting_id}", response_model=MeetingRead)
async def update_meeting(meeting_id: int, payload: MeetingUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    q = await db.execute(select(Meeting).filter_by(id=meeting_id))
    meeting = q.scalars().first()
    if not meeting:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Meeting not found")
    # permission: only organizer or org admin can update
    if meeting.organization_id:
        q2 = await db.execute(select(UserOrganization).filter_by(user_id=current_user.id, organization_id=meeting.organization_id))
        membership = q2.scalars().first()
        if not membership:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not a member of the organization")
        if membership.role not in ("admin", "organizer") and meeting.organizer_id != current_user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient role to update meeting")

    # apply updates
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(meeting, field, value)
    db.add(meeting)
    await db.commit()
    await db.refresh(meeting)
    return meeting




@router.post("/{meeting_id}/participants", response_model=List[ParticipantRead])
async def add_participants(meeting_id: int, emails: List[str], db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    q = await db.execute(select(Meeting).filter_by(id=meeting_id))
    meeting = q.scalars().first()
    if not meeting:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Meeting not found")
    # permission: must be organizer or org member
    if meeting.organization_id:
        q2 = await db.execute(select(UserOrganization).filter_by(user_id=current_user.id, organization_id=meeting.organization_id))
        if not q2.scalars().first():
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not a member of the organization")
    created = []
    for e in emails:
        p = Participant(meeting_id=meeting_id, email=e)
        db.add(p)
        await db.flush()
        await db.refresh(p)
        created.append(p)
    await db.commit()
    return created


@router.post("/{meeting_id}/recordings", response_model=RecordingRead)
async def upload_recording(meeting_id: int, payload: RecordingCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    q = await db.execute(select(Meeting).filter_by(id=meeting_id))
    meeting = q.scalars().first()
    if not meeting:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Meeting not found")
    # require explicit consent for recordings when meeting.ai_recording is True
    if meeting.ai_recording:
        q_con = await db.execute(_select(ConsentRecord).filter_by(meeting_id=meeting_id, consent_given=True))
        consent = q_con.scalars().first()
        if not consent:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="No consent recorded for recording this meeting")

    recording = Recording(meeting_id=meeting_id, s3_key=payload.s3_key, duration_seconds=payload.duration_seconds)
    db.add(recording)
    await db.commit()
    await db.refresh(recording)

    # Enqueue async processing (idempotent by recording id)
    enqueue_recording_processing(recording.id)

    return recording


@router.get("/{meeting_id}/recordings/{recording_id}", response_model=RecordingRead)
async def get_recording_status(meeting_id: int, recording_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    q = await db.execute(select(Recording).filter_by(id=recording_id, meeting_id=meeting_id))
    rec = q.scalars().first()
    if not rec:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recording not found")
    # permission: if meeting is org-scoped, ensure membership
    if rec.meeting_id:
        q2 = await db.execute(select(Meeting).filter_by(id=rec.meeting_id))
        meeting = q2.scalars().first()
        if meeting and meeting.organization_id:
            q3 = await db.execute(select(UserOrganization).filter_by(user_id=current_user.id, organization_id=meeting.organization_id))
            if not q3.scalars().first():
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not a member of the organization")
    return rec


@router.delete("/{meeting_id}")
async def delete_meeting(meeting_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Delete meeting and all associated data"""
    from app.models.models import AudioFile, Transcript, MeetingSummary, Extraction, TranslatedTranscript, Participant, Recording, UserOrganization
    from app.storage import storage
    
    q = await db.execute(select(Meeting).filter_by(id=meeting_id))
    meeting = q.scalars().first()
    if not meeting:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Meeting not found")
    
    # Only organizer or organization admin can delete
    is_organizer = meeting.organizer_id == current_user.id
    is_admin = False
    if meeting.organization_id:
        q_admin = await db.execute(select(UserOrganization).filter_by(user_id=current_user.id, organization_id=meeting.organization_id, role="admin"))
        if q_admin.scalars().first():
            is_admin = True
            
    if not is_organizer and not is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only the organizer or an organization admin can delete meetings")
    
    # Delete all audio files from storage
    audio_files_q = await db.execute(select(AudioFile).filter_by(meeting_id=meeting_id))
    audio_files = audio_files_q.scalars().all()
    for audio in audio_files:
        try:
            await storage.delete(audio.s3_key)
        except Exception as e:
            print(f"Warning: Failed to delete audio from storage: {e}")
    
    # Delete all recordings from storage
    recordings_q = await db.execute(select(Recording).filter_by(meeting_id=meeting_id))
    recordings = recordings_q.scalars().all()
    for recording in recordings:
        try:
            await storage.delete(recording.s3_key)
        except Exception as e:
            print(f"Warning: Failed to delete recording from storage: {e}")

    # Delete all related database records manually to ensure cleanup
    
    await db.execute(text("DELETE FROM meeting_summaries WHERE meeting_id = :mid").bindparams(mid=meeting_id))
    await db.execute(text("DELETE FROM extractions WHERE meeting_id = :mid").bindparams(mid=meeting_id))
    await db.execute(text("DELETE FROM translated_transcripts WHERE meeting_id = :mid").bindparams(mid=meeting_id))
    await db.execute(text("DELETE FROM transcripts WHERE meeting_id = :mid").bindparams(mid=meeting_id))
    await db.execute(text("DELETE FROM audio_files WHERE meeting_id = :mid").bindparams(mid=meeting_id))
    await db.execute(text("DELETE FROM recordings WHERE meeting_id = :mid").bindparams(mid=meeting_id))
    await db.execute(text("DELETE FROM participants WHERE meeting_id = :mid").bindparams(mid=meeting_id))
    await db.execute(text("DELETE FROM consent_records WHERE meeting_id = :mid").bindparams(mid=meeting_id))

    # Delete meeting
    await db.delete(meeting)
    await db.commit()
    
    return {"message": "Meeting deleted successfully"}
