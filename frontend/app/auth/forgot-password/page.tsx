'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AuthLayout from '@/components/auth/AuthLayout';
import { Input, Button } from '@/components/ui';
import { authService } from '@/services/auth';
import { getErrorMessage } from '@/types/auth';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await authService.forgotPassword(email);
            setSubmitted(true);
        } catch (err: any) {
            console.error(err);
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <AuthLayout
                title="Email sent"
                subtitle={`We've sent a password reset link to ${email}.`}
            >
                <div className="p-4 bg-success-50 border border-success-100 rounded-lg mb-8">
                    <p className="text-sm text-success-700 font-normal leading-relaxed">
                        Please check your inbox and follow the instructions to reset your password.
                    </p>
                </div>
                <div className="mt-6 text-center">
                    <Link
                        href="/auth/login"
                        className="text-[14px] text-[#D41E82] hover:text-[#B81570] font-semibold transition-colors"
                    >
                        Back to sign in
                    </Link>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            title="Reset your password."
            subtitle="Enter your email and we'll send a password reset link."
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                    label="Email address"
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    Send reset link
                </Button>

                <div className="text-center mt-6">
                    <Link
                        href="/auth/login"
                        className="text-[14px] text-[#D41E82] hover:text-[#B81570] font-semibold transition-colors flex items-center justify-center gap-1.5"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Back to sign in
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
}
