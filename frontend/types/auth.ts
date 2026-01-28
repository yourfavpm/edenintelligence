// =============================================================================
// Auth Types - Aligned with Backend Schemas
// =============================================================================

export interface User {
    id: number;
    email: string;
    display_name: string | null;
    is_active: boolean;
    is_verified: boolean;
    preferred_language: string | null;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
    refresh_token: string;
}

export interface TokenRefreshResponse {
    access_token: string;
    token_type: string;
}

export interface UserCreate {
    email: string;
    password: string;
    display_name?: string;
}

export interface UserUpdate {
    display_name?: string;
    preferred_language?: string;
}

export interface EmailVerificationRequest {
    email: string;
}

export interface VerifyEmailRequest {
    token: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    token: string;
    new_password: string;
}

export interface GoogleAuthRequest {
    id_token: string;
}

export interface ApiError {
    detail: string | Array<{ msg: string; loc: Array<string | number> }>;
}

// Helper to extract error message
export function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === 'object' && error !== null && 'detail' in error) {
        const apiError = error as ApiError;
        if (typeof apiError.detail === 'string') {
            return apiError.detail;
        }
        if (Array.isArray(apiError.detail) && apiError.detail.length > 0) {
            return apiError.detail[0].msg;
        }
    }
    return 'An unexpected error occurred';
}
