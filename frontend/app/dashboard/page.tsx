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
  FileText, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Mic, 
  Upload,
  Sparkles,
  Calendar,
  MoreHorizontal
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

  // Stats calculation
  const stats = useMemo(() => {
    const totalMeetings = meetings.length;
    const processing = meetings.filter(m => {
       if (m.audio_files && m.audio_files.length > 0) return !m.audio_files[0].processed;
       return !m.ai_transcription;
    }).length;
    const totalActions = extractions.flatMap(ex => ex.items || []).length;

    return [
      { 
        label: 'Meetings Processed', 
        value: totalMeetings, 
        icon: <FileText size={20} className="text-[#6C63FF]" />,
        bgColor: 'bg-[#6C63FF]/5'
      },
      { 
        label: 'Active Tasks', 
        value: processing, 
        icon: <Clock size={20} className="text-amber-500" />,
        bgColor: 'bg-amber-50'
      },
      { 
        label: 'Action Items', 
        value: totalActions, 
        icon: <CheckCircle2 size={20} className="text-emerald-500" />,
        bgColor: 'bg-emerald-50'
      },
    ];
  }, [meetings, extractions]);

  const columns: Column<Meeting>[] = [
    {
      key: 'title',
      label: 'Meeting',
      render: (val, item) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#F7F8FB] flex items-center justify-center text-neutral-400">
             <Calendar size={14} />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-neutral-900 text-[13px] group-hover:text-[#6C63FF] transition-colors">{val}</span>
            <span className="text-[11px] text-neutral-400 truncate max-w-[200px]">
              {item.description || 'No description provided'}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'start_time',
      label: 'Date',
      className: 'w-32',
      render: (_, item) => {
        const dateStr = item.start_time || item.created_at;
        return <span className="text-[12px] text-neutral-500">{dateStr ? new Date(dateStr).toLocaleDateString() : 'N/A'}</span>;
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

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-12">
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
            <div>
              <h2 className="text-[24px] font-bold text-[#0A1B3D] tracking-tight">Dashboard</h2>
              <p className="text-[14px] text-neutral-500 font-medium mt-1">Your meeting intelligence overview.</p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/record">
                <Button variant="secondary" className="h-10 px-5 text-[13px] font-semibold border-[#E5E7EB]">
                  <Mic size={16} className="mr-2" />
                  Record Meeting
                </Button>
              </Link>
              <Link href="/uploads">
                <Button className="h-10 px-5 text-[13px] font-semibold bg-[#6C63FF] text-white shadow-lg shadow-[#6C63FF]/20">
                  <Upload size={16} className="mr-2" />
                  Upload Recording
                </Button>
              </Link>
            </div>
          </div>

          {/* Section 1: Activity Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center transition-transform group-hover:scale-110`}>
                    {stat.icon}
                  </div>
                  <MoreHorizontal size={16} className="text-neutral-300 cursor-pointer hover:text-neutral-500" />
                </div>
                <p className="text-[13px] font-bold text-neutral-400 uppercase tracking-widest leading-none mb-2">{stat.label}</p>
                <p className="text-3xl font-bold text-[#0A1B3D] leading-none">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-10 items-start">
            {/* Section 2: Recent Meetings */}
            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-[18px] font-bold text-[#0A1B3D]">Recent Meetings</h3>
                <Link href="/meetings" className="text-[12px] font-bold text-[#6C63FF] hover:underline flex items-center gap-1 group">
                  View all meetings
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
              <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden">
                <Table
                  columns={columns}
                  data={meetings.slice(0, 8)}
                  emptyMessage="No meeting data available."
                />
              </div>
            </div>

            {/* Section 3: Action Items Panel */}
            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-[18px] font-bold text-[#0A1B3D]">Action Items</h3>
                <Link href="/action-items" className="text-[12px] font-bold text-[#6C63FF] hover:underline">
                  Manage tasks
                </Link>
              </div>
              <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden min-h-[480px] flex flex-col">
                <div className="flex-1 divide-y divide-[#F1F5F9]">
                  {extractions.flatMap(ex => ex.items || []).length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full py-20 px-8 text-center bg-[#F7F8FB]/50">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-[#E5E7EB] text-[#6C63FF]/20">
                         <Sparkles size={32} />
                      </div>
                      <p className="text-[15px] text-[#0A1B3D] font-bold">Clear for now</p>
                      <p className="text-[13px] text-neutral-500 mt-2 leading-relaxed">New action items will appear here after meetings are processed.</p>
                    </div>
                  ) : (
                    extractions.flatMap(ex => (ex.items || []).map(item => ({ ...item, meeting_title: ex.meeting_id })))
                      .slice(0, 8).map((item, idx) => (
                      <div key={idx} className="group p-5 hover:bg-[#F7F8FB] transition-all cursor-default overflow-hidden">
                        <div className="flex gap-4">
                          <div className="mt-1 flex-shrink-0">
                            <input type="checkbox" className="w-4 h-4 rounded border-[#E5E7EB] text-[#6C63FF] focus:ring-[#6C63FF] cursor-pointer" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] text-neutral-800 leading-relaxed font-medium group-hover:text-black transition-colors">{item.text}</p>
                            <div className="flex items-center gap-3 mt-3">
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wider uppercase ${item.decision ? 'bg-indigo-50 text-indigo-600' : 'bg-[#6C63FF]/10 text-[#6C63FF]'}`}>
                                {item.decision ? 'Decision' : 'Action'}
                              </span>
                              <span className="text-[11px] text-neutral-400 font-medium">
                                {item.owner || 'Unassigned'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                {/* Future Feature Preview */}
                <div className="p-5 bg-[#0A1B3D] m-4 rounded-xl text-white relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#6C63FF] opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform" />
                  <h4 className="text-[13px] font-bold flex items-center gap-2">
                    <Sparkles size={14} className="text-[#A5A0FF]" />
                    Meeting Auto-Join
                  </h4>
                  <p className="text-[11px] text-[#E5E7EB] mt-2 opacity-80 leading-relaxed">
                    Soon you'll be able to paste a meeting link and Eden will automatically join and record it for you.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
