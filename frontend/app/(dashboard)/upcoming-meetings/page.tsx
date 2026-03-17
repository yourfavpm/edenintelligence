'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { TableSkeleton } from '../../../components/Skeletons';
import { apiService } from '../../../services/api';
import { Meeting } from '../../../types/api';
import {
  Search,
  Plus,
  Calendar,
  Clock,
  Users,
  Play,
  Pencil,
  Trash2,
  ArrowUpDown,
  Filter,
  CalendarCheck,
  AlertCircle,
} from 'lucide-react';

// =============================================================================
// Status Badge
// =============================================================================

function ScheduleStatusBadge({ status }: { status: string | null | undefined }) {
  const config: Record<string, { label: string; color: string }> = {
    upcoming: { label: 'Upcoming', color: 'bg-neutral-100 text-neutral-600 border-neutral-200' },
    ready: { label: 'Ready to start', color: 'bg-[#6C63FF]/10 text-[#6C63FF] border-[#6C63FF]/20' },
    in_progress: { label: 'In progress', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    completed: { label: 'Completed', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    missed: { label: 'Missed', color: 'bg-red-50 text-red-600 border-red-200' },
  };
  const s = config[status || 'upcoming'] || config.upcoming;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${s.color}`}>
      {s.label}
    </span>
  );
}

// =============================================================================
// Upcoming Meetings Page
// =============================================================================

export default function UpcomingMeetingsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'today' | 'week' | 'upcoming' | 'past'>('all');
  const [sortBy, setSortBy] = useState<'time' | 'name'>('time');

  const { data: meetings = [], isLoading: loading, error: queryError, refetch } = useQuery({
    queryKey: ['meetings-upcoming'],
    queryFn: () => apiService.getUpcomingMeetings(),
  });

  const error = queryError ? (queryError as any).message || 'Failed to load upcoming meetings.' : null;

  const filteredMeetings = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekEnd = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    let result = meetings.filter(
      (m) =>
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filterMode === 'today') {
      result = result.filter((m) => {
        if (!m.start_time) return false;
        const d = new Date(m.start_time);
        return d >= today && d < new Date(today.getTime() + 24 * 60 * 60 * 1000);
      });
    } else if (filterMode === 'week') {
      result = result.filter((m) => {
        if (!m.start_time) return false;
        const d = new Date(m.start_time);
        return d >= today && d < weekEnd;
      });
    } else if (filterMode === 'upcoming') {
      result = result.filter((m) => {
        if (!m.start_time) return true;
        return new Date(m.start_time) >= now;
      });
    } else if (filterMode === 'past') {
      result = result.filter((m) => {
        if (!m.start_time) return false;
        return new Date(m.start_time) < now;
      });
    }

    result.sort((a, b) => {
      if (sortBy === 'name') return a.title.localeCompare(b.title);
      const ta = a.start_time ? new Date(a.start_time).getTime() : 0;
      const tb = b.start_time ? new Date(b.start_time).getTime() : 0;
      return tb - ta;
    });

    return result;
  }, [meetings, searchQuery, filterMode, sortBy]);

  const handleDelete = async (e: React.MouseEvent, id: number, title: string) => {
    e.stopPropagation();
    if (confirm(`Delete "${title}"?`)) {
      try {
        await apiService.deleteMeeting(id);
        refetch();
      } catch {
        alert('Failed to delete meeting');
      }
    }
  };

  const formatDate = (iso: string | null) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (iso: string | null) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  // =========================================================================
  // Empty State
  // =========================================================================

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 bg-[#F7F8FB] border border-[#E5E7EB] rounded-2xl flex items-center justify-center mb-6">
        <Calendar size={28} className="text-[#6C63FF]/60" />
      </div>
      <h3 className="text-[16px] font-bold text-[#1F2937] mb-2">No meetings scheduled yet</h3>
      <p className="text-[13px] text-neutral-500 max-w-xs mb-6">
        Schedule meetings in advance and start recording at the right time.
      </p>
      <button
        onClick={() => router.push('/schedule-meeting')}
        className="flex items-center gap-2 px-5 h-10 bg-[#6C63FF] text-white rounded-xl text-[13px] font-bold shadow-lg shadow-[#6C63FF]/20 hover:bg-[#5B54E0] transition-all active:scale-95"
      >
        <Plus size={16} />
        Schedule Meeting
      </button>
    </div>
  );

  // =========================================================================
  // Render
  // =========================================================================

  return (
    <div className="flex flex-col gap-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-[20px] font-bold text-[#0A1B3D] leading-tight">Upcoming Meetings</h1>
              <p className="text-[13px] text-neutral-500 mt-1">Meetings you plan to record with Eden.</p>
            </div>
            <button
              onClick={() => router.push('/schedule-meeting')}
              className="flex items-center gap-2 px-5 h-10 bg-[#6C63FF] text-white rounded-xl text-[13px] font-bold shadow-lg shadow-[#6C63FF]/20 hover:bg-[#5B54E0] transition-all active:scale-95 self-start sm:self-auto"
            >
              <Plus size={16} />
              Schedule Meeting
            </button>
          </div>

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 w-full sm:max-w-xs group">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-[#6C63FF] transition-colors" />
              <input
                type="text"
                placeholder="Search scheduled meetings…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-4 bg-white border border-[#E5E7EB] rounded-lg text-[13px] outline-none focus:border-[#6C63FF]/30 focus:ring-4 focus:ring-[#6C63FF]/5 transition-all"
              />
            </div>
            {/* Filter */}
            <div className="relative">
              <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
              <select
                value={filterMode}
                onChange={(e) => setFilterMode(e.target.value as any)}
                className="h-9 pl-8 pr-8 bg-white border border-[#E5E7EB] rounded-lg text-[13px] font-medium text-neutral-700 outline-none focus:border-[#6C63FF]/30 appearance-none cursor-pointer"
              >
                <option value="all">All</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
              </select>
            </div>
            {/* Sort */}
            <div className="relative">
              <ArrowUpDown size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="h-9 pl-8 pr-8 bg-white border border-[#E5E7EB] rounded-lg text-[13px] font-medium text-neutral-700 outline-none focus:border-[#6C63FF]/30 appearance-none cursor-pointer"
              >
                <option value="time">Sort by Time</option>
                <option value="name">Sort by Name</option>
              </select>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <TableSkeleton />
          ) : error ? (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-[13px] text-red-700">
              <AlertCircle size={18} />
              {error}
            </div>
          ) : filteredMeetings.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[#E5E7EB] bg-[#F7F8FB]/60">
                      <th className="px-5 py-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Meeting Name</th>
                      <th className="px-5 py-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Date</th>
                      <th className="px-5 py-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Time</th>
                      <th className="px-5 py-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Participants</th>
                      <th className="px-5 py-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Calendar</th>
                      <th className="px-5 py-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Status</th>
                      <th className="px-5 py-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMeetings.map((m) => (
                      <tr
                        key={m.id}
                        className="border-b border-[#E5E7EB] last:border-b-0 hover:bg-[#F7F8FB]/50 transition-colors group cursor-pointer"
                        onClick={() => router.push(`/meetings/${m.id}`)}
                      >
                        <td className="px-5 py-4">
                          <p className="text-[14px] font-bold text-[#1F2937] leading-tight">{m.title}</p>
                          {m.description && (
                            <p className="text-[12px] text-neutral-400 mt-0.5 truncate max-w-[220px]">{m.description}</p>
                          )}
                        </td>
                        <td className="px-5 py-4 text-[13px] text-neutral-600">{formatDate(m.start_time)}</td>
                        <td className="px-5 py-4">
                          <p className="text-[13px] text-neutral-600">{formatTime(m.start_time)}</p>
                          {m.duration_minutes && (
                            <p className="text-[11px] text-neutral-400">{m.duration_minutes} min</p>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          {m.participants && m.participants.length > 0 ? (
                            <div className="flex items-center gap-2">
                              <div className="flex -space-x-1.5">
                                {m.participants.slice(0, 3).map((p, i) => (
                                  <div
                                    key={i}
                                    className="w-6 h-6 rounded-full bg-gradient-to-br from-[#6C63FF] to-[#A5A0FF] flex items-center justify-center text-[9px] font-bold text-white ring-2 ring-white"
                                    title={p.display_name || p.email}
                                  >
                                    {(p.display_name || p.email || '?')[0].toUpperCase()}
                                  </div>
                                ))}
                              </div>
                              <span className="text-[11px] text-neutral-500 font-medium">
                                {m.participants.length} participant{m.participants.length !== 1 ? 's' : ''}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[12px] text-neutral-400">—</span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          {m.calendar_event_id ? (
                            <div className="flex items-center gap-1.5 text-[12px] text-emerald-600 font-medium">
                              <CalendarCheck size={14} />
                              Synced
                            </div>
                          ) : (
                            <span className="text-[12px] text-neutral-400">Not synced</span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <ScheduleStatusBadge status={m.schedule_status} />
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/record?meeting=${m.id}&title=${encodeURIComponent(m.title)}`);
                              }}
                              className="p-2 rounded-lg text-[#6C63FF] hover:bg-[#6C63FF]/10 transition-all"
                              title="Start Recording"
                            >
                              <Play size={16} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/schedule-meeting?edit=${m.id}`);
                              }}
                              className="p-2 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-all"
                              title="Edit"
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              onClick={(e) => handleDelete(e, m.id, m.title)}
                              className="p-2 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-all"
                              title="Delete"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card Layout */}
              <div className="md:hidden flex flex-col gap-3">
                {filteredMeetings.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => router.push(`/meetings/${m.id}`)}
                    className="bg-white border border-[#E5E7EB] rounded-2xl p-4 hover:shadow-md transition-all cursor-pointer active:scale-[0.99]"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-bold text-[#1F2937] leading-tight truncate">{m.title}</p>
                        {m.description && (
                          <p className="text-[12px] text-neutral-400 mt-0.5 truncate">{m.description}</p>
                        )}
                      </div>
                      <ScheduleStatusBadge status={m.schedule_status} />
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-neutral-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} className="text-[#A5A0FF]" />
                        {formatDate(m.start_time)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} className="text-[#A5A0FF]" />
                        {formatTime(m.start_time)}
                        {m.duration_minutes ? ` · ${m.duration_minutes}m` : ''}
                      </span>
                      {m.participants && m.participants.length > 0 && (
                        <span className="flex items-center gap-1">
                          <Users size={12} className="text-[#A5A0FF]" />
                          {m.participants.length} participant{m.participants.length !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/record?meeting=${m.id}&title=${encodeURIComponent(m.title)}`);
                      }}
                      className="w-full flex items-center justify-center gap-2 h-9 bg-[#6C63FF] text-white rounded-xl text-[13px] font-bold shadow-lg shadow-[#6C63FF]/20 hover:bg-[#5B54E0] transition-all active:scale-95"
                    >
                      <Play size={14} />
                      Start Recording
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
    </div>
  );
}
