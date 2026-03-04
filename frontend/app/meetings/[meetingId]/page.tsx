'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Layout from '../../../components/Layout';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { StatusBadge, Button } from '../../../components/ui';
import { MeetingDetailSkeleton } from '../../../components/Skeletons';
import { apiService } from '../../../services/api';
import { MeetingDetail } from '../../../types/api';
import Link from 'next/link';

// Sub-panels
import SummaryTab from '../../../components/meetings/SummaryTab';
import TranscriptTab from '../../../components/meetings/TranscriptTab';
import ActionItemsTab from '../../../components/meetings/ActionItemsTab';
import AudioPlayer from '../../../components/AudioPlayer';

// =============================================================================
// Meeting Detail Page - 3-Panel Workspace View
// =============================================================================

export default function MeetingDetailPage() {
    const { meetingId } = useParams();
    const router = useRouter();
    const [meeting, setMeeting] = useState<MeetingDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!meetingId) return;

        const fetchDetail = async () => {
            setLoading(true);
            try {
                const data = await apiService.getMeetingDetail(Number(meetingId));
                setMeeting(data);
            } catch (err: any) {
                console.error(err);
                setError(err.message || 'Failed to load meeting details.');
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [meetingId]);

    if (loading) {
        return (
            <ProtectedRoute>
                <Layout>
                    <MeetingDetailSkeleton />
                </Layout>
            </ProtectedRoute>
        );
    }

    if (error || !meeting) {
        return (
            <ProtectedRoute>
                <Layout>
                    <div className="py-12 text-center">
                        <div className="bg-red-50 border border-red-100 p-8 rounded-xl max-w-md mx-auto">
                            <p className="text-red-600 font-medium mb-4">{error || 'Meeting not found.'}</p>
                            <Button onClick={() => router.push('/meetings')}>Return to Directory</Button>
                        </div>
                    </div>
                </Layout>
            </ProtectedRoute>
        );
    }

    const displayAudio = meeting?.audio_files?.[0] || meeting?.recordings?.[0];

    return (
        <ProtectedRoute>
            <Layout>
                <div className="h-[calc(100vh-130px)] flex flex-col gap-6 animate-fade-in">
                    {/* Compact Workspace Header */}
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-4">
                            <Link href="/meetings" className="p-2 text-neutral-400 hover:text-neutral-900 bg-white border border-[#E5E7EB] rounded-lg shadow-sm transition-all">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </Link>
                            <div>
                                <h1 className="text-[20px] font-bold text-neutral-900 tracking-tight leading-tight">{meeting.meeting.title}</h1>
                                <div className="flex items-center gap-3 text-[11px] text-neutral-500 font-semibold uppercase tracking-wider mt-1">
                                    <span>{new Date(meeting.meeting.start_time || meeting.meeting.created_at || '').toLocaleDateString()}</span>
                                    <span>•</span>
                                    <span>{meeting.meeting.meeting_type || 'General'}</span>
                                    <span>•</span>
                                    <StatusBadge status={meeting.meeting.ai_transcription ? "processed" : "processing"} />
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="secondary" className="h-9 text-[13px] font-semibold border-[#E5E7EB]">
                                <svg className="w-3.5 h-3.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                </svg>
                                Share
                            </Button>
                            <Button className="h-9 text-[13px] font-semibold bg-[#4F46E5] text-white">
                                <svg className="w-3.5 h-3.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Export Data
                            </Button>
                        </div>
                    </div>

                    {/* Compact Audio Player */}
                    {displayAudio && (
                        <div className="bg-[#0F172A] rounded-xl p-4 shadow-sm border border-slate-800 flex items-center gap-6">
                            <div className="p-2 bg-slate-800 rounded-lg text-[#CBD5F5]">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <AudioPlayer audioId={displayAudio.id} filename={displayAudio.s3_key.split('/').pop()} />
                            </div>
                        </div>
                    )}

                    {/* 3-Panel Workspace Grid */}
                    <div className="flex-1 grid grid-cols-1 xl:grid-cols-3 gap-6 overflow-hidden min-h-0">
                        {/* Panel 1: Transcript */}
                        <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm flex flex-col overflow-hidden">
                            <div className="px-4 py-3 border-b border-[#F1F5F9] bg-[#F8FAFC]/50 flex items-center justify-between">
                                <h3 className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest">Transcript</h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-neutral-400 font-medium">Auto-scrolling</span>
                                    <div className="w-6 h-3 bg-[#4F46E5] rounded-full relative">
                                        <div className="absolute right-0.5 top-0.5 w-2 h-2 bg-white rounded-full" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                                <TranscriptTab meeting={meeting} />
                            </div>
                        </div>

                        {/* Panel 2: Summary */}
                        <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm flex flex-col overflow-hidden">
                            <div className="px-4 py-3 border-b border-[#F1F5F9] bg-[#F8FAFC]/50">
                                <h3 className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest">Meeting Intelligence</h3>
                            </div>
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                                <SummaryTab meeting={meeting} />
                            </div>
                        </div>

                        {/* Panel 3: Action Items */}
                        <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm flex flex-col overflow-hidden">
                            <div className="px-4 py-3 border-b border-[#F1F5F9] bg-[#F8FAFC]/50 flex items-center justify-between">
                                <h3 className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest">Actionable Insights</h3>
                                <button className="text-[10px] font-bold text-[#4F46E5] hover:underline uppercase">Sync with CRM</button>
                            </div>
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                                <ActionItemsTab meeting={meeting} />
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </ProtectedRoute>
    );
}
