'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Layout from '../../../components/Layout';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { Tabs, TabPanel, StatusBadge, Button } from '../../../components/ui';
import { MeetingDetailSkeleton } from '../../../components/Skeletons';
import { apiService } from '../../../services/api';
import { MeetingDetail } from '../../../types/api';

// Tab Components (to be created)
import SummaryTab from '../../../components/meetings/SummaryTab';
import TranscriptTab from '../../../components/meetings/TranscriptTab';
import ActionItemsTab from '../../../components/meetings/ActionItemsTab';
import AudioPlayer from '../../../components/AudioPlayer';

// =============================================================================
// Meeting Detail Page
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
                    <div className="max-w-7xl mx-auto">
                        <MeetingDetailSkeleton />
                    </div>
                </Layout>
            </ProtectedRoute>
        );
    }

    if (error || !meeting) {
        return (
            <ProtectedRoute>
                <Layout>
                    <div className="max-w-7xl mx-auto py-12 text-center">
                        <div className="bg-error-50 border border-error-100 p-8 rounded-2xl max-w-md mx-auto">
                            <p className="text-error-600 font-medium mb-4">{error || 'Meeting not found.'}</p>
                            <Button onClick={() => router.push('/meetings')}>Back to Meetings</Button>
                        </div>
                    </div>
                </Layout>
            </ProtectedRoute>
        );
    }

    const tabs = [
        {
            id: 'summary', label: 'Summary', icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            )
        },
        {
            id: 'transcript', label: 'Transcript', icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
            )
        },
        {
            id: 'actions', label: 'Action Items', icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
            )
        },
    ];

    // Determine audio file to play
    const audioFile = meeting?.audio_files?.[0];
    const recording = meeting?.recordings?.[0];
    const displayAudio = audioFile || recording;

    return (
        <ProtectedRoute>
            <Layout>
                <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-3">
                                <Link href="/meetings" className="text-neutral-400 hover:text-neutral-600 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                </Link>
                                <h1 className="text-2xl font-bold text-neutral-900">{meeting.meeting.title}</h1>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-neutral-500 ml-8">
                                <span className="flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {meeting.meeting.start_time || meeting.meeting.created_at ? new Date(meeting.meeting.start_time || meeting.meeting.created_at!).toLocaleString() : 'No date'}
                                </span>
                                <span className="flex items-center gap-1 capitalize">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    {meeting.meeting.meeting_type}
                                </span>
                                {(() => {
                                    if (meeting.audio_files && meeting.audio_files.length > 0) {
                                        const af = meeting.audio_files[0];
                                        return af.processed ? <StatusBadge status="processed" /> : <StatusBadge status="processing" />;
                                    }
                                    if (meeting.meeting.ai_transcription && meeting.recordings && meeting.recordings.length > 0) {
                                        const isProcessing = meeting.recordings.some(r => !r.processed && r.processing_status !== 'failed');
                                        const isFailed = meeting.recordings.some(r => r.processing_status === 'failed');
                                        if (isProcessing) return <StatusBadge status="processing" />;
                                        if (isFailed) return <StatusBadge status="failed" />;
                                        return <StatusBadge status="processed" />;
                                    }
                                    if (meeting.meeting.ai_transcription) return <StatusBadge status="processed" />;
                                    return <StatusBadge status="scheduled" />;
                                })()}
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="secondary" size="sm">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                </svg>
                                Share
                            </Button>
                            <Button size="sm">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Export
                            </Button>
                        </div>
                    </div>

                    {/* Audio Player (Top) */}
                    {displayAudio && (
                        <div className="bg-neutral-900 rounded-2xl p-6 shadow-lg">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-2 bg-white/10 rounded-full">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-white font-medium">Meeting Recording</h3>
                                    <p className="text-neutral-400 text-sm">{displayAudio.s3_key.split('/').pop()}</p>
                                </div>
                                <div className="ml-auto">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={async () => {
                                            if (confirm('Are you sure you want to delete this recording?')) {
                                                try {
                                                    await apiService.deleteAudio(displayAudio.id);
                                                    window.location.reload();
                                                } catch (err) {
                                                    alert('Failed to delete');
                                                }
                                            }
                                        }}
                                    >
                                        Delete Recording
                                    </Button>
                                </div>
                            </div>
                            <AudioPlayer audioId={displayAudio.id} filename={displayAudio.s3_key.split('/').pop()} />
                        </div>
                    )}

                    {/* Navigation & Panels */}
                    <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
                        <div className="px-6">
                            <Tabs tabs={tabs}>
                                <TabPanel id="summary">
                                    <SummaryTab meeting={meeting} />
                                </TabPanel>
                                <TabPanel id="transcript">
                                    <TranscriptTab meeting={meeting} />
                                </TabPanel>
                                <TabPanel id="actions">
                                    <ActionItemsTab meeting={meeting} />
                                </TabPanel>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </Layout>
        </ProtectedRoute>
    );
}

// Simple internal Link wrapper to avoid re-importing in complex JSX
function Link({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
    const router = useRouter();
    return (
        <a
            href={href}
            onClick={(e) => { e.preventDefault(); router.push(href); }}
            className={className}
        >
            {children}
        </a>
    );
}
