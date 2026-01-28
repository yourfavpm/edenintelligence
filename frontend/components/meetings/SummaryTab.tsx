'use client';

import React from 'react';
import { MeetingDetail } from '../../types/api';

// =============================================================================
// Summary Tab Component
// =============================================================================

interface SummaryTabProps {
    meeting: MeetingDetail;
}

export default function SummaryTab({ meeting }: SummaryTabProps) {
    const summary = meeting.summaries?.[0];

    if (!summary) {
        return (
            <div className="py-12 text-center text-neutral-500">
                <svg className="w-12 h-12 mx-auto mb-4 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-lg font-medium">No summary available yet.</p>
                <p className="text-sm">Summary will appear once the AI processing is complete.</p>
            </div>
        );
    }

    return (
        <div className="py-6 space-y-8 animate-fade-in">
            {/* Executive Summary */}
            <section className="space-y-3">
                <h3 className="text-sm uppercase tracking-wider font-bold text-primary-600">Executive Summary</h3>
                <p className="text-neutral-800 leading-relaxed text-lg">
                    {summary.executive_summary}
                </p>
            </section>

            {/* Structured Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <section className="space-y-4">
                    <h3 className="text-sm uppercase tracking-wider font-bold text-neutral-400">Key Points</h3>
                    <ul className="space-y-2">
                        {summary.key_points?.map((point: string, i: number) => (
                            <li key={i} className="flex gap-3 text-neutral-700">
                                <span className="text-primary-500 mt-1">•</span>
                                <span>{point}</span>
                            </li>
                        )) || <p className="text-sm text-neutral-400 italic">No key points extracted.</p>}
                    </ul>
                </section>

                <section className="space-y-4">
                    <h3 className="text-sm uppercase tracking-wider font-bold text-neutral-400">Decisions</h3>
                    <ul className="space-y-2">
                        {summary.decisions?.map((decision: string, i: number) => (
                            <li key={i} className="flex gap-3 text-neutral-700">
                                <div className="w-5 h-5 bg-success-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <svg className="w-3 h-3 text-success-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <span>{decision}</span>
                            </li>
                        )) || <p className="text-sm text-neutral-400 italic">No decisions recorded.</p>}
                    </ul>
                </section>


                <section className="space-y-4">
                    <h3 className="text-sm uppercase tracking-wider font-bold text-neutral-400">Risks & Blockers</h3>
                    <div className="space-y-2">
                        {summary.risks?.map((risk: string, i: number) => (
                            <div key={i} className="p-3 bg-error-50 border border-error-100 rounded-lg text-sm text-error-700">
                                {risk}
                            </div>
                        )) || <p className="text-sm text-neutral-400 italic">No risks identified.</p>}
                    </div>
                </section>
            </div>
        </div>
    );
}
