'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthLayout from '../../../components/auth/AuthLayout';
import { Button } from '../../../components/ui';
import { authService } from '../../../services/auth';
import { getErrorMessage } from '../../../types/auth';

export function VerifyContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const email = searchParams.get('email') || 'your email';
    const token = searchParams.get('token');

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'waiting' | 'verifying' | 'success' | 'error'>('waiting');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (token) {
            handleVerify(token);
        }
    }, [token]);

    const handleVerify = async (vToken: string) => {
        setStatus('verifying');
        try {
            await authService.verifyEmail(vToken);
            setStatus('success');
            setMessage('Your email has been successfully verified.');
            setTimeout(() => router.push('/auth/login'), 3000);
        } catch (err: any) {
            setStatus('error');
            setMessage(getErrorMessage(err));
        }
    };

    const handleResend = async () => {
        setLoading(true);
        try {
            await authService.requestVerification(email);
            alert('Verification email resent!');
        } catch (err: any) {
            console.error(err);
            alert('Failed to resend email.');
        } finally {
            setLoading(false);
        }
    };

    if (status === 'verifying') {
        return (
            <AuthLayout title="Verifying email" subtitle="Please wait while we confirm your identity.">
                <div className="flex justify-center py-12">
                    <svg className="animate-spin h-8 w-8 text-primary-600" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            </AuthLayout>
        );
    }

    if (status === 'success') {
        return (
            <AuthLayout title="Email verified" subtitle="Redirecting you to sign in...">
                <div className="p-4 bg-success-50 border border-success-100 rounded-lg text-center mb-8">
                    <p className="text-sm text-success-700 font-medium">{message}</p>
                </div>
                <Button onClick={() => router.push('/auth/login')} block>
                    Sign in now
                </Button>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            title="Check your email"
            subtitle={`We've sent a verification link to ${email}.`}
        >
            <div className="space-y-8">
                <div className="p-4 bg-primary-50 border border-primary-100 rounded-lg">
                    <p className="text-sm text-primary-700 font-normal leading-relaxed">
                        Please click the link in the email to activate your account. If you don&apos;t see it, check your spam folder.
                    </p>
                </div>

                {status === 'error' && (
                    <div className="p-3 bg-error-50 border border-error-100 rounded-lg">
                        <p className="text-xs text-error-600 font-medium text-center">
                            {message}
                        </p>
                    </div>
                )}

                <div className="space-y-4">
                    <Button
                        variant="secondary"
                        block
                        onClick={handleResend}
                        loading={loading}
                    >
                        Resend verification email
                    </Button>
                    <div className="text-center">
                        <Link
                            href="/auth/login"
                            className="text-sm text-neutral-500 hover:text-neutral-700 font-medium transition-colors"
                        >
                            Back to sign in
                        </Link>
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
}
