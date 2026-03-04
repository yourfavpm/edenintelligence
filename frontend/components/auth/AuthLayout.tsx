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
                    <div className="flex items-center gap-3 mb-16">
                        <img src="/logo.png" alt="PraxiomNotes" className="h-10 w-auto" />
                        <span className="text-xl font-semibold text-[#111827] tracking-tighter">
                            PraxiomNotes
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-semibold text-[#111827] mb-6 leading-tight tracking-tight">
                        Meeting intelligence for <br/>teams that cannot miss.
                    </h2>
                    <p className="text-lg text-[#6B7280] font-medium leading-relaxed">
                        Record, transcribe, and summarize your meetings with absolute precision and enterprise-grade security.
                    </p>

                    <div className="mt-16 space-y-6">
                        <div className="flex items-center gap-4 text-[#4B5563] font-medium text-sm">
                            <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <span>Automated speaker attribution</span>
                        </div>
                        <div className="flex items-center gap-4 text-[#4B5563] font-medium text-sm">
                            <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <span>AI-powered insight extraction</span>
                        </div>
                        <div className="flex items-center gap-4 text-[#4B5563] font-medium text-sm">
                            <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <span>Secure, encrypted infrastructure</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel: Auth Forms */}
            <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-12 xl:px-24">
                <div className="mx-auto w-full max-w-[420px]">
                    {/* Mobile Brand */}
                    <div className="lg:hidden mb-12">
                        <div className="flex items-center gap-3">
                            <img src="/logo.png" alt="PraxiomNotes" className="h-8 w-auto" />
                            <span className="text-xl font-bold text-[#111827] tracking-tighter">
                                PraxiomNotes
                            </span>
                        </div>
                    </div>

                    <div className="text-left mb-10">
                        <h1 className="text-3xl font-semibold text-[#111827] mb-2 tracking-tight">
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="text-base text-[#6B7280] font-medium leading-relaxed">
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
