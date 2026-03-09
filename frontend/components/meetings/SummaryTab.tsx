'use client';

import React from 'react';
import { MeetingDetail } from '../../types/api';
import { FileText, Target, CheckCircle2, AlertCircle } from 'lucide-react';

// =============================================================================
// Summary Tab Component - Eden Intelligence
// =============================================================================

interface SummaryTabProps {
    meeting: MeetingDetail;
}

export default function SummaryTab({ meeting }: SummaryTabProps) {
    const summary = meeting.summaries?.[0];

    if (!summary) {
        return (
            <div className="py-20 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-neutral-50 rounded-2xl flex items-center justify-center mb-6 border border-neutral-100 text-neutral-300">
                    <FileText size={32} />
                </div>
                <p className="text-[16px] font-bold text-[#0A1B3D]">No summary available</p>
                <p className="text-[13px] text-neutral-500 mt-2 max-w-[240px]">Summary will appear here once the AI processing is complete.</p>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-10 animate-fade-in custom-scrollbar overflow-y-auto h-full">
            {/* Executive Summary */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 text-[#6C63FF]">
                    <FileText size={18} />
                    <h3 className="text-[11px] uppercase tracking-[0.25em] font-bold">Executive Summary</h3>
                </div>
                <p className="text-[#1F2937] leading-relaxed text-[15px] font-medium selection:bg-[#6C63FF]/10">
                    {summary.executive_summary}
                </p>
            </section>

            {/* Key Topics */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 text-neutral-400">
                    <Target size={18} />
                    <h3 className="text-[11px] uppercase tracking-[0.25em] font-bold">Key Topics</h3>
                </div>
                <ul className="space-y-3">
                    {summary.key_points?.map((point: string, i: number) => (
                        <li key={i} className="flex gap-4 text-[#4B5563] text-[14px] leading-relaxed">
                            <span className="text-[#6C63FF] mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#6C63FF]" />
                            <span>{point}</span>
                        </li>
                    )) || <p className="text-sm text-neutral-400 italic">No key points extracted.</p>}
                </ul>
            </section>

            {/* Key Decisions */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 text-emerald-500">
                    <CheckCircle2 size={18} />
                    <h3 className="text-[11px] uppercase tracking-[0.25em] font-bold">Key Decisions</h3>
                </div>
                <div className="grid grid-cols-1 gap-3">
                    {summary.decisions?.map((decision: string, i: number) => (
                        <div key={i} className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl flex gap-3 group hover:bg-emerald-50 transition-colors">
                            <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <CheckCircle2 size={12} className="text-emerald-600" />
                            </div>
                            <span className="text-[14px] text-emerald-900 font-medium leading-relaxed">{decision}</span>
                        </div>
                    )) || <p className="text-sm text-neutral-400 italic">No decisions recorded.</p>}
                </div>
            </section>

            {/* Risks & Blockers */}
            {summary.risks && summary.risks.length > 0 && (
                <section className="space-y-4 pb-8">
                    <div className="flex items-center gap-2 text-red-500">
                        <AlertCircle size={18} />
                        <h3 className="text-[11px] uppercase tracking-[0.25em] font-bold">Risks & Blockers</h3>
                    </div>
                    <div className="space-y-3">
                        {summary.risks.map((risk: string, i: number) => (
                            <div key={i} className="p-4 bg-red-50/50 border border-red-100 rounded-xl text-[14px] text-red-700 font-medium leading-relaxed">
                                {risk}
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
