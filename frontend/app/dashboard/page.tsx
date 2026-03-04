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

// =============================================================================
// Dashboard Page - Master Redesign
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

  // Stats calculation - Compact operational style
  const stats = useMemo(() => {
    const totalMeetings = meetings.length;
    const processing = meetings.filter(m => {
       if (m.audio_files && m.audio_files.length > 0) return !m.audio_files[0].processed;
       return !m.ai_transcription;
    }).length;
    const totalActions = extractions.flatMap(ex => ex.items || []).length;

    return [
      { label: 'Meetings', value: totalMeetings, trend: 'Total' },
      { label: 'Active Tasks', value: processing, trend: 'In Progress' },
      { label: 'Action Items', value: totalActions, trend: 'Pending' },
    ];
  }, [meetings, extractions]);

  const columns: Column<Meeting>[] = [
    {
      key: 'title',
      label: 'Meeting',
      render: (val, item) => (
        <div className="flex flex-col">
          <span className="font-semibold text-neutral-900 text-[13.5px]">{val}</span>
          <span className="text-[11px] text-neutral-400 truncate max-w-[240px]">
            {item.description || 'No description provided'}
          </span>
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
          className="p-1.5 text-neutral-300 hover:text-[#4F46E5] transition-colors inline-block"
          title="View Details"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
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
        <div className="space-y-10 animate-fade-in">
          {/* Metrics Strip - Compact operational widgets */}
          <div className="flex flex-wrap gap-4 overflow-x-auto no-scrollbar">
            {stats.map((stat, i) => (
              <div key={i} className="flex-1 min-w-[180px] bg-white p-4 rounded-lg border border-[#E5E7EB] shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-widest leading-none mb-2">{stat.label}</p>
                  <p className="text-2xl font-semibold text-neutral-900 leading-none">{stat.value}</p>
                </div>
                <div className="text-[10px] px-2 py-0.5 bg-neutral-50 text-neutral-400 rounded-full font-medium border border-neutral-100 italic">
                  {stat.trend}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-10 items-start">
            {/* Left Column: Recent Meetings operational panel */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-[16px] font-semibold text-neutral-900">Recent Meetings</h2>
                <Link href="/meetings" className="text-[11px] font-semibold text-[#4F46E5] hover:underline tracking-tight uppercase">
                  View Full Directory
                </Link>
              </div>
              <Table
                columns={columns}
                data={meetings.slice(0, 8)}
                emptyMessage="No meeting data available."
              />
            </div>

            {/* Right Column: Active Action Items panel */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-[16px] font-semibold text-neutral-900">Action Items</h2>
                <Link href="/action-items" className="text-[11px] font-semibold text-[#4F46E5] hover:underline tracking-tight uppercase">
                  Manage Tasks
                </Link>
              </div>
              <div className="bg-white rounded-lg border border-[#E5E7EB] shadow-sm overflow-hidden min-h-[400px]">
                <div className="divide-y divide-[#F1F5F9]">
                  {extractions.flatMap(ex => ex.items || []).length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                      <div className="w-10 h-10 bg-neutral-50 rounded-full flex items-center justify-center mb-4 border border-neutral-100 text-neutral-300">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-[13px] text-neutral-500 font-medium">Clear for now</p>
                      <p className="text-[11px] text-neutral-400 mt-1">New action items will appear here.</p>
                    </div>
                  ) : (
                    extractions.flatMap(ex => (ex.items || []).map(item => ({ ...item, meeting_title: ex.meeting_id })))
                      .slice(0, 10).map((item, idx) => (
                      <div key={idx} className="group p-4 hover:bg-[#F8FAFC] transition-all cursor-default relative">
                        <div className="flex gap-3">
                          <button className="mt-0.5 w-4 h-4 rounded-md border border-neutral-300 group-hover:border-[#4F46E5] transition-colors flex items-center justify-center shrink-0">
                            <div className="w-1.5 h-1.5 bg-[#4F46E5] rounded-sm opacity-0 group-hover:opacity-20 translate-y-0.5 group-hover:translate-y-0 transition-all" />
                          </button>
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] text-neutral-800 leading-snug group-hover:text-black transition-colors">{item.text}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider ${item.decision ? 'bg-indigo-50 text-indigo-600' : 'bg-blue-50 text-blue-600'}`}>
                                {item.decision ? 'Decision' : 'Action'}
                              </span>
                              <span className="text-[10px] text-neutral-400">
                                {item.owner || 'Unassigned'}
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
