from pydantic import BaseModel, EmailStr, field_validator, model_validator, ConfigDict, Field, AliasChoices
from typing import List, Optional, Any
from datetime import datetime
from uuid import UUID
import json

class ParticipantCreate(BaseModel):
    email: Optional[str] = None
    display_name: Optional[str] = None
    is_host: Optional[bool] = False

class ParticipantRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    email: Optional[str] = None
    display_name: Optional[str] = None
    is_host: bool = False

class MeetingCreate(BaseModel):
    title: str
    description: Optional[str] = None
    language: str = "en"
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None

# --- Meeting schemas ---
class RecordingCreate(BaseModel):
    s3_key: str
    duration_seconds: Optional[int] = None

class RecordingRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    s3_key: str
    duration_seconds: Optional[int]
    processed: bool
    processing_status: Optional[str]
    processing_error: Optional[str]
    transcript_id: Optional[UUID]

# --- Meeting schemas ---
from enum import Enum as PyEnum

class MeetingType(str, PyEnum):
    NATIVE = "NATIVE"
    EXTERNAL = "EXTERNAL"

class MeetingCreate(BaseModel):
    title: str
    description: Optional[str] = None
    start_time: Optional[datetime] = None
    duration_minutes: Optional[int] = None
    organizer_id: Optional[UUID] = None
    organization_id: Optional[UUID] = None
    meeting_type: MeetingType = MeetingType.NATIVE
    external_link: Optional[str] = None
    ai_transcription: Optional[bool] = False
    ai_translation: Optional[bool] = False
    ai_recording: Optional[bool] = False
    # Scheduling fields
    reminder_10m: Optional[bool] = False
    reminder_at_time: Optional[bool] = False
    calendar_event_id: Optional[str] = None
    schedule_status: Optional[str] = None
    participant_names: Optional[List[str]] = []

    def validate_external(self):
        if self.meeting_type == MeetingType.EXTERNAL and not self.external_link:
            raise ValueError("external_link is required for external meetings")

class MeetingUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    start_time: Optional[datetime] = None
    duration_minutes: Optional[int] = None
    meeting_type: Optional[MeetingType] = None
    external_link: Optional[str] = None
    ai_transcription: Optional[bool] = None
    ai_translation: Optional[bool] = None
    ai_recording: Optional[bool] = None

class MeetingRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    title: str
    description: Optional[str] = None
    start_time: Optional[datetime] = None
    duration_minutes: Optional[int] = None
    organizer_id: Optional[UUID] = None
    organization_id: Optional[UUID] = None
    meeting_type: Optional[MeetingType] = None
    external_link: Optional[str] = None
    ai_transcription: Optional[bool] = False
    ai_translation: Optional[bool] = False
    ai_recording: Optional[bool] = False
    # Scheduling fields
    reminder_10m: Optional[bool] = False
    reminder_at_time: Optional[bool] = False
    calendar_event_id: Optional[str] = None
    schedule_status: Optional[str] = None
    participants: List[ParticipantRead] = []
    recordings: List[RecordingRead] = []
    created_at: Optional[datetime] = None

