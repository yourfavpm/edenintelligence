'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User } from '../../types/auth';
import { authService } from '../../services/auth';
import { useRouter, usePathname } from 'next/navigation';

// =============================================================================
// Types
// =============================================================================

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    login: (accessToken: string, refreshToken: string) => Promise<void>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

// =============================================================================
// Context
// =============================================================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// =============================================================================
// Provider
// =============================================================================

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    // Fetch user from token
    const fetchUser = useCallback(async (token: string): Promise<User | null> => {
        try {
            const userData = await authService.getCurrentUser(token);
            return userData;
        } catch {
            return null;
        }
    }, []);

    // Refresh user data
    const refreshUser = useCallback(async () => {
        const token = localStorage.getItem('access_token');
        if (token) {
            const userData = await fetchUser(token);
            setUser(userData);
        }
    }, [fetchUser]);

    // Initial load - check for existing token
    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('access_token');

            if (token) {
                // Try to fetch user with existing token
                const userData = await fetchUser(token);

                if (userData) {
                    setUser(userData);
                } else {
                    // Token might be expired, try refresh
                    const refreshToken = localStorage.getItem('refresh_token');
                    if (refreshToken) {
                        try {
                            const response = await authService.refreshToken(refreshToken);
                            localStorage.setItem('access_token', response.access_token);
                            const newUserData = await fetchUser(response.access_token);
                            setUser(newUserData);
                        } catch {
                            // Refresh failed, clear tokens
                            authService.logout();
                            setUser(null);
                        }
                    } else {
                        authService.logout();
                        setUser(null);
                    }
                }
            }

            setLoading(false);
        };

        initAuth();
    }, [fetchUser]);

    // Login handler
    const login = useCallback(async (accessToken: string, refreshToken: string) => {
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);

        // Fetch user data
        const userData = await fetchUser(accessToken);
        setUser(userData);

        // Redirect to dashboard
        router.push('/dashboard');
    }, [fetchUser, router]);

    // Logout handler
    const logout = useCallback(() => {
        authService.logout();
        setUser(null);
        router.push('/auth/login');
    }, [router]);

    // Redirect logic for auth pages
    useEffect(() => {
        if (!loading) {
            const isAuthPage = pathname?.startsWith('/auth');

            if (user && isAuthPage && pathname !== '/auth/logout') {
                // Authenticated user on auth page -> redirect to dashboard
                router.push('/dashboard');
            }
        }
    }, [user, loading, pathname, router]);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isAuthenticated: !!user,
                login,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// =============================================================================
// Hook
// =============================================================================

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
