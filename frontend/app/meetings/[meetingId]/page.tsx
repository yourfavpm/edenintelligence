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

import { 
  ChevronLeft, 
  Share2, 
  Download, 
  Calendar, 
  Globe, 
  MessageSquare, 
  BookOpen, 
  CheckSquare 
} from 'lucide-react';

// =============================================================================
// Meeting Detail Page - Eden Intelligence Workspace
// =============================================================================

export default function MeetingDetailPage() {
  const { meetingId } = useParams();
  const router = useRouter();
  const [meeting, setMeeting] = useState<MeetingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'transcript' | 'summary' | 'tasks'>('transcript');
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (!meetingId) return;

    const fetchDetail = async () => {
      setLoading(true);
      try {
        const data = await apiService.getMeetingDetail(String(meetingId));
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

  if (loading) return <ProtectedRoute><Layout><MeetingDetailSkeleton /></Layout></ProtectedRoute>;
  if (error || !meeting) return <ProtectedRoute><Layout><div className="p-10 text-center"><div className="bg-red-50 border border-red-100 p-8 rounded-xl max-w-md mx-auto"><p className="text-red-600 font-medium mb-4">{error || 'Meeting not found.'}</p><Button onClick={() => router.push('/dashboard')}>Return to Dashboard</Button></div></div></Layout></ProtectedRoute>;

  const displayAudio = meeting?.audio_files?.[0] || meeting?.recordings?.[0];
  const m = meeting.meeting;

  return (
    <ProtectedRoute>
      <Layout>
        <div className="flex flex-col min-h-[calc(100vh-100px)] -m-6 lg:-m-10 bg-eden-bg">
          {/* Zone 1: Page Header */}
          <header className="bg-white border-b border-eden-border px-6 lg:px-10 py-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shrink-0 shadow-soft z-10 relative">
            <div className="flex items-center gap-5">
              <Link href="/meetings" className="p-2.5 hover:bg-eden-bg rounded-lg text-eden-muted hover:text-eden-primary transition-colors border border-eden-border shadow-soft">
                <ChevronLeft size={20} />
              </Link>
              <div>
                <h1 className="text-[20px] font-semibold text-eden-text leading-tight">{m.title}</h1>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-[12px] font-medium text-eden-muted uppercase tracking-widest">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-eden-muted" />
                    {new Date(m.start_time || m.created_at || '').toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  <span className="w-1 h-1 rounded-full bg-eden-border" />
                  <div className="flex items-center gap-1.5">
                    <Globe size={14} className="text-eden-muted" />
                    {m.meeting_type || 'General'}
                  </div>
                  <span className="w-1 h-1 rounded-full bg-eden-border" />
                  <StatusBadge status={m.ai_transcription ? "processed" : "processing"} />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 h-10 px-4 bg-white border border-eden-border rounded-button text-[14px] font-medium text-eden-text hover:bg-eden-bg transition-shadow shadow-soft hover:shadow-hover-soft">
                <Share2 size={16} className="text-eden-primary" />
                Share
              </button>
              <button className="flex items-center gap-2 h-10 px-4 bg-eden-primary text-white rounded-button text-[14px] font-medium shadow-soft hover:shadow-hover-soft hover:bg-eden-indigo transition-all">
                <Download size={16} />
                Export
              </button>
            </div>
          </header>

          {/* Zone 2: Audio Player (Inline) */}
          {displayAudio && (
            <div className="bg-white px-6 lg:px-10 py-5 border-b border-eden-border shrink-0 z-0">
               <div className="max-w-[1200px] w-full mx-auto">
                <AudioPlayer 
                  audioId={displayAudio.id} 
                  filename={(displayAudio as any).s3_key?.split('/').pop() || (displayAudio as any).filename} 
                  onTimeUpdate={setCurrentTime}
                />
              </div>
            </div>
          )}

          {/* Zone 3: Intelligence Workspace (Universal Tab Layout) */}
          <main className="flex-1 max-w-[1200px] mx-auto w-full pt-8">
            {/* Universal Tab Layout */}
            <div className="flex flex-col">
              <div className="flex overflow-x-auto no-scrollbar px-6 lg:px-10 mb-6 border-b border-eden-border">
                {[
                  { id: 'transcript', label: 'Transcript', icon: <MessageSquare size={16} /> },
                  { id: 'summary', label: 'Intelligence', icon: <BookOpen size={16} /> },
                  { id: 'tasks', label: 'Action Items', icon: <CheckSquare size={16} /> }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 py-3 px-6 text-[14px] font-medium transition-all border-b-[3px] -mb-[1.5px] whitespace-nowrap ${
                      activeTab === tab.id 
                        ? 'border-eden-primary text-eden-text' 
                        : 'border-transparent text-eden-muted hover:text-eden-text'
                    }`}
                  >
                    <span className={activeTab === tab.id ? 'text-eden-primary' : ''}>{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="flex-1 pb-16">
                  <div className="px-6 lg:px-10">
                      {activeTab === 'transcript' && (
                        <TranscriptTab 
                          meeting={meeting} 
                          currentTime={currentTime}
                          onSeek={(time) => {
                            const audio = document.querySelector('audio') as HTMLAudioElement;
                            if (audio) {
                              audio.currentTime = time;
                              audio.play();
                            }
                          }}
                        />
                      )}
                      {activeTab === 'summary' && <SummaryTab meeting={meeting} />}
                      {activeTab === 'tasks' && <ActionItemsTab meeting={meeting} />}
                  </div>
              </div>
            </div>
          </main>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
