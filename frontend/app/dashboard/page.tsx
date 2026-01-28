'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Layout from '../../components/Layout';
import ProtectedRoute from '../../components/ProtectedRoute';
import { Table, Column } from '../../components/Table';
import { DashboardSkeleton } from '../../components/Skeletons';
import { StatusBadge, Button } from '../../components/ui';
import { apiService } from '../../services/api';
import { Meeting, MeetingDetail, ExtractionRead } from '../../types/api';
import Link from 'next/link';

// =============================================================================
// Dashboard Page
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
          apiService.getAllExtractions(), // Get recent extractions for action items
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
    const processing = meetings.filter(m => m.ai_transcription === false).length; // Simplified check
    const pendingActions = extractions.length;

    return [
      {
        label: 'Total Meetings', value: totalMeetings, icon: (
          <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )
      },
      {
        label: 'Active Tasks', value: processing, icon: (
          <svg className="w-5 h-5 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      },
      {
        label: 'Action Items', value: pendingActions, icon: (
          <svg className="w-5 h-5 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        )
      },
    ];
  }, [meetings, extractions]);

  const columns: Column<Meeting>[] = [
    {
      key: 'title',
      label: 'Meeting',
      render: (val, item) => (
        <div className="flex flex-col">
          <span className="font-semibold text-neutral-900">{val}</span>
          <span className="text-xs text-neutral-500 truncate max-w-[200px]">
            {item.description || 'No description'}
          </span>
        </div>
      ),
    },
    {
      key: 'start_time',
      label: 'Date',
      render: (_, item) => {
        const dateStr = item.start_time || item.created_at;
        return dateStr ? new Date(dateStr).toLocaleDateString() : 'N/A';
      },
    },
    {
      key: 'meeting_type',
      label: 'Type',
      render: (val) => <span className="capitalize">{val}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (_, item) => {
        // Check audio_files first (new upload system)
        if (item.audio_files && item.audio_files.length > 0) {
          const audioFile = item.audio_files[0];
          return audioFile.processed ? <StatusBadge status="processed" /> : <StatusBadge status="processing" />;
        }

        // Fall back to recordings (legacy system)
        if (item.ai_transcription && item.recordings && item.recordings.length > 0) {
          const isProcessing = item.recordings.some(r => !r.processed && r.processing_status !== 'failed');
          const isFailed = item.recordings.some(r => r.processing_status === 'failed');
          if (isProcessing) return <StatusBadge status="processing" />;
          if (isFailed) return <StatusBadge status="failed" />;
          return <StatusBadge status="processed" />;
        }

        return <StatusBadge status="scheduled" />;
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, item) => (
        <Link
          href={`/meetings/${item.id}`}
          className="text-primary-600 hover:text-primary-700 font-medium text-xs"
        >
          View Details
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
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
              <p className="text-neutral-500">Welcome back. Here is what is happening today.</p>
            </div>
            <Link href="/uploads">
              <Button>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Upload
              </Button>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-neutral-500">{stat.label}</span>
                  <div className="p-2 bg-neutral-50 rounded-lg">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl font-bold text-neutral-900">{stat.value}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Meetings Table */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-lg font-bold text-neutral-900">Recent Meetings</h2>
              <Table
                columns={columns}
                data={meetings.slice(0, 5)}
                emptyMessage="You haven't uploaded any meetings yet."
              />
              {meetings.length > 5 && (
                <div className="text-center">
                  <Link href="/meetings" className="text-sm text-primary-600 hover:underline font-medium">
                    View all meetings
                  </Link>
                </div>
              )}
            </div>

            {/* Recent Action Items */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-neutral-900">Recent Action Items</h2>
              <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
                <div className="divide-y divide-neutral-100">
                  {extractions.flatMap(ex => ex.items || []).length === 0 ? (
                    <div className="p-8 text-center text-neutral-500 italic text-sm">
                      No action items found yet.
                    </div>
                  ) : (
                    extractions.flatMap(ex => (ex.items || []).map(item => ({ ...item, meeting_id: ex.meeting_id }))).slice(0, 8).map((item, idx) => (
                      <div key={idx} className="p-4 hover:bg-neutral-50 transition-colors">
                        <div className="flex gap-3">
                          <div className={`mt-1 w-4 h-4 rounded-full border-2 flex-shrink-0 ${item.decision ? 'border-indigo-400' : 'border-primary-400'}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-neutral-900 line-clamp-2">{item.text}</p>
                            <p className="text-[10px] text-neutral-400 mt-1 uppercase font-bold tracking-wider">
                              {item.decision ? 'Decision' : 'Action Item'} • {item.owner || 'Unassigned'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {extractions.length > 8 && (
                  <div className="p-3 bg-neutral-50 text-center border-t border-neutral-100">
                    <Link href="/action-items" className="text-xs text-primary-600 hover:underline font-medium">
                      View all items
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
