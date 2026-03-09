'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Layout from '../../components/Layout';
import ProtectedRoute from '../../components/ProtectedRoute';
import { Table, Column } from '../../components/Table';
import { DashboardSkeleton } from '../../components/Skeletons';
import { StatusBadge, Button } from '../../components/ui';
import { apiService } from '../../services/api';
import { Meeting, ExtractionRead } from '../../types/api';
import Link from 'next/link';
import { 
  ArrowRight, 
  Mic, 
  Upload,
  Calendar,
  CheckCircle2,
  Inbox,
  Clock,
  CircleDashed
} from 'lucide-react';

// =============================================================================
// Dashboard Page - Eden Intelligence Redesign
// =============================================================================

export default function DashboardPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [extractions, setExtractions] = useState<ExtractionRead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [meetingsData, extractionsData] = await Promise.all([
          apiService.getMeetings(),
          apiService.getAllExtractions(),
        ]);
        setMeetings(meetingsData);
        setExtractions(extractionsData);
      } catch (err: any) {
        console.error(err);
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  };

  const columns: Column<Meeting>[] = [
    {
      key: 'title',
      label: 'Meeting',
      render: (val, item) => (
        <div className="flex items-center gap-3 py-1">
          <div className="w-8 h-8 rounded-lg border border-[#E5E7EB] bg-white flex items-center justify-center text-neutral-400 shrink-0">
             <Calendar size={14} />
          </div>
          <div className="flex flex-col min-w-0">
            <Link href={`/meetings/${item.id}`} className="font-semibold text-neutral-900 text-[13px] hover:text-[#6C63FF] transition-colors truncate">
              {val}
            </Link>
            <span className="text-[12px] text-neutral-400 truncate max-w-[280px]">
              {item.description || 'No description provided'}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'start_time',
      label: 'Date',
      className: 'w-32 hidden sm:table-cell',
      render: (_, item) => {
        const dateStr = item.start_time || item.created_at;
        if (!dateStr) return <span className="text-[12px] text-neutral-400">N/A</span>;
        const d = new Date(dateStr);
        return (
          <div className="flex flex-col">
            <span className="text-[12px] font-medium text-neutral-700">{d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            <span className="text-[11px] text-neutral-400">{d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}</span>
          </div>
        );
      },
    },
    {
      key: 'status',
      label: 'Status',
      className: 'w-24',
      render: (_, item) => {
        if (item.audio_files && item.audio_files.length > 0) {
          const audioFile = item.audio_files[0];
          return <StatusBadge status={audioFile.processed ? "processed" : "processing"} />;
        }
        return <StatusBadge status={item.ai_transcription ? "processed" : "scheduled"} />;
      },
    },
    {
      key: 'actions',
      label: '',
      className: 'w-10 text-right',
      render: (_, item) => (
        <Link
          href={`/meetings/${item.id}`}
          className="p-1.5 text-neutral-300 hover:text-[#6C63FF] hover:bg-[#F7F8FB] rounded-lg transition-all inline-block"
        >
          <ArrowRight size={16} />
        </Link>
      ),
    },
  ];

  if (loading) {
    return (
      <ProtectedRoute>
        <Layout>
          <DashboardSkeleton />
        </Layout>
      </ProtectedRoute>
    );
  }

  const allTasks = extractions.flatMap(ex => (ex.items || []).map(item => ({ 
    ...item, 
    meeting_title: ex.meeting_id,
    completed: Math.random() > 0.8 // Simulated status for demo
  })));
  const pendingTasks = allTasks.filter(t => !t.completed).slice(0, 8);

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-[1100px] mx-auto space-y-10 pb-16">
          
          {/* Dashboard Header - Minimalist */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-4 md:pt-8 bg-white pb-6 border-b border-transparent">
            <div>
              <h1 className="text-[24px] md:text-[28px] font-bold text-[#0A1B3D] tracking-tight">
                Good {getTimeOfDay()}
              </h1>
              <p className="text-[14px] text-neutral-500 mt-2 leading-relaxed">
                Here's what is happening across your workspace today.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/record">
                <Button variant="secondary" className="h-9 px-4 text-[13px] font-bold border-[#E5E7EB] bg-white text-neutral-700 hover:bg-[#F7F8FB]">
                  <Mic size={14} className="mr-2" />
                  Record
                </Button>
              </Link>
              <Link href="/uploads">
                <Button className="h-9 px-4 text-[13px] font-bold bg-[#6C63FF] text-white shadow-sm hover:opacity-90 transition-opacity">
                  <Upload size={14} className="mr-2" />
                  Upload
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 xl:gap-16 items-start">
            
            {/* Main Column: Recent Meetings */}
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-[15px] font-bold text-[#0A1B3D] flex items-center gap-2">
                  <Clock size={16} className="text-neutral-400" />
                  Recent Activity
                </h3>
                <Link href="/meetings" className="text-[12px] font-bold text-[#6C63FF] hover:underline flex items-center gap-1 group">
                  View all
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
              
              <div className="bg-white rounded-lg border border-[#E5E7EB] overflow-hidden">
                <Table
                  columns={columns}
                  data={meetings.slice(0, 10)}
                  emptyMessage={
                    <div className="py-12 flex flex-col items-center justify-center text-center">
                      <div className="w-12 h-12 bg-neutral-50 rounded-full flex items-center justify-center mb-4 border border-[#E5E7EB]">
                        <Inbox size={20} className="text-neutral-300" />
                      </div>
                      <p className="text-[14px] font-medium text-neutral-900">No meeting data</p>
                      <p className="text-[13px] text-neutral-500 mt-1 max-w-[250px]">Record or upload a meeting to see it appear here.</p>
                    </div>
                  }
                />
              </div>
            </div>

            {/* Side Column: Action Items Panel */}
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-[15px] font-bold text-[#0A1B3D] flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-neutral-400" />
                  Your Tasks
                </h3>
                <Link href="/action-items" className="text-[12px] font-bold text-[#6C63FF] hover:underline">
                  Manage
                </Link>
              </div>
              
              <div className="bg-white rounded-lg border border-[#E5E7EB]">
                <div className="divide-y divide-[#F1F5F9]">
                  {pendingTasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                      <CircleDashed size={24} className="text-neutral-300 mb-3" />
                      <p className="text-[13px] font-medium text-neutral-900">You're all caught up</p>
                      <p className="text-[12px] text-neutral-500 mt-1 leading-relaxed">Tasks assigned to you will appear here.</p>
                    </div>
                  ) : (
                    pendingTasks.map((item, idx) => (
                      <div key={idx} className="group p-4 hover:bg-[#F7F8FB] transition-colors cursor-default">
                        <div className="flex items-start gap-3">
                          <input 
                            type="checkbox" 
                            className="mt-1 w-4 h-4 rounded-sm border-[#D1D5DB] text-[#6C63FF] focus:ring-[#6C63FF] focus:ring-offset-0 cursor-pointer transition-colors" 
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] text-neutral-800 leading-snug font-medium group-hover:text-black transition-colors">{item.text}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${item.decision ? 'bg-[#F7F8FB] text-indigo-600 border border-indigo-100' : 'bg-neutral-50 text-neutral-500 border border-[#E5E7EB]'}`}>
                                {item.decision ? 'Decision' : 'Task'}
                              </span>
                              <span className="text-[11px] text-neutral-400 truncate max-w-[120px]">
                                {item.meeting_title || 'Meeting'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
