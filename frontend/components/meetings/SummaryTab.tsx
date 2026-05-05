'use client';

import React from 'react';
import { MeetingDetail } from '../../types/api';
import { FileText, Target, CheckCircle2, AlertCircle } from 'lucide-react';

// =============================================================================
// Summary Tab Component - Claeron
// =============================================================================

interface SummaryTabProps {
    meeting: MeetingDetail;
}

export default function SummaryTab({ meeting }: SummaryTabProps) {
    const summary = meeting.summaries?.[0];

    if (!summary) {
        return (
            <div className="py-20 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-claeron-bg rounded-2xl flex items-center justify-center mb-6 border border-claeron-border text-claeron-muted">
                    <FileText size={32} />
                </div>
                <p className="text-[16px] font-medium text-claeron-text">No summary available</p>
                <p className="text-[14px] text-claeron-muted mt-2 max-w-[240px]">Summary will appear here once the AI processing is complete.</p>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-10 animate-fade-in custom-scrollbar overflow-y-auto h-full">
            {/* Executive Summary */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 text-claeron-primary">
                    <FileText size={18} />
                    <h3 className="text-[12px] uppercase tracking-widest font-semibold">Executive Summary</h3>
                </div>
                <p className="text-claeron-text leading-relaxed text-[15px] selection:bg-claeron-primary/10">
                    {summary.executive_summary}
                </p>
            </section>

            {/* Key Topics */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 text-claeron-muted">
                    <Target size={18} />
                    <h3 className="text-[12px] uppercase tracking-widest font-semibold">Key Topics</h3>
                </div>
                <ul className="space-y-3">
                    {summary.key_points?.map((point: string, i: number) => (
                        <li key={i} className="flex gap-4 text-claeron-text text-[15px] leading-relaxed">
                            <span className="text-claeron-primary mt-2 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-claeron-primary" />
                            <span>{point}</span>
                        </li>
                    )) || <p className="text-[14px] text-claeron-muted italic">No key points extracted.</p>}
                </ul>
            </section>

            {/* Key Decisions */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 text-status-success-base">
                    <CheckCircle2 size={18} />
                    <h3 className="text-[12px] uppercase tracking-widest font-semibold">Key Decisions</h3>
                </div>
                <div className="grid grid-cols-1 gap-3">
                    {summary.decisions?.map((decision: string, i: number) => (
                        <div key={i} className="p-4 bg-status-success-bg border border-transparent rounded-card flex gap-3 group hover:bg-emerald-100/50 transition-colors">
                            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                                <CheckCircle2 size={14} className="text-status-success-base" />
                            </div>
                            <span className="text-[15px] text-claeron-text leading-relaxed">{decision}</span>
                        </div>
                    )) || <p className="text-[14px] text-claeron-muted italic">No decisions recorded.</p>}
                </div>
            </section>

            {/* Risks & Blockers */}
            {summary.risks && summary.risks.length > 0 && (
                <section className="space-y-4 pb-8">
                    <div className="flex items-center gap-2 text-status-error-base">
                        <AlertCircle size={18} />
                        <h3 className="text-[12px] uppercase tracking-widest font-semibold">Risks & Blockers</h3>
                    </div>
                    <div className="space-y-3">
                        {summary.risks.map((risk: string, i: number) => (
                            <div key={i} className="p-4 bg-status-error-bg border border-transparent rounded-card text-[15px] text-status-error-text leading-relaxed">
                                {risk}
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
