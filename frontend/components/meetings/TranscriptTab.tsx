'use client';

import React, { useState } from 'react';
import { MeetingDetail, TranscriptSegment } from '../../types/api';
import { TranscriptSkeleton } from '../Skeletons';
import { Search, User, Clock } from 'lucide-react';

// =============================================================================
// Transcript Tab Component - Claeron
// =============================================================================

interface TranscriptTabProps {
    meeting: MeetingDetail;
    currentTime?: number;
    onSeek?: (time: number) => void;
}

export default function TranscriptTab({ meeting, currentTime, onSeek }: TranscriptTabProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [autoScroll, setAutoScroll] = useState(true);

    const transcript = meeting.transcripts?.[0];

    if (!transcript) {
        return (
            <div className="py-20 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-claeron-bg rounded-2xl flex items-center justify-center mb-6 border border-claeron-border text-claeron-muted">
                    <Clock size={32} />
                </div>
                <p className="text-[16px] font-medium text-claeron-text">No transcript available</p>
                <p className="text-[14px] text-claeron-muted mt-2 max-w-[240px]">Transcription is currently in progress. It will appear here shortly.</p>
                <div className="w-full max-w-sm mt-10">
                    <TranscriptSkeleton />
                </div>
            </div>
        );
    }

    const segments = transcript.segments.filter(s => 
        s.original_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s as any).speaker_id?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full animate-fade-in">
            {/* Transcript Toolbar */}
            <div className="p-4 border-b border-claeron-border flex items-center justify-between gap-4 bg-white/50 sticky top-0 z-10 backdrop-blur-sm">
                <div className="relative flex-1 max-w-[320px]">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-claeron-muted" />
                    <input
                        type="text"
                        placeholder="Search transcript..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-10 pl-10 pr-4 bg-claeron-bg border border-claeron-border rounded-input text-[14px] text-claeron-text outline-none focus:border-claeron-primary focus:bg-white focus:ring-4 focus:ring-claeron-primary/5 transition-all"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-[12px] font-medium text-claeron-muted uppercase tracking-widest">Auto-scroll</span>
                    <button 
                        onClick={() => setAutoScroll(!autoScroll)}
                        className={`w-9 h-5 rounded-pill relative transition-colors ${autoScroll ? 'bg-claeron-primary' : 'bg-claeron-divider'}`}
                    >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${autoScroll ? 'right-1' : 'left-1 shadow-sm'}`} />
                    </button>
                </div>
            </div>

            {/* Transcript list */}
            <div className="flex-1 overflow-y-auto p-6 space-y-10 custom-scrollbar">
                {segments.length > 0 ? segments.map((segment: TranscriptSegment, i: number) => {
                    const isActive = currentTime !== undefined && 
                                   currentTime >= segment.start_time && 
                                   (segments[i + 1] ? currentTime < segments[i + 1].start_time : true);

                    return (
                        <div 
                            key={i} 
                            className={`flex gap-5 group transition-all duration-300 rounded-card p-4 -mx-4 ${isActive ? 'bg-claeron-accent/10 ring-1 ring-claeron-primary/20 shadow-soft' : 'hover:bg-claeron-bg'}`}
                        >
                            {/* Speaker Avatar */}
                            <div className="flex-shrink-0">
                                <div className="w-10 h-10 rounded-full bg-claeron-bg border border-claeron-border flex items-center justify-center text-claeron-text font-medium text-[13px] shadow-sm">
                                    {(segment as any).speaker_id?.charAt(0) || <User size={16} className="text-claeron-muted" />}
                                </div>
                            </div>

                            {/* Content Block */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="font-medium text-[14px] text-claeron-text">{(segment as any).speaker_id || 'Speaker'}</span>
                                    <button 
                                        onClick={() => onSeek?.(segment.start_time)}
                                        className="text-[12px] text-claeron-muted hover:text-claeron-primary transition-colors px-1.5 py-0.5 rounded"
                                    >
                                        {formatTime(segment.start_time)}
                                    </button>
                                </div>
                                <p className={`text-[15px] leading-relaxed transition-colors ${isActive ? 'text-claeron-text font-medium' : 'text-claeron-muted group-hover:text-claeron-text'}`}>
                                    {segment.original_text}
                                </p>
                            </div>
                        </div>
                    );
                }) : (
                    <div className="py-20 text-center text-neutral-400">
                        <p className="text-[13px]">No matches found for "{searchQuery}"</p>
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
