from sqlalchemy import Column, String, Integer, ForeignKey, DateTime, Boolean, Text
from sqlalchemy import Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db import Base
from enum import Enum
from sqlalchemy.sql import text

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    display_name = Column(String, nullable=True)
    hashed_password = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    google_id = Column(String, unique=True, index=True, nullable=True)
    preferred_language = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    organizations = relationship("UserOrganization", back_populates="user")

class Meeting(Base):
    __tablename__ = "meetings"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    language = Column(String, default="en")
    start_time = Column(DateTime(timezone=True), nullable=True)
    duration_minutes = Column(Integer, nullable=True)
    end_time = Column(DateTime(timezone=True), nullable=True)
    organizer_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=True)
    # meeting type
    class MeetingType(Enum):
        NATIVE = "native"
        EXTERNAL = "external"
    meeting_type = Column(SQLEnum(MeetingType), default=MeetingType.NATIVE)
    external_link = Column(String, nullable=True)
    # AI feature toggles
    ai_transcription = Column(Boolean, default=False)
    ai_translation = Column(Boolean, default=False)
    ai_recording = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    participants = relationship("Participant", back_populates="meeting", cascade="all, delete-orphan")
    recordings = relationship("Recording", back_populates="meeting", cascade="all, delete-orphan")
    audio_files = relationship("AudioFile", back_populates="meeting", cascade="all, delete-orphan")
    transcripts = relationship("Transcript", back_populates="meeting", cascade="all, delete-orphan")
    summaries = relationship("MeetingSummary", back_populates="meeting", cascade="all, delete-orphan")
    extractions = relationship("Extraction", back_populates="meeting", cascade="all, delete-orphan")
    organization = relationship("Organization")
    organizer = relationship("User")

class Participant(Base):
    __tablename__ = "participants"
    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id"), nullable=False)
    email = Column(String, nullable=False)
    display_name = Column(String, nullable=True)
    is_host = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    meeting = relationship("Meeting", back_populates="participants")

class Recording(Base):
    __tablename__ = "recordings"
    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id"), nullable=False)
    s3_key = Column(String, nullable=False)
    duration_seconds = Column(Integer, nullable=True)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())
    processed = Column(Boolean, default=False)
    processing_status = Column(String, nullable=False, default="uploaded")  # uploaded|processing|processed|failed
    processing_error = Column(Text, nullable=True)
    transcript_id = Column(Integer, ForeignKey("transcripts.id"), nullable=True)
    meeting = relationship("Meeting", back_populates="recordings")


class Organization(Base):
    __tablename__ = "organizations"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    members = relationship("UserOrganization", back_populates="organization")


class UserOrganization(Base):
    __tablename__ = "user_organizations"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=False)
    role = Column(String, nullable=False, default="participant")  # admin|organizer|participant
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    user = relationship("User", back_populates="organizations")
    organization = relationship("Organization", back_populates="members")


class ListenerSession(Base):
    __tablename__ = "listener_sessions"
    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id"), nullable=True)
    external_link = Column(String, nullable=True)
    scheduled_at = Column(DateTime(timezone=True), nullable=True)
    join_at = Column(DateTime(timezone=True), nullable=True)
    left_at = Column(DateTime(timezone=True), nullable=True)
    status = Column(String, nullable=False, default="scheduled")  # scheduled|joining|joined|left|cancelled|failed
    consent_record = Column(Text, nullable=True)  # JSON/text storing consent details
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    meeting = relationship("Meeting")


class AudioFile(Base):
    __tablename__ = "audio_files"
    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id"), nullable=True)
    s3_key = Column(String, nullable=False, unique=True)
    content_type = Column(String, nullable=True)
    size_bytes = Column(Integer, nullable=True)
    processed = Column(Boolean, default=False)
    meta = Column("metadata", Text, nullable=True)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())

    meeting = relationship("Meeting", back_populates="audio_files")


class Transcript(Base):
    __tablename__ = "transcripts"
    id = Column(Integer, primary_key=True, index=True)
    audio_file_id = Column(Integer, ForeignKey("audio_files.id"), nullable=False)
    meeting_id = Column(Integer, ForeignKey("meetings.id"), nullable=True)
    segments = Column(Text, nullable=False)  # JSON array of segments (may be encrypted)
    encrypted = Column(Boolean, default=False)
    detected_language = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    audio_file = relationship("AudioFile")
    meeting = relationship("Meeting")


class TranslatedTranscript(Base):
    __tablename__ = "translated_transcripts"
    id = Column(Integer, primary_key=True, index=True)
    transcript_id = Column(Integer, ForeignKey("transcripts.id"), nullable=False)
    audio_file_id = Column(Integer, ForeignKey("audio_files.id"), nullable=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id"), nullable=True)
    target_language = Column(String, nullable=False)
    segments = Column(Text, nullable=False)  # JSON array of translated segments
    encrypted = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    transcript = relationship("Transcript")
    audio_file = relationship("AudioFile")
    meeting = relationship("Meeting")


class MeetingSummary(Base):
    __tablename__ = "meeting_summaries"
    id = Column(Integer, primary_key=True, index=True)
    transcript_id = Column(Integer, ForeignKey("transcripts.id"), nullable=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id"), nullable=True)
    executive_summary = Column(Text, nullable=False)
    key_points = Column(Text, nullable=True)  # JSON/text array
    decisions = Column(Text, nullable=True)
    risks = Column(Text, nullable=True)
    encrypted = Column(Boolean, default=False)
    length = Column(String, nullable=True)  # short|medium|long
    tone = Column(String, nullable=True)    # formal|conversational
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    transcript = relationship("Transcript")
    meeting = relationship("Meeting")


class Extraction(Base):
    __tablename__ = "extractions"
    id = Column(Integer, primary_key=True, index=True)
    transcript_id = Column(Integer, ForeignKey("transcripts.id"), nullable=False)
    meeting_id = Column(Integer, ForeignKey("meetings.id"), nullable=True)
    items = Column(Text, nullable=False)  # JSON array of extracted items
    encrypted = Column(Boolean, default=False)
    confidence = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    transcript = relationship("Transcript")
    meeting = relationship("Meeting")


class EmailDelivery(Base):
    __tablename__ = "email_deliveries"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    to_email = Column(String, nullable=False)
    subject = Column(String, nullable=False)
    body = Column(Text, nullable=False)
    status = Column(String, nullable=False, default="pending")  # pending|sent|failed
    error = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    sent_at = Column(DateTime(timezone=True), nullable=True)

    user = relationship("User")


class ConsentRecord(Base):
    __tablename__ = "consent_records"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id"), nullable=True)
    recording_id = Column(Integer, ForeignKey("recordings.id"), nullable=True)
    consent_given = Column(Boolean, nullable=False, default=False)
    method = Column(String, nullable=True)  # e.g., "web", "checkbox", "spoken"
    ip_address = Column(String, nullable=True)
    user_agent = Column(String, nullable=True)
    details = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    action = Column(String, nullable=False)
    object_type = Column(String, nullable=True)
    object_id = Column(String, nullable=True)
    details = Column(Text, nullable=True)
    ip_address = Column(String, nullable=True)
    user_agent = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

