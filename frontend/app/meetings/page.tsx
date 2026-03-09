'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Layout from '../../components/Layout';
import ProtectedRoute from '../../components/ProtectedRoute';
import { TableSkeleton } from '../../components/Skeletons';
import { apiService } from '../../services/api';
import { Meeting } from '../../types/api';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  MoreHorizontal, 
  Trash2, 
  ExternalLink,
  Plus,
  Upload,
  Clock,
  Video,
  FileAudio,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// =============================================================================
// Meetings Library Page - Eden Intelligence Workspace
// =============================================================================

export default function MeetingsListPage() {
  const router = useRouter();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    const fetchMeetings = async () => {
      setLoading(true);
      try {
        const data = await apiService.getMeetings();
        setMeetings(data);
      } catch (err: any) {
        console.error(err);
        setError('Failed to load meetings library.');
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

  const paginatedMeetings = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredMeetings.slice(start, start + itemsPerPage);
  }, [filteredMeetings, currentPage]);

  const totalPages = Math.ceil(filteredMeetings.length / itemsPerPage);

  const handleDelete = async (e: React.MouseEvent, id: number, title: string) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete the meeting "${title}"?`)) {
      try {
        await apiService.deleteMeeting(id);
        setMeetings(meetings.filter(m => m.id !== id));
      } catch (err) {
        alert('Failed to delete meeting');
      }
    }
  };

  const getStatusInfo = (meeting: Meeting) => {
    const audioFile = meeting.audio_files?.[0];
    if (audioFile?.processed || meeting.ai_transcription) {
      return { label: 'Completed', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    }
    return { label: 'Processing', color: 'bg-orange-50 text-orange-700 border-orange-200' };
  };

  const getTypeInfo = (meeting: Meeting) => {
    const isUploaded = meeting.audio_files && meeting.audio_files.length > 0;
    return isUploaded ? 'Uploaded recording' : 'Recorded native';
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-[1200px] mx-auto flex flex-col h-full min-h-[calc(100vh-100px)]">
          
          {/* Page Header */}
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6 shrink-0">
            <div>
              <h1 className="text-[22px] font-bold text-[#0A1B3D] tracking-tight">Meetings</h1>
              <p className="text-[13px] text-neutral-500 font-medium mt-1">
                All captured conversations and recordings.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/uploads" className="flex items-center gap-2 h-9 px-4 bg-white border border-[#E5E7EB] rounded-lg text-[13px] font-bold text-[#0A1B3D] hover:bg-[#F7F8FB] transition-colors shadow-sm">
                <Upload size={16} />
                Upload Recording
              </Link>
              <Link href="/record" className="flex items-center gap-2 h-9 px-4 bg-[#6C63FF] text-white rounded-lg text-[13px] font-bold shadow-lg shadow-[#6C63FF]/20 hover:bg-[#A5A0FF] transition-colors">
                <Video size={16} />
                Record New Meeting
              </Link>
            </div>
          </header>

          {/* Page Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB] shrink-0">
            <div className="relative w-full sm:max-w-md">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-neutral-400">
                <Search size={16} />
              </div>
              <input
                type="text"
                placeholder="Search meetings or transcripts..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-4 h-9 bg-[#F7F8FB] border border-transparent focus:bg-white focus:border-[#6C63FF] rounded-lg text-[13px] font-medium placeholder-neutral-400 focus:outline-none transition-all focus:ring-4 focus:ring-[#6C63FF]/10"
              />
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 h-9 px-3 bg-white border border-[#E5E7EB] rounded-lg text-[13px] font-bold text-neutral-600 hover:bg-[#F7F8FB] transition-colors">
                <Filter size={16} />
                Filter
              </button>
              <button className="flex items-center gap-2 h-9 px-3 bg-white border border-[#E5E7EB] rounded-lg text-[13px] font-bold text-neutral-600 hover:bg-[#F7F8FB] transition-colors">
                <ArrowUpDown size={16} />
                Sort
              </button>
            </div>
          </div>

          {/* Main Data Workspace */}
          <main className="flex-1 py-4 flex flex-col min-h-0">
            {loading ? (
              <div className="space-y-4 pt-4">
                <TableSkeleton rows={8} columns={5} />
              </div>
            ) : error ? (
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center max-w-sm">
                  <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trash2 size={24} />
                  </div>
                  <h3 className="text-[15px] font-bold text-neutral-900 mb-2">Error Loading Data</h3>
                  <p className="text-[13px] text-neutral-500 mb-4">{error}</p>
                  <button onClick={() => window.location.reload()} className="h-9 px-4 bg-[#0A1B3D] text-white rounded-lg text-[13px] font-bold">Try Again</button>
                </div>
              </div>
            ) : filteredMeetings.length === 0 ? (
              /* Empty State */
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-fade-in">
                <div className="w-24 h-24 mb-6 rounded-3xl bg-[#F7F8FB] border border-[#E5E7EB] flex items-center justify-center shadow-inner">
                  <Video size={32} className="text-[#A5A0FF]" />
                </div>
                <h3 className="text-[18px] font-bold text-[#0A1B3D] mb-2">No meetings yet</h3>
                <p className="text-[15px] text-neutral-500 mb-8 max-w-sm">
                  Upload or record a meeting to start generating insights.
                </p>
                <div className="flex items-center gap-3">
                  <Link href="/record" className="flex items-center gap-2 h-10 px-6 bg-[#6C63FF] text-white rounded-xl text-[14px] font-bold shadow-lg shadow-[#6C63FF]/20 hover:bg-[#A5A0FF] transition-all hover:-translate-y-0.5">
                    Record Meeting
                  </Link>
                  <Link href="/uploads" className="flex items-center gap-2 h-10 px-6 bg-white border border-[#E5E7EB] text-[#0A1B3D] rounded-xl text-[14px] font-bold hover:bg-[#F7F8FB] transition-all shadow-sm">
                    Upload Recording
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-full animate-fade-in">
                
                {/* Desktop Table View */}
                <div className="hidden md:block flex-1 overflow-auto min-h-0 bg-white border border-[#E5E7EB] rounded-xl shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-[#F7F8FB] border-b border-[#E5E7EB] z-10">
                      <tr>
                        <th className="px-6 py-3 text-[12px] font-bold text-neutral-500 uppercase tracking-wider w-[40%]">Meeting Name</th>
                        <th className="px-6 py-3 text-[12px] font-bold text-neutral-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-[12px] font-bold text-neutral-500 uppercase tracking-wider">Duration</th>
                        <th className="px-6 py-3 text-[12px] font-bold text-neutral-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-[12px] font-bold text-neutral-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-[12px] font-bold text-neutral-500 uppercase tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F1F5F9]">
                      {paginatedMeetings.map((meeting) => {
                        const dateObj = new Date(meeting.start_time || meeting.created_at || Date.now());
                        const status = getStatusInfo(meeting);
                        const typeLabel = meeting.meeting_type === 'external' ? 'Uploaded' : 'Recorded';

                        return (
                          <tr 
                            key={meeting.id}
                            onClick={() => router.push(`/meetings/${meeting.id}`)}
                            className="group hover:bg-[#F7F8FB]/50 transition-colors cursor-pointer"
                          >
                            <td className="px-6 py-4 align-top">
                              <p className="text-[14px] font-bold text-[#0A1B3D] group-hover:text-[#6C63FF] transition-colors line-clamp-1">
                                {meeting.title}
                              </p>
                              <p className="text-[13px] text-neutral-500 mt-1 flex items-center gap-1.5">
                                {getTypeInfo(meeting)}
                              </p>
                            </td>
                            <td className="px-6 py-4 align-top">
                              <p className="text-[14px] font-medium text-neutral-900">
                                {dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                              </p>
                              <p className="text-[13px] text-neutral-500 mt-1">
                                {dateObj.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
                              </p>
                            </td>
                            <td className="px-6 py-4 align-top">
                              <span className="text-[14px] font-medium text-neutral-600 flex items-center gap-1.5">
                                <Clock size={14} className="text-neutral-400" />
                                {meeting.duration_minutes ? `${meeting.duration_minutes} min` : 'Unknown'}
                              </span>
                            </td>
                            <td className="px-6 py-4 align-top">
                              <span className="inline-flex items-center px-2 py-1 rounded bg-[#F1F5F9] text-neutral-600 text-[11px] font-bold uppercase tracking-wider">
                                {typeLabel}
                              </span>
                            </td>
                            <td className="px-6 py-4 align-top">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-[11px] border font-bold uppercase tracking-wider ${status.color}`}>
                                {status.label}
                              </span>
                            </td>
                            <td className="px-6 py-4 align-top text-right">
                              <div className="flex items-center justify-end gap-2 text-neutral-400">
                                <button className="p-1.5 hover:text-[#6C63FF] hover:bg-indigo-50 rounded-lg transition-colors" title="Open Meeting">
                                  <ExternalLink size={18} />
                                </button>
                                <button 
                                  onClick={(e) => handleDelete(e, meeting.id, meeting.title)}
                                  className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                                  title="Delete Meeting"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile List Cards View */}
                <div className="md:hidden flex-1 overflow-auto space-y-3 pb-4 min-h-0">
                  {paginatedMeetings.map((meeting) => {
                    const dateObj = new Date(meeting.start_time || meeting.created_at || Date.now());
                    const status = getStatusInfo(meeting);
                    
                    return (
                      <div 
                        key={meeting.id}
                        onClick={() => router.push(`/meetings/${meeting.id}`)}
                        className="bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-sm hover:border-[#6C63FF] transition-colors cursor-pointer flex flex-col gap-3"
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <h3 className="text-[15px] font-bold text-[#0A1B3D] leading-tight line-clamp-2">{meeting.title}</h3>
                            <p className="text-[13px] text-neutral-500 mt-1">{getTypeInfo(meeting)}</p>
                          </div>
                          <button 
                            onClick={(e) => handleDelete(e, meeting.id, meeting.title)}
                            className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg shrink-0"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between text-[13px] font-medium text-neutral-600 border-t border-[#F1F5F9] pt-3">
                          <div className="flex flex-col">
                            <span>{dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                            <span className="text-neutral-400 text-[12px]">{dateObj.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}</span>
                          </div>
                          <div className="flex flex-col items-end gap-1.5">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${status.color}`}>
                              {status.label}
                            </span>
                            {meeting.duration_minutes && (
                              <span className="flex items-center gap-1 text-[12px]">
                                <Clock size={12} /> {meeting.duration_minutes}m
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pt-4 mt-2 border-t border-[#E5E7EB] flex items-center justify-between shrink-0">
                    <p className="text-[13px] text-neutral-500 font-medium hidden sm:block">
                      Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredMeetings.length)} of {filteredMeetings.length}
                    </p>
                    <div className="flex items-center gap-2 max-sm:w-full max-sm:justify-between">
                      <button 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="flex items-center gap-1 h-8 px-3 rounded-lg border border-[#E5E7EB] text-[13px] font-bold text-neutral-600 hover:bg-[#F7F8FB] disabled:opacity-50 disabled:pointer-events-none"
                      >
                        <ChevronLeft size={16} /> Previous
                      </button>
                      
                      <div className="hidden sm:flex items-center gap-1">
                        {Array.from({ length: totalPages }).map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`w-8 h-8 rounded-lg text-[13px] font-bold ${
                              currentPage === i + 1 
                                ? 'bg-[#6C63FF] text-white shadow-md' 
                                : 'text-neutral-600 hover:bg-[#F7F8FB]'
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>

                      <button 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-1 h-8 px-3 rounded-lg border border-[#E5E7EB] text-[13px] font-bold text-neutral-600 hover:bg-[#F7F8FB] disabled:opacity-50 disabled:pointer-events-none"
                      >
                        Next <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}
                
              </div>
            )}
          </main>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
