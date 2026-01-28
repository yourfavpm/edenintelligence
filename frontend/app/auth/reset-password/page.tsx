'use client';

import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import AuthLayout from '../../../components/auth/AuthLayout';
import { Input, Button } from '../../../components/ui';
import { authService } from '../../../services/auth';
import { getErrorMessage } from '../../../types/auth';

export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!token) {
            setError('Invalid or missing reset token.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }

        setLoading(true);

        try {
            await authService.resetPassword(token, password);
            setSuccess(true);
            // Redirect after success
            setTimeout(() => router.push('/auth/login'), 3000);
        } catch (err: any) {
            console.error(err);
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <AuthLayout
                title="Password reset"
                subtitle="Your password has been updated successfully."
            >
                <div className="p-4 bg-success-50 border border-success-100 rounded-lg mb-8">
                    <p className="text-sm text-success-700 font-medium text-center">
                        Success! Redirecting you to sign in...
                    </p>
                </div>
                <Button onClick={() => router.push('/auth/login')} block>
                    Sign in now
                </Button>
            </AuthLayout>
        );
    }

    if (!token) {
        return (
            <AuthLayout
                title="Invalid link"
                subtitle="This password reset link is invalid or has expired."
            >
                <Button onClick={() => router.push('/auth/forgot-password')} block>
                    Request a new link
                </Button>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            title="Set new password"
            subtitle="Enter a secure password for your account."
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                    label="New password"
                    type="password"
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <Input
                    label="Confirm new password"
                    type="password"
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />

                {error && (
                    <div className="p-3 bg-error-50 border border-error-100 rounded-lg">
                        <p className="text-xs text-error-600 font-medium text-center">
                            {error}
                        </p>
                    </div>
                )}

                <Button type="submit" block loading={loading}>
                    Reset password
                </Button>
            </form>
        </AuthLayout>
    );
}
