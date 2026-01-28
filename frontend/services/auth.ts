// =============================================================================
// Auth Service - Authentication API Methods
// =============================================================================

import { AuthResponse, User, TokenRefreshResponse } from '../types/auth';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// =============================================================================
// HTTP Client Helpers
// =============================================================================

async function authFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const res = await fetch(url, options);

  if (!res.ok) {
    let errorMessage = res.statusText;
    try {
      const errorData = await res.json();
      errorMessage = errorData.detail || errorMessage;
    } catch {
      // Use status text
    }
    throw new Error(errorMessage);
  }

  return res.json();
}

// =============================================================================
// Auth Service
// =============================================================================

export const authService = {
  /**
   * Login with email and password (OAuth2 form data)
   */
  async login(formData: FormData): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/token`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      let errorMessage = 'Invalid email or password';
      try {
        const errorData = await res.json();
        errorMessage = errorData.detail || errorMessage;
      } catch {
        // Use default
      }
      throw new Error(errorMessage);
    }

    return res.json();
  },

  /**
   * Register a new user
   */
  async signup(data: {
    email: string;
    password: string;
    display_name?: string;
  }): Promise<User> {
    return authFetch<User>('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },

  /**
   * Refresh the access token
   */
  async refreshToken(refreshToken: string): Promise<TokenRefreshResponse> {
    return authFetch<TokenRefreshResponse>('/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  },

  /**
   * Request email verification
   */
  async requestVerification(email: string): Promise<{ message: string }> {
    return authFetch<{ message: string }>('/auth/request-verification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
  },

  /**
   * Verify email with token
   */
  async verifyEmail(token: string): Promise<{ status: string; message: string }> {
    return authFetch<{ status: string; message: string }>('/auth/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
  },

  /**
   * Request password reset email
   */
  async forgotPassword(email: string): Promise<{ message: string }> {
    return authFetch<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
  },

  /**
   * Reset password with token
   */
  async resetPassword(
    token: string,
    newPassword: string
  ): Promise<{ status: string; message: string }> {
    return authFetch<{ status: string; message: string }>('/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, new_password: newPassword }),
    });
  },

  /**
   * Google OAuth authentication
   */
  async googleAuth(idToken: string): Promise<AuthResponse> {
    return authFetch<AuthResponse>('/auth/google-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_token: idToken }),
    });
  },

  /**
   * Get current user profile (requires auth header)
   */
  async getCurrentUser(accessToken: string): Promise<User | null> {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!res.ok) {
        return null;
      }

      return res.json();
    } catch {
      return null;
    }
  },

  /**
   * Clear local storage tokens
   */
  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  },
};

export default authService;