# --- Auth & Organization schemas ---
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    display_name: Optional[str] = None

    @field_validator("password")
    def password_complexity(cls, v):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long")
        if not any(c.isupper() for c in v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not any(c.islower() for c in v):
            raise ValueError("Password must contain at least one lowercase letter")
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain at least one digit")
        if not any(not c.isalnum() for c in v):
            raise ValueError("Password must contain at least one special character")
        return v

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class AuthResponse(Token):
    refresh_token: str

class TokenRefresh(BaseModel):
    refresh_token: str

class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    email: EmailStr
    display_name: Optional[str]
    is_active: bool
    is_verified: bool
    preferred_language: Optional[str]

class UserUpdate(BaseModel):
    display_name: Optional[str] = None
    preferred_language: Optional[str] = None
    is_active: Optional[bool] = None
    is_verified: Optional[bool] = None

class EmailVerificationRequest(BaseModel):
    email: EmailStr

class VerifyEmail(BaseModel):
    token: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPassword(BaseModel):
    token: str
    new_password: str

class GoogleAuthRequest(BaseModel):
    id_token: str

class OrganizationCreate(BaseModel):
    name: str

class OrganizationRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    name: str

class MembershipRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    user_id: UUID
    organization_id: UUID
    role: str

class EmailDeliveryRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    user_id: UUID
    to_email: str
    subject: str
    body: str
    status: str
    error: Optional[str]
    created_at: Optional[datetime]
    sent_at: Optional[datetime]

# --- Listener session schemas ---
class ListenerStatus(str, PyEnum):
    SCHEDULED = "scheduled"
    JOINING = "joining"
    JOINED = "joined"
    LEFT = "left"
    CANCELLED = "cancelled"
    FAILED = "failed"

class ListenerSessionCreate(BaseModel):
    meeting_id: Optional[UUID] = None
    external_link: Optional[str] = None
    scheduled_at: Optional[datetime] = None
    consent: Optional[Any] = None

class ListenerSessionUpdate(BaseModel):
    scheduled_at: Optional[datetime] = None
    consent: Optional[Any] = None
    status: Optional[ListenerStatus] = None

class ListenerSessionRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    meeting_id: Optional[UUID]
    external_link: Optional[str]
    scheduled_at: Optional[datetime]
    join_at: Optional[datetime]
    left_at: Optional[datetime]
    status: ListenerStatus
    consent_record: Optional[Any]

# --- Audio ingestion schemas ---
class AudioIngestCreate(BaseModel):
    meeting_id: Optional[UUID] = None
    filename: Optional[str] = None
    content_type: Optional[str] = None
    meta: Optional[dict] = None

class AudioIngestRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    meeting_id: Optional[UUID]
    s3_key: str
    content_type: Optional[str]
    size_bytes: Optional[int]
    processed: bool
    processing_status: Optional[str] = "uploaded"
    meta: Optional[dict]
    uploaded_at: Optional[datetime]

    @model_validator(mode='before')
    @classmethod
    def set_processing_status(cls, data: Any) -> Any:
        if isinstance(data, dict):
            if data.get("processing_status") is None:
                data["processing_status"] = "processed" if data.get("processed") else "processing"
        else:
            try:
                if not getattr(data, "processing_status", None):
                    setattr(data, "processing_status", "processed" if getattr(data, "processed", False) else "processing")
            except:
                pass
        return data

    @field_validator("meta", mode='before')
    @classmethod
    def parse_meta(cls, v: Any) -> Any:
        if isinstance(v, str):
            try:
                return json.loads(v)
            except Exception:
                return {}
        return v

# --- Transcript schemas ---
class TranscriptSegment(BaseModel):
    speaker_id: str = Field(validation_alias=AliasChoices('speaker_id', 'speaker'))
    start_time: float
    end_time: float
    original_text: str = Field(validation_alias=AliasChoices('original_text', 'text'))
    detected_language: Optional[str] = None

class TranscriptRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    audio_file_id: UUID
    meeting_id: Optional[UUID]
    segments: List[TranscriptSegment]
    detected_language: Optional[str]
    created_at: Optional[datetime]

    @field_validator("segments", mode='before')
    @classmethod
    def parse_segments(cls, v: Any) -> Any:
        if isinstance(v, str):
            from app.core import crypto
            decocumented = crypto.decrypt_text(v)
            try:
                return json.loads(decocumented)
            except Exception:
                return []
        return v

# --- Translation schemas ---
class TranslatedSegment(BaseModel):
    speaker_id: str = Field(validation_alias=AliasChoices('speaker_id', 'speaker'))
    start_time: float
    end_time: float
    original_text: str = Field(validation_alias=AliasChoices('original_text', 'text'))
    translated_text: str
    detected_language: Optional[str] = None

    @model_validator(mode='before')
    @classmethod
    def map_legacy_fields(cls, data: Any) -> Any:
        if isinstance(data, dict):
             if 'text' in data and 'translated_text' not in data:
                 data['translated_text'] = data['text']
        return data

class TranslatedTranscriptRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    transcript_id: UUID
    audio_file_id: Optional[UUID]
    meeting_id: Optional[UUID]
    target_language: str
    segments: List[TranslatedSegment]
    created_at: Optional[datetime]

    @field_validator("segments", mode='before')
    @classmethod
    def parse_segments(cls, v: Any) -> Any:
        if isinstance(v, str):
            from app.core import crypto
            decocumented = crypto.decrypt_text(v)
            try:
                return json.loads(decocumented)
            except Exception:
                return []
        return v

# --- Summarization schemas ---
class SummaryCreate(BaseModel):
    transcript_id: UUID
    length: Optional[str] = "short"  # short|medium|long
    tone: Optional[str] = "formal"   # formal|conversational

class SummaryRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    transcript_id: Optional[UUID]
    meeting_id: Optional[UUID]
    executive_summary: str
    key_points: List[str] = []
    decisions: List[str] = []
    risks: List[str] = []
    length: Optional[str]
    tone: Optional[str]
    created_at: Optional[datetime]

    @field_validator("key_points", "decisions", "risks", mode='before')
    @classmethod
    def parse_json_lists(cls, v: Any) -> Any:
        if isinstance(v, str):
            try:
                return json.loads(v)
            except Exception:
                return []
        if v is None:
            return []
        return v

# --- Extraction schemas ---
class ExtractionItem(BaseModel):
    text: str
    owner: Optional[str] = None
    due_date: Optional[str] = None
    decision: bool = False
    confidence: float

class ExtractionRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    transcript_id: UUID
    meeting_id: Optional[UUID]
    items: List[ExtractionItem]
    confidence: Optional[float]
    created_at: Optional[datetime]

    @field_validator("items", mode='before')
    @classmethod
    def parse_items(cls, v: Any) -> Any:
        if isinstance(v, str):
            try:
                return json.loads(v)
            except Exception:
                return []
        return v

class MeetingDetailRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    meeting: MeetingRead
    participants: List[ParticipantRead]
    recordings: List[RecordingRead]
    audio_files: List[AudioIngestRead]
    transcripts: List[TranscriptRead]
    summaries: List[SummaryRead]
    extractions: List[ExtractionRead]


