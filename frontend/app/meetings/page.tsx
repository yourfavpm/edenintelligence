'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import ProtectedRoute from '../../components/ProtectedRoute';
import { Table, Column } from '../../components/Table';
import { TableSkeleton } from '../../components/Skeletons';
import { Button, Input, StatusBadge } from '../../components/ui';
import { apiService } from '../../services/api';
import { Meeting } from '../../types/api';

// =============================================================================
// Meetings List Page - Praxiom Redesign
// =============================================================================

export default function MeetingsListPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchMeetings = async () => {
      setLoading(true);
      try {
        const data = await apiService.getMeetings();
        setMeetings(data);
      } catch (err: any) {
        console.error(err);
        setError('Failed to load meetings list.');
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  const filteredMeetings = useMemo(() => {
    return meetings.filter((m) =>
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [meetings, searchQuery]);

  const columns: Column<Meeting>[] = [
    {
      key: 'title',
      label: 'Meeting Name',
      render: (val, item) => (
        <div className="flex flex-col">
          <span className="font-semibold text-neutral-900 text-[14px] leading-tight">{val}</span>
          <span className="text-[11px] text-neutral-400 truncate max-w-[320px] mt-0.5">
            {item.description || 'No description provided'}
          </span>
        </div>
      ),
    },
    {
      key: 'start_time',
      label: 'Date',
      className: 'w-40',
      render: (val, item) => {
        const dateStr = val || item.created_at;
        return dateStr ? (
          <div className="text-[12px] text-neutral-600 flex flex-col">
            <span className="font-medium">{new Date(dateStr).toLocaleDateString()}</span>
            <span className="text-[10px] text-neutral-400 uppercase tracking-tight">
              {new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ) : <span className="text-neutral-300">N/A</span>;
      },
    },
    {
      key: 'meeting_type',
      label: 'Type',
      className: 'w-24',
      render: (val) => <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-widest">{val || 'Other'}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      className: 'w-28',
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
      className: 'w-20 text-right',
      render: (_, item) => (
        <div className="flex items-center justify-end gap-1">
          <Link
            href={`/meetings/${item.id}`}
            className="p-1.5 text-neutral-400 hover:text-[#4F46E5] hover:bg-neutral-50 rounded-md transition-all"
            title="View Intelligence"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <button
            className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-neutral-50 rounded-md transition-all"
            onClick={async (e) => {
              e.stopPropagation();
              if (confirm(`Delete roadmap and data for "${item.title}"?`)) {
                try {
                  await apiService.deleteMeeting(item.id);
                  setMeetings(meetings.filter(m => m.id !== item.id));
                } catch (err) {
                  alert('Delete failed');
                }
              }
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-6 animate-fade-in">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-[20px] font-semibold text-neutral-900 tracking-tight">Meetings</h1>
              <p className="text-[13px] text-neutral-500 font-medium">Full repository of captured knowledge.</p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="relative w-full sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-neutral-400">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Filter by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 h-9 bg-white border border-[#E5E7EB] rounded-lg text-[13px] font-medium placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-[#4F46E5] focus:border-transparent transition-all"
                />
              </div>
              <Link href="/record">
                <Button className="h-9 px-4 bg-[#4F46E5] text-white rounded-lg text-[13px] font-semibold shadow-sm hover:bg-indigo-700">
                  Record New
                </Button>
              </Link>
            </div>
          </div>

          {/* Directory Table */}
          <div className="mt-8">
            {loading ? (
              <div className="space-y-4">
                <TableSkeleton rows={12} columns={5} />
              </div>
            ) : error ? (
              <div className="p-10 text-center bg-white rounded-lg border border-red-100 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-4">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <p className="text-[14px] text-neutral-800 font-semibold">{error}</p>
                <button onClick={() => window.location.reload()} className="mt-4 text-[12px] font-bold text-[#4F46E5] hover:underline uppercase tracking-wider">Retry Connection</button>
              </div>
            ) : (
              <Table
                columns={columns}
                data={filteredMeetings}
                emptyMessage={searchQuery ? "No matches for your query." : "Knowledge base is currently empty."}
                onRowClick={(m) => window.location.href = `/meetings/${m.id}`}
              />
            )}
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
