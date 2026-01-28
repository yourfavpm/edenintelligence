// =============================================================================
// Centralized API Service with JWT Authentication
// =============================================================================

import {
  Meeting,
  MeetingCreate,
  MeetingUpdate,
  MeetingDetail,
  TranscriptRead,
  SummaryRead,
  ExtractionRead,
  TranslatedTranscriptRead,
  Participant,
  ConsentCreate,
} from '../types/api';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// =============================================================================
// Token Management
// =============================================================================

function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('refresh_token');
}

function setTokens(access: string, refresh: string): void {
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
}

function clearTokens(): void {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
}

// =============================================================================
// API Client with Auto-Refresh
// =============================================================================

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!res.ok) {
      clearTokens();
      return null;
    }

    const data = await res.json();
    localStorage.setItem('access_token', data.access_token);
    return data.access_token;
  } catch {
    clearTokens();
    return null;
  }
}

interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
}

async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { skipAuth = false, ...fetchOptions } = options;

  // Build headers
  const headers: HeadersInit = {
    ...fetchOptions.headers,
  };

  // Add JSON content type for POST/PUT/PATCH
  if (
    fetchOptions.body &&
    typeof fetchOptions.body === 'string' &&
    !headers['Content-Type' as keyof HeadersInit]
  ) {
    (headers as Record<string, string>)['Content-Type'] = 'application/json';
  }

  // Add auth token
  if (!skipAuth) {
    const token = getAccessToken();
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
  }

  const url = `${API_BASE}${endpoint}`;
  let res = await fetch(url, { ...fetchOptions, headers });

  // Handle 401 - try token refresh
  if (res.status === 401 && !skipAuth) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${newToken}`;
      res = await fetch(url, { ...fetchOptions, headers });
    } else {
      // Redirect to login if token refresh fails
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
      throw new Error('Session expired. Please log in again.');
    }
  }

  // Handle error responses
  if (!res.ok) {
    let errorMessage = res.statusText;
    try {
      const errorData = await res.json();
      errorMessage = errorData.detail || errorMessage;
    } catch {
      // Use status text if JSON parsing fails
    }
    throw new Error(errorMessage);
  }

  // Handle empty responses
  if (res.status === 204) {
    return {} as T;
  }

  return res.json();
}

// =============================================================================
// Dashboard API
// =============================================================================

export async function getMeetings(
  orgId?: number,
  limit = 20,
  offset = 0
): Promise<Meeting[]> {
  let endpoint = `/dashboard/meetings?limit=${limit}&offset=${offset}`;
  if (orgId) endpoint += `&org_id=${orgId}`;
  return apiFetch<Meeting[]>(endpoint);
}

export async function getMeetingDetail(meetingId: number): Promise<MeetingDetail> {
  return apiFetch<MeetingDetail>(`/dashboard/meetings/${meetingId}/detail`);
}

// =============================================================================
// Meetings API
// =============================================================================

export async function createMeeting(data: MeetingCreate): Promise<Meeting> {
  return apiFetch<Meeting>('/meetings/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateMeeting(
  meetingId: number,
  data: MeetingUpdate
): Promise<Meeting> {
  return apiFetch<Meeting>(`/meetings/${meetingId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteMeeting(meetingId: number): Promise<void> {
  return apiFetch<void>(`/meetings/${meetingId}`, {
    method: 'DELETE',
  });
}

export async function addParticipants(
  meetingId: number,
  emails: string[]
): Promise<Participant[]> {
  return apiFetch<Participant[]>(`/meetings/${meetingId}/participants`, {
    method: 'POST',
    body: JSON.stringify(emails),
  });
}

// =============================================================================
// Transcripts API
// =============================================================================

export async function getTranscriptsForMeeting(
  meetingId: number
): Promise<TranscriptRead[]> {
  return apiFetch<TranscriptRead[]>(`/transcripts?meeting_id=${meetingId}`);
}

// =============================================================================
// Translations API
// =============================================================================

export async function getTranslationsForMeeting(
  meetingId: number
): Promise<TranslatedTranscriptRead[]> {
  return apiFetch<TranslatedTranscriptRead[]>(
    `/translations?meeting_id=${meetingId}`
  );
}

// =============================================================================
// Summaries API
// =============================================================================

export async function getSummaryForMeeting(
  meetingId: number
): Promise<SummaryRead | null> {
  const summaries = await apiFetch<SummaryRead[]>(
    `/summaries?meeting_id=${meetingId}`
  );
  return summaries.length > 0 ? summaries[0] : null;
}

// =============================================================================
// Extractions (Action Items) API
// =============================================================================

export async function getExtractionsForMeeting(
  meetingId: number
): Promise<ExtractionRead[]> {
  return apiFetch<ExtractionRead[]>(`/extractions?meeting_id=${meetingId}`);
}

export async function getAllExtractions(): Promise<ExtractionRead[]> {
  return apiFetch<ExtractionRead[]>('/extractions');
}

// =============================================================================
// Audio Upload API
// =============================================================================

export async function uploadAudio(
  file: File,
  meetingId?: number,
  onProgress?: (progress: number) => void,
  title?: string
): Promise<{ id: number; s3_key: string }> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('file', file);
    if (meetingId) formData.append('meeting_id', String(meetingId));
    if (title) formData.append('title', title);

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch (e) {
          console.error('Failed to parse upload response:', xhr.responseText);
          reject(new Error('Upload succeeded but server response was invalid.'));
        }
      } else {
        let errorMessage = xhr.statusText || 'Upload failed';
        try {
          const errorData = JSON.parse(xhr.responseText);
          if (errorData.detail) {
            if (typeof errorData.detail === 'string') {
              errorMessage = errorData.detail;
            } else {
              errorMessage = JSON.stringify(errorData.detail);
            }
          }
        } catch (e) {
          // ignore JSON parse error
        }
        reject(new Error(errorMessage));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Upload failed'));
    });

    const token = getAccessToken();
    xhr.open('POST', `${API_BASE}/audio/ingest`);
    if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.send(formData);
  });
}

// =============================================================================
// Consent API
// =============================================================================

export async function createConsent(data: ConsentCreate): Promise<{ id: number }> {
  return apiFetch<{ id: number }>('/consents/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// =============================================================================
// Privacy API
// =============================================================================

export async function requestDeletion(userId: number): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/privacy/delete_me/user/${userId}`, {
    method: 'POST',
  });
}

// =============================================================================
// API Service Object
// =============================================================================

export const apiService = {
  baseURL: API_BASE,
  getMeetings,
  getMeetingDetail,
  createMeeting,
  updateMeeting,
  deleteMeeting,
  addParticipants,
  getTranscriptsForMeeting,
  getTranslationsForMeeting,
  getSummaryForMeeting,
  getExtractionsForMeeting,
  getAllExtractions,
  uploadAudio,
  deleteAudio,
  createConsent,
  requestDeletion,
};

// =============================================================================
// Token Exports
// =============================================================================

export { getAccessToken, getRefreshToken, setTokens, clearTokens };

export async function deleteAudio(audioId: number): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/audio/${audioId}`, {
    method: 'DELETE',
  });
}
