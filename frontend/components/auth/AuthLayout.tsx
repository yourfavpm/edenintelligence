'use client';

import React from 'react';

// =============================================================================
// AuthLayout Component - Enterprise-grade login/signup layout
// =============================================================================

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle?: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
    return (
        <div className="flex min-h-screen bg-neutral-50 font-sans">
            {/* Left Panel: Branding & Context (Desktop Only) */}
            <div className="hidden lg:flex lg:w-1/2 bg-white flex-col justify-center px-12 xl:px-24 border-r border-neutral-200">
                <div className="max-w-md">
                    <div className="flex items-center gap-3 mb-12">
                        <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center shadow-sm">
                            <span className="text-white font-bold text-xl">E</span>
                        </div>
                        <span className="text-2xl font-bold text-neutral-900 tracking-tight">
                            Eden Summarizer
                        </span>
                    </div>
                    <h2 className="text-4xl font-bold text-neutral-900 mb-6 leading-tight">
                        Enterprise-grade meeting intelligence.
                    </h2>
                    <p className="text-xl text-neutral-500 font-normal leading-relaxed">
                        Record, transcribe, and summarize your meetings with absolute precision and security.
                    </p>

                    <div className="mt-12 space-y-4">
                        <div className="flex items-center gap-3 text-neutral-600">
                            <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Automated speaker attribution</span>
                        </div>
                        <div className="flex items-center gap-3 text-neutral-600">
                            <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>AI-powered action items extraction</span>
                        </div>
                        <div className="flex items-center gap-3 text-neutral-600">
                            <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Secure, encrypted data storage</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel: Auth Forms */}
            <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-12 xl:px-24">
                <div className="mx-auto w-full max-w-[420px]">
                    {/* Mobile Brand */}
                    <div className="lg:hidden mb-12">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">E</span>
                            </div>
                            <span className="text-xl font-bold text-neutral-900 tracking-tight">
                                Eden Summarizer
                            </span>
                        </div>
                    </div>

                    <div className="text-left mb-8">
                        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="text-base text-neutral-500 font-normal">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    <div className="space-y-6">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
