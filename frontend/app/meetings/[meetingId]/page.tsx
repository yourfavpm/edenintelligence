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
        <div className="flex flex-col min-h-[calc(100vh-100px)] -m-6 md:-m-8 bg-white">
          {/* Zone 1: Page Header */}
          <header className="bg-white border-b border-[#E5E7EB] px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-4">
              <Link href="/meetings" className="p-2 hover:bg-[#F7F8FB] rounded-lg text-neutral-400 transition-colors border border-[#E5E7EB]">
                <ChevronLeft size={20} />
              </Link>
              <div>
                <h1 className="text-[18px] font-bold text-[#0A1B3D] leading-tight">{m.title}</h1>
                <div className="flex flex-wrap items-center gap-3 mt-1 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={12} className="text-[#A5A0FF]" />
                    {new Date(m.start_time || m.created_at || '').toLocaleDateString()}
                  </div>
                  <span className="w-1 h-1 rounded-full bg-neutral-300" />
                  <div className="flex items-center gap-1.5">
                    <Globe size={12} className="text-[#A5A0FF]" />
                    {m.meeting_type || 'General'}
                  </div>
                  <span className="w-1 h-1 rounded-full bg-neutral-300" />
                  <StatusBadge status={m.ai_transcription ? "processed" : "processing"} />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 h-9 px-4 bg-white border border-[#E5E7EB] rounded-lg text-[13px] font-bold text-[#0A1B3D] hover:bg-[#F7F8FB] transition-colors">
                <Share2 size={16} className="text-[#6C63FF]" />
                Share
              </button>
              <button className="flex items-center gap-2 h-9 px-4 bg-[#6C63FF] text-white rounded-lg text-[13px] font-bold shadow-lg shadow-[#6C63FF]/20 hover:bg-[#A5A0FF] transition-colors">
                <Download size={16} />
                Export Data
              </button>
            </div>
          </header>

          {/* Zone 2: Audio Player (Inline) */}
          {displayAudio && (
            <div className="bg-white px-6 py-6 border-b border-[#E5E7EB] shrink-0">
               <div className="max-w-[1200px] mx-auto w-full">
                <AudioPlayer 
                  audioId={displayAudio.id} 
                  filename={(displayAudio as any).s3_key?.split('/').pop() || (displayAudio as any).filename} 
                  onTimeUpdate={setCurrentTime}
                />
              </div>
            </div>
          )}

          {/* Zone 3: Intelligence Workspace (Universal Tab Layout) */}
          <main className="flex-1 bg-white max-w-[1200px] mx-auto w-full">
            {/* Universal Tab Layout */}
            <div className="flex flex-col">
              <div className="flex border-b border-[#E5E7EB] bg-white sticky top-[73px] z-10 overflow-x-auto no-scrollbar pt-2 px-6">
                {[
                  { id: 'transcript', label: 'Transcript', icon: <MessageSquare size={14} /> },
                  { id: 'summary', label: 'Intelligence', icon: <BookOpen size={14} /> },
                  { id: 'tasks', label: 'Action Items', icon: <CheckSquare size={14} /> }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 py-3 px-6 text-[14px] font-bold transition-all border-b-[3px] -mb-[1px] whitespace-nowrap ${
                      activeTab === tab.id 
                        ? 'border-[#6C63FF] text-[#1F2937]' 
                        : 'border-transparent text-neutral-500 hover:text-neutral-700'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="flex-1 pb-10">
                  <div className="px-6">
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
