'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthLayout from '../../../components/auth/AuthLayout';
import { Input, Button } from '../../../components/ui';

export default function InviteAcceptPage() {
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            router.push('/dashboard');
        }, 1500);
    };

    return (
        <AuthLayout
            title="You've been invited."
            subtitle="Join your team on Eden Intelligence."
        >
            {/* Context Card */}
            <div className="bg-[#F7F8FB] border border-[#E5E7EB] rounded-xl p-4 mb-6 flex gap-4 items-center shadow-sm">
                <div className="w-10 h-10 rounded-full bg-[#6C63FF]/10 text-[#6C63FF] flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                </div>
                <div>
                    <h3 className="text-[14px] font-bold text-[#0A1B3D] leading-none mb-1">Acme Corp Workspace</h3>
                    <p className="text-[12px] text-neutral-500 font-medium">Invited by sarah@acme.com</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                    label="Full name"
                    type="text"
                    placeholder="e.g. John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                />

                <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    rightElement={
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-neutral-400 hover:text-neutral-600 focus:outline-none"
                        >
                            {showPassword ? (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                            ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            )}
                        </button>
                    }
                />

                <Button type="submit" block loading={loading} className="mt-2 text-[14px]">
                    Accept invitation
                </Button>
            </form>

            <p className="mt-6 text-center text-[11px] text-neutral-400 font-normal leading-relaxed">
                By joining, you agree to our{' '}
                <Link href="/terms" className="underline hover:text-neutral-600 transition-colors">Terms</Link> and{' '}
                <Link href="/privacy" className="underline hover:text-neutral-600 transition-colors">Privacy Policy</Link>.
            </p>
        </AuthLayout>
    );
}
