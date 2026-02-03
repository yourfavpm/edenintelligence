// =============================================================================
// API Types - Aligned with Backend Schemas
// =============================================================================

// --- Enums ---
export type MeetingType = 'native' | 'external';

export type ProcessingStatus =
  | 'uploaded'
  | 'processing'
  | 'processed'
  | 'failed';

export type ListenerStatus =
  | 'scheduled'
  | 'joining'
  | 'joined'
  | 'left'
  | 'cancelled'
  | 'failed';

// --- Participant ---
export interface Participant {
  id: number;
  email: string;
  display_name: string | null;
  is_host: boolean;
}

export interface ParticipantCreate {
  email: string;
  display_name?: string;
  is_host?: boolean;
}

// --- Recording ---
export interface Recording {
  id: number;
  s3_key: string;
  duration_seconds: number | null;
  processed: boolean;
  processing_status: ProcessingStatus;
  processing_error: string | null;
  transcript_id: number | null;
}

// --- Meeting ---
export interface Meeting {
  id: number;
  title: string;
  description: string | null;
  start_time: string | null;
  duration_minutes: number | null;
  organizer_id: number | null;
  organization_id: number | null;
  meeting_type: MeetingType;
  external_link: string | null;
  ai_transcription: boolean;
  ai_translation: boolean;
  ai_recording: boolean;
  participants: Participant[];
  recordings: Recording[];
  audio_files?: AudioIngestRead[];  // Optional for backwards compatibility
  created_at: string | null;
}

export interface MeetingCreate {
  title: string;
  description?: string;
  start_time?: string;
  duration_minutes?: number;
  organizer_id?: number;
  organization_id?: number;
  meeting_type?: MeetingType;
  external_link?: string;
  ai_transcription?: boolean;
  ai_translation?: boolean;
  ai_recording?: boolean;
}

export interface MeetingUpdate {
  title?: string;
  description?: string;
  start_time?: string;
  duration_minutes?: number;
  meeting_type?: MeetingType;
  external_link?: string;
  ai_transcription?: boolean;
  ai_translation?: boolean;
  ai_recording?: boolean;
}

// --- Transcript ---
export interface TranscriptSegment {
  speaker_id: string;
  start_time: number;
  end_time: number;
  original_text: string;
  detected_language: string | null;
}

export interface TranscriptRead {
  id: number;
  audio_file_id: number;
  meeting_id: number | null;
  segments: TranscriptSegment[];
  detected_language: string | null;
  created_at: string | null;
}

// --- Translation ---
export interface TranslatedSegment {
  speaker_id: string;
  start_time: number;
  end_time: number;
  original_text: string;
  translated_text: string;
  detected_language: string | null;
}

export interface TranslatedTranscriptRead {
  id: number;
  transcript_id: number;
  audio_file_id: number | null;
  meeting_id: number | null;
  target_language: string;
  segments: TranslatedSegment[];
  created_at: string | null;
}

// --- Summary ---
export interface SummaryRead {
  id: number;
  transcript_id: number | null;
  meeting_id: number | null;
  executive_summary: string;
  key_points: string[];
  decisions: string[];
  risks: string[];
  length: string | null;
  tone: string | null;
  created_at: string | null;
}

// --- Extraction (Action Items) ---
export interface ExtractionItem {
  text: string;
  owner: string | null;
  due_date: string | null;
  decision: boolean;
  confidence: number;
}

export interface ExtractionRead {
  id: number;
  transcript_id: number;
  meeting_id: number | null;
  items: ExtractionItem[];
  confidence: number | null;
  created_at: string | null;
}

// --- Audio Ingest ---
export interface AudioIngestRead {
  id: number;
  meeting_id: number | null;
  s3_key: string;
  content_type: string | null;
  size_bytes: number | null;
  processed: boolean;
  meta: Record<string, unknown> | null;
  uploaded_at: string | null;
}

// --- Organization ---
export interface Organization {
  id: number;
  name: string;
}

export interface Membership {
  id: number;
  user_id: number;
  organization_id: number;
  role: 'admin' | 'organizer' | 'participant';
}

// --- Listener Session ---
export interface ListenerSession {
  id: number;
  meeting_id: number | null;
  external_link: string | null;
  scheduled_at: string | null;
  join_at: string | null;
  left_at: string | null;
  status: ListenerStatus;
  consent_record: unknown | null;
}

// --- Meeting Detail (Dashboard Composite) ---
export interface MeetingDetail {
  meeting: Meeting;
  participants: Participant[];
  recordings: Recording[];
  audio_files: AudioIngestRead[];  // Add audio files from new upload system
  transcripts: TranscriptRead[];
  summaries: SummaryRead[];
  extractions: ExtractionRead[];
}

// --- Consent ---
export interface ConsentCreate {
  meeting_id?: number;
  recording_id?: number;
  consent_given: boolean;
  method?: string;
}

// --- Pagination ---
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}
