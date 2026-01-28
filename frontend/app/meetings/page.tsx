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
// Meetings List Page
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

  // Filter logic
  const filteredMeetings = useMemo(() => {
    return meetings.filter((m) =>
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [meetings, searchQuery]);

  const columns: Column<Meeting>[] = [
    {
      key: 'title',
      label: 'Meeting',
      render: (val, item) => (
        <div className="flex flex-col">
          <span className="font-semibold text-neutral-900">{val}</span>
          <span className="text-xs text-neutral-500 truncate max-w-[300px]">
            {item.description || 'No description'}
          </span>
        </div>
      ),
    },
    {
      key: 'start_time',
      label: 'Date',
      render: (val, item) => {
        const dateStr = val || item.created_at;
        return dateStr ? new Date(dateStr).toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }) : 'N/A';
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
        // Check audio_files first
        if (item.audio_files && item.audio_files.length > 0) {
          const audioFile = item.audio_files[0];
          return audioFile.processed ? <StatusBadge status="processed" /> : <StatusBadge status="processing" />;
        }
        // Fall back to recordings
        if (item.recordings && item.recordings.length > 0) {
          const isProcessing = item.recordings.some(r => !r.processed);
          return isProcessing ? <StatusBadge status="processing" /> : <StatusBadge status="processed" />;
        }
        return <StatusBadge status="scheduled" />;
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, item) => (
        <div className="flex items-center gap-3">
          <Link
            href={`/meetings/${item.id}`}
            className="text-primary-600 hover:text-primary-700 font-medium text-xs"
          >
            View
          </Link>
          <button
            className="text-neutral-400 hover:text-error-600 transition-colors"
            onClick={async (e) => {
              e.stopPropagation();
              if (confirm(`Are you sure you want to delete "${item.title}"? This action cannot be undone.`)) {
                try {
                  await apiService.deleteMeeting(item.id);
                  setMeetings(meetings.filter(m => m.id !== item.id));
                } catch (err) {
                  alert('Failed to delete meeting');
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
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">Meetings</h1>
              <p className="text-neutral-500">Manage and review your meeting intelligence.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-64">
                <Input
                  placeholder="Search meetings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="!py-1.5"
                />
              </div>
              <Link href="/meetings/create">
                <Button>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Meeting
                </Button>
              </Link>
            </div>
          </div>

          {/* Table */}
          <div className="space-y-4">
            {loading ? (
              <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
                <TableSkeleton rows={8} columns={5} />
              </div>
            ) : error ? (
              <div className="p-12 text-center bg-error-50 rounded-xl border border-error-100">
                <p className="text-error-600 font-medium">{error}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-4"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </Button>
              </div>
            ) : (
              <Table
                columns={columns}
                data={filteredMeetings}
                emptyMessage={searchQuery ? "No meetings match your search." : "You haven't uploaded any meetings yet."}
                onRowClick={(m) => window.location.href = `/meetings/${m.id}`}
              />
            )}
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
