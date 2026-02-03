from pydantic import BaseModel, EmailStr, field_validator, model_validator, ConfigDict
from typing import List, Optional, Any
from datetime import datetime
import json

class ParticipantCreate(BaseModel):
    email: EmailStr
    display_name: Optional[str] = None
    is_host: Optional[bool] = False

class ParticipantRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    email: EmailStr
    display_name: Optional[str]
    is_host: bool

class MeetingCreate(BaseModel):
    title: str
    description: Optional[str] = None
    language: str = "en"
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None

class MeetingRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    description: Optional[str]
    language: str
    participants: List[ParticipantRead] = []

class RecordingCreate(BaseModel):
    s3_key: str
    duration_seconds: Optional[int] = None

class RecordingRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    s3_key: str
    duration_seconds: Optional[int]
    processed: bool
    processing_status: Optional[str]
    processing_error: Optional[str]
    transcript_id: Optional[int]

# --- Meeting schemas ---
from enum import Enum as PyEnum

class MeetingType(str, PyEnum):
    NATIVE = "native"
    EXTERNAL = "external"

class MeetingCreate(BaseModel):
    title: str
    description: Optional[str] = None
    start_time: Optional[datetime] = None
    duration_minutes: Optional[int] = None
    organizer_id: Optional[int] = None
    organization_id: Optional[int] = None
    meeting_type: MeetingType = MeetingType.NATIVE
    external_link: Optional[str] = None
    ai_transcription: Optional[bool] = False
    ai_translation: Optional[bool] = False
    ai_recording: Optional[bool] = False

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
    id: int
    title: str
    description: Optional[str]
    start_time: Optional[datetime]
    duration_minutes: Optional[int]
    organizer_id: Optional[int]
    organization_id: Optional[int]
    meeting_type: MeetingType
    external_link: Optional[str]
    ai_transcription: bool
    ai_translation: bool
    ai_recording: bool
    participants: List[ParticipantRead] = []
    recordings: List[RecordingRead] = []
    created_at: Optional[datetime]

# --- Auth & Organization schemas ---
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    display_name: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class AuthResponse(Token):
    refresh_token: str

class TokenRefresh(BaseModel):
    refresh_token: str

class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
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
    id: int
    name: str

class MembershipRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: int
    organization_id: int
    role: str

class EmailDeliveryRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: int
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
    meeting_id: Optional[int] = None
    external_link: Optional[str] = None
    scheduled_at: Optional[datetime] = None
    consent: Optional[Any] = None

class ListenerSessionUpdate(BaseModel):
    scheduled_at: Optional[datetime] = None
    consent: Optional[Any] = None
    status: Optional[ListenerStatus] = None

class ListenerSessionRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    meeting_id: Optional[int]
    external_link: Optional[str]
    scheduled_at: Optional[datetime]
    join_at: Optional[datetime]
    left_at: Optional[datetime]
    status: ListenerStatus
    consent_record: Optional[Any]

# --- Audio ingestion schemas ---
class AudioIngestCreate(BaseModel):
    meeting_id: Optional[int] = None
    filename: Optional[str] = None
    content_type: Optional[str] = None
    meta: Optional[dict] = None

class AudioIngestRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    meeting_id: Optional[int]
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
    speaker_id: str
    start_time: float
    end_time: float
    original_text: str
    detected_language: Optional[str] = None

    @model_validator(mode='before')
    @classmethod
    def map_legacy_fields(cls, data: Any) -> Any:
        if isinstance(data, dict):
            if 'speaker' in data and 'speaker_id' not in data:
                data['speaker_id'] = data['speaker']
            if 'text' in data and 'original_text' not in data:
                data['original_text'] = data['text']
        return data

class TranscriptRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    audio_file_id: int
    meeting_id: Optional[int]
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
    speaker_id: str
    start_time: float
    end_time: float
    original_text: str
    translated_text: str
    detected_language: Optional[str] = None

    @model_validator(mode='before')
    @classmethod
    def map_legacy_fields(cls, data: Any) -> Any:
        if isinstance(data, dict):
            if 'speaker' in data and 'speaker_id' not in data:
                data['speaker_id'] = data['speaker']
            if 'text' in data and 'translated_text' not in data:
                # Fallback: if 'translated_text' is missing but 'text' is there, use it
                if 'translated_text' not in data:
                    data['translated_text'] = data['text']
            if 'original_text' not in data and 'text' in data:
                data['original_text'] = data['text']
        return data

class TranslatedTranscriptRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    transcript_id: int
    audio_file_id: Optional[int]
    meeting_id: Optional[int]
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
    transcript_id: int
    length: Optional[str] = "short"  # short|medium|long
    tone: Optional[str] = "formal"   # formal|conversational

class SummaryRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    transcript_id: Optional[int]
    meeting_id: Optional[int]
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
    id: int
    transcript_id: int
    meeting_id: Optional[int]
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


