'use client';

import React from 'react';
import { FileText, Target, CheckCircle2 } from 'lucide-react';

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
        <div className="flex min-h-screen bg-[#F7F8FB] font-sans">
            {/* Left Panel: Branding & Context (Desktop Only) */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0A1B3D] to-[#122A59] flex-col justify-center px-12 xl:px-24 relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D41E82] opacity-10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#E85BA8] opacity-10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />

                <div className="max-w-xl relative z-10 text-white pt-10 pb-20">
                    <div className="flex items-center mb-16 opacity-90">
                        {/* Make logo bolder/whiter to stand out on dark background */}
                        <img src="/logo.png" alt="Logo" className="h-40 w-auto object-contain mr-3" />
                    </div>
                    
                    <h2 className="text-[28px] md:text-[36px] font-bold mb-6 leading-[1.2] tracking-tight text-white/95">
                        Turn Every Meeting Into Actionable Intelligence.
                    </h2>
                    <p className="text-[15px] md:text-[16px] text-[#E85BA8] font-medium leading-relaxed max-w-md">
                        Record or upload meetings and automatically generate transcripts, summaries, and action items.
                    </p>

                    {/* UI Mockup Preview */}
                    <div className="mt-16 bg-[#0A1B3D]/50 border border-white/10 rounded-2xl p-6 shadow-2xl backdrop-blur-sm relative rotate-[1deg] hover:rotate-0 transition-transform duration-500 max-w-[480px]">
                        <div className="absolute -left-3 top-6 w-1 hover:w-2 h-12 bg-[#D41E82] rounded-r-md transition-all duration-300" />
                        
                        <div className="space-y-4">
                            {/* Mock Summary Panel */}
                            <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex gap-4">
                                <div className="mt-1 w-6 h-6 rounded-md bg-[#D41E82]/20 flex items-center justify-center shrink-0">
                                    <Target size={14} className="text-[#E85BA8]" />
                                </div>
                                <div className="space-y-2 flex-1">
                                    <div className="h-2.5 bg-white/20 rounded-full w-1/3" />
                                    <div className="h-2 bg-white/10 rounded-full w-[90%]" />
                                    <div className="h-2 bg-white/10 rounded-full w-[70%]" />
                                </div>
                            </div>

                            {/* Mock Action Item Panel */}
                            <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3 w-full">
                                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                                    <div className="h-2.5 bg-white/10 rounded-full w-[60%]" />
                                </div>
                                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                    <span className="text-[8px] text-white/50 font-bold">JD</span>
                                </div>
                            </div>
                            
                            {/* Mock Transcript Panel */}
                            <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex gap-4">
                                <FileText size={16} className="text-white/30 shrink-0 mt-0.5" />
                                <div className="space-y-2 w-full">
                                    <div className="flex justify-between items-center w-full">
                                        <div className="h-2 bg-white/20 rounded-full w-1/4" />
                                        <div className="h-1.5 bg-white/10 rounded-full w-8" />
                                    </div>
                                    <div className="h-2 bg-white/5 rounded-full w-[85%]" />
                                    <div className="h-2 bg-white/5 rounded-full w-[40%]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel: Auth Forms */}
            <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-12 xl:px-24">
                <div className="mx-auto w-full max-w-[420px]">
                    {/* Mobile Brand */}
                    <div className="lg:hidden mb-12 flex flex-col items-center">
                        <img src="/logo.png" alt="Logo" className="h-48 w-auto object-contain mb-4" />
                    </div>

                    <div className="bg-white p-8 sm:p-10 rounded-2xl border border-[#E5E7EB] shadow-sm">
                        <div className="text-center lg:text-left mb-8">
                            <h1 className="text-[28px] font-bold text-[#0A1B3D] mb-2 tracking-tight">
                                {title}
                            </h1>
                            {subtitle && (
                                <p className="text-[15px] text-neutral-500 font-medium leading-relaxed">
                                    {subtitle}
                                </p>
                            )}
                        </div>

                        <div className="space-y-6">
                            {children}
                        </div>
                    </div>
                    
                    {/* Trust Indicator */}
                    <p className="mt-8 text-center text-[12px] text-neutral-400 font-medium flex items-center justify-center gap-2">
                       <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7z" /></svg>
                       Your data is encrypted and securely stored.
                    </p>
                </div>
            </div>
        </div>
    );
}
