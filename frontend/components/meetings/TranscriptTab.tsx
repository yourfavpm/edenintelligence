'use client';

import React, { useState } from 'react';
import { MeetingDetail, TranscriptSegment } from '../../types/api';
import { TranscriptSkeleton } from '../Skeletons';

// =============================================================================
// Transcript Tab Component
// =============================================================================

interface TranscriptTabProps {
    meeting: MeetingDetail;
}

export default function TranscriptTab({ meeting }: TranscriptTabProps) {
    const [showTranslated, setShowTranslated] = useState(false);

    const transcript = meeting.transcripts?.[0];
    const translation: any = null; // Translations fetched separately if needed

    if (!transcript) {
        return (
            <div className="py-12 text-center text-neutral-500">
                <svg className="w-12 h-12 mx-auto mb-4 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <p className="text-lg font-medium">No transcript available yet.</p>
                <p className="text-sm">Transcription is currently in progress.</p>
                <div className="max-w-md mx-auto mt-8">
                    <TranscriptSkeleton />
                </div>
            </div>
        );
    }

    const segments = showTranslated && translation ? translation.segments : transcript.segments;

    return (
        <div className="py-6 space-y-6 animate-fade-in">
            {/* Search & Options */}
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                <div className="relative flex-1 max-w-md">
                    <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search in transcript..."
                        className="w-full pl-10 pr-4 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500"
                    />
                </div>
                <div className="flex items-center gap-4">
                    {translation && (
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-neutral-500">Show Translation</span>
                            <button
                                onClick={() => setShowTranslated(!showTranslated)}
                                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${showTranslated ? 'bg-primary-600' : 'bg-neutral-200'}`}
                            >
                                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${showTranslated ? 'translate-x-5' : 'translate-x-0.5'}`} />
                            </button>
                        </div>
                    )}
                    <button className="text-primary-600 hover:text-primary-700 text-xs font-medium">
                        Download TXT
                    </button>
                </div>
            </div>

            {/* Transcript Segments */}
            <div className="space-y-8 max-h-[600px] overflow-y-auto pr-4 scrollbar-thin">
                {Array.isArray(segments) ? segments.map((segment: TranscriptSegment, i: number) => (
                    <div key={i} className="flex gap-4 group">
                        {/* Speaker Avatar */}
                        <div className="w-10 h-10 rounded-full bg-neutral-100 flex-shrink-0 flex items-center justify-center text-neutral-500 font-bold text-xs ring-2 ring-white shadow-sm">
                            {(segment as any).speaker_id?.charAt(0) || '?'}
                        </div>

                        {/* Content */}
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-neutral-900">{(segment as any).speaker_id || 'Unknown Speaker'}</span>
                                <span className="text-[10px] text-neutral-400 font-mono">{formatTime(segment.start_time)}</span>
                            </div>
                            <p className="text-neutral-700 leading-relaxed text-[15px] group-hover:text-black transition-colors">
                                {showTranslated ? (segment as any).translated_text : segment.original_text}
                            </p>
                        </div>
                    </div>
                )) : (
                    <div className="py-12 text-center text-neutral-500">
                        <p>No segments found in this transcript.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function formatTime(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return [
        h > 0 ? h : null,
        m.toString().padStart(h > 0 ? 2 : 1, '0'),
        s.toString().padStart(2, '0')
    ].filter(Boolean).join(':');
}
