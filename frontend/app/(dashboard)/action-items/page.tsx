'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TableSkeleton } from '@/components/Skeletons';
import { apiService } from '@/services/api';
import { ExtractionRead } from '@/types/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Filter, 
  Trash2, 
  CheckCircle,
  Circle,
  Edit2,
  Calendar,
  User,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ListTodo
} from 'lucide-react';

// =============================================================================
// Action Items Aggregator - High-Density Enterprise Redesign
// =============================================================================

export default function ActionItemsPage() {
  const router = useRouter();
  
  const { data: extractions = [], isLoading: loading, error: queryError } = useQuery({
    queryKey: ['extractions', 'all'],
    queryFn: () => apiService.getAllExtractions(),
  });

  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const error = queryError ? 'Failed to synchronize task index.' : null;

  const flattenedItems = useMemo(() => {
    return extractions.flatMap(ex => (ex.items || []).map(item => ({
      ...item,
      meeting_id: ex.meeting_id,
      id: `${ex.id}-${item.text.substring(0, 10).replace(/[^a-zA-Z0-9]/g, '')}`,
      // Simulated task data for UI demo purposes
      status: Math.random() > 0.6 ? 'completed' : Math.random() > 0.5 ? 'in_progress' : 'pending',
      due_date: item.due_date || new Date(Date.now() + (Math.random() * 10 - 3) * 86400000).toISOString(),
      meeting_name: `Meeting Context #${ex.meeting_id || 'Unknown'}` // Placeholder since we don't have join in this endpoint yet
    })));
  }, [extractions]);

  const filteredItems = useMemo(() => {
    return flattenedItems.filter((item) => {
      const matchesSearch = item.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.owner?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [flattenedItems, searchQuery]);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return { label: 'Completed', color: 'bg-status-success-bg text-status-success-text border-transparent' };
      case 'in_progress': return { label: 'In Progress', color: 'bg-status-info-bg text-status-info-text border-transparent' };
      default: return { label: 'Pending', color: 'bg-claeron-bg text-claeron-muted border-transparent' };
    }
  };

  const isOverdue = (dateStr: string) => {
    return new Date(dateStr).getTime() < Date.now();
  };

  return (
    <div className="max-w-[1200px] mx-auto flex flex-col h-full min-h-[calc(100vh-100px)]">
          
          {/* Page Header */}
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-8 shrink-0">
            <div>
              <h1 className="text-[24px] font-medium text-claeron-text tracking-tight">Action Items</h1>
              <p className="text-[14px] text-claeron-muted mt-1">
                Tasks and follow-ups extracted from meetings.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 h-10 px-4 bg-white border border-claeron-border rounded-button text-[14px] font-medium text-claeron-text hover:bg-claeron-bg transition-colors shadow-soft">
                <Filter size={16} />
                Filter Tasks
              </button>
            </div>
          </header>

          {/* Page Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-claeron-border shrink-0">
            <div className="relative w-full sm:max-w-md">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-claeron-muted">
                <Search size={16} />
              </div>
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-4 h-10 bg-claeron-bg border border-claeron-border focus:bg-white focus:border-claeron-primary rounded-input text-[14px] placeholder-claeron-muted focus:outline-none transition-all focus:ring-4 focus:ring-claeron-primary/5 text-claeron-text"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
              <button className="flex items-center gap-1.5 h-9 px-3 bg-white border border-claeron-border rounded-lg text-[13px] font-medium text-claeron-text hover:bg-claeron-bg whitespace-nowrap shadow-soft">
                Status <span className="text-claeron-muted ml-1">All</span>
              </button>
              <button className="flex items-center gap-1.5 h-9 px-3 bg-white border border-claeron-border rounded-lg text-[13px] font-medium text-claeron-text hover:bg-claeron-bg whitespace-nowrap shadow-soft">
                Meeting <span className="text-claeron-muted ml-1">All</span>
              </button>
              <button className="flex items-center gap-1.5 h-9 px-3 bg-white border border-claeron-border rounded-lg text-[13px] font-medium text-claeron-text hover:bg-claeron-bg whitespace-nowrap shadow-soft">
                Assigned <span className="text-claeron-muted ml-1">Any</span>
              </button>
            </div>
          </div>

          {/* Main Data Workspace */}
          <main className="flex-1 py-4 flex flex-col min-h-0">
            {loading ? (
              <div className="space-y-4 pt-4">
                <TableSkeleton rows={8} columns={4} />
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
            ) : filteredItems.length === 0 ? (
              /* Empty State */
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-fade-in">
                <div className="w-24 h-24 mb-6 rounded-3xl bg-[#F7F8FB] border border-[#E5E7EB] flex items-center justify-center shadow-inner">
                  <ListTodo size={32} className="text-[#A5A0FF]" />
                </div>
                <h3 className="text-[18px] font-bold text-[#0A1B3D] mb-2">No action items yet</h3>
                <p className="text-[15px] text-neutral-500 max-w-sm">
                  Tasks extracted from meetings will appear here.
                </p>
              </div>
            ) : (
              <div className="flex flex-col h-full animate-fade-in">
                
                {/* Desktop Table View */}
                <div className="hidden md:block flex-1 overflow-auto min-h-0 bg-white border border-claeron-border rounded-card shadow-soft">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-claeron-bg border-b border-claeron-border z-10">
                      <tr>
                        <th className="px-6 py-4 text-[12px] font-medium text-claeron-muted uppercase tracking-wider w-[40%]">Task</th>
                        <th className="px-6 py-4 text-[12px] font-medium text-claeron-muted uppercase tracking-wider w-[20%]">Meeting</th>
                        <th className="px-6 py-4 text-[12px] font-medium text-claeron-muted uppercase tracking-wider">Assigned To</th>
                        <th className="px-6 py-4 text-[12px] font-medium text-claeron-muted uppercase tracking-wider">Due Date</th>
                        <th className="px-6 py-4 text-[12px] font-medium text-claeron-muted uppercase tracking-wider text-center">Status</th>
                        <th className="px-6 py-4 text-[12px] font-medium text-claeron-muted uppercase tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-claeron-divider">
                      {paginatedItems.map((item) => {
                        const statusBadge = getStatusBadge(item.status);
                        const overdue = isOverdue(item.due_date);

                        return (
                          <tr 
                            key={item.id}
                            className="group hover:bg-claeron-bg transition-colors duration-150"
                          >
                            <td className="px-6 py-4 align-top">
                              <div className="flex items-start gap-4">
                                <button className="mt-[2px] text-claeron-muted hover:text-claeron-primary transition-colors shrink-0">
                                  {item.status === 'completed' ? <CheckCircle size={18} className="text-status-success-base" /> : <Circle size={18} />}
                                </button>
                                <div>
                                  <p className={`text-[14px] font-medium text-claeron-text leading-snug ${item.status === 'completed' ? 'line-through opacity-60' : ''}`}>
                                    {item.text}
                                  </p>
                                  {item.decision && (
                                    <span className="inline-block mt-2 px-2 py-0.5 rounded-pill bg-status-info-bg text-[10px] font-medium tracking-widest uppercase text-status-info-text border border-transparent">
                                      Decision Context
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 align-top">
                              <Link 
                                href={`/meetings/${item.meeting_id}`}
                                className="text-[13px] font-medium text-claeron-muted hover:text-claeron-primary transition-colors line-clamp-2"
                              >
                                {item.meeting_name}
                              </Link>
                            </td>
                            <td className="px-6 py-4 align-top">
                              {item.owner ? (
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-claeron-bg text-claeron-text border border-claeron-border flex items-center justify-center font-medium text-[11px]">
                                    {item.owner.charAt(0)}
                                  </div>
                                  <span className="text-[13px] font-medium text-claeron-text">{item.owner}</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 text-claeron-muted">
                                  <div className="w-6 h-6 rounded-full bg-claeron-bg border border-claeron-border flex items-center justify-center">
                                    <User size={12} />
                                  </div>
                                  <span className="text-[13px] font-medium">Unassigned</span>
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 align-top">
                              <div className={`flex items-center gap-2 text-[13px] font-medium ${overdue && item.status !== 'completed' ? 'text-status-error-text' : 'text-claeron-muted'}`}>
                                <Calendar size={16} className={overdue && item.status !== 'completed' ? 'text-status-error-base' : 'text-claeron-muted'} />
                                {new Date(item.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                              </div>
                            </td>
                            <td className="px-6 py-4 align-top text-center">
                              <span className={`inline-flex items-center justify-center min-w-[90px] px-2 py-1 rounded-pill text-[10px] border font-medium uppercase tracking-widest whitespace-nowrap ${statusBadge.color}`}>
                                {statusBadge.label}
                              </span>
                            </td>
                            <td className="px-6 py-4 align-top text-right">
                              <div className="flex items-center justify-end gap-1 text-claeron-muted opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-1.5 hover:text-status-success-base hover:bg-claeron-bg rounded-lg transition-colors" title="Mark Complete">
                                  <CheckCircle size={16} />
                                </button>
                                <button className="p-1.5 hover:text-claeron-primary hover:bg-claeron-bg rounded-lg transition-colors" title="Edit Task">
                                  <Edit2 size={16} />
                                </button>
                                <button className="p-1.5 hover:text-status-error-base hover:bg-claeron-bg rounded-lg transition-colors" title="Delete Task">
                                  <Trash2 size={16} />
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
                  {paginatedItems.map((item) => {
                    const statusBadge = getStatusBadge(item.status);
                    const overdue = isOverdue(item.due_date);
                    
                    return (
                      <div 
                        key={item.id}
                        className="bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-sm"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <button className="mt-0.5 text-neutral-300 hover:text-[#6C63FF] transition-colors shrink-0">
                            {item.status === 'completed' ? <CheckCircle size={20} className="text-emerald-500" /> : <Circle size={20} />}
                          </button>
                          <div className="flex-1">
                            <h3 className={`text-[14px] font-bold text-[#0A1B3D] leading-snug ${item.status === 'completed' ? 'line-through opacity-60' : ''}`}>
                              {item.text}
                            </h3>
                            <Link 
                              href={`/meetings/${item.meeting_id}`}
                              className="inline-block mt-2 text-[12px] font-medium text-neutral-500 hover:text-[#6C63FF] transition-colors"
                            >
                              Source: {item.meeting_name}
                            </Link>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#F1F5F9]">
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-widest">Assignee</span>
                            {item.owner ? (
                              <div className="flex items-center gap-1.5">
                                <div className="w-5 h-5 rounded-full bg-[#6C63FF]/10 text-[#6C63FF] flex items-center justify-center font-bold text-[9px] uppercase">
                                  {item.owner.charAt(0)}
                                </div>
                                <span className="text-[12px] font-bold text-neutral-700 line-clamp-1">{item.owner}</span>
                              </div>
                            ) : (
                              <span className="text-[12px] font-bold text-neutral-400">Unassigned</span>
                            )}
                          </div>
                          
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-widest">Due Date</span>
                            <span className={`text-[12px] font-bold ${overdue && item.status !== 'completed' ? 'text-red-600' : 'text-neutral-700'}`}>
                              {new Date(item.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#F1F5F9]">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] border font-bold uppercase tracking-wider ${statusBadge.color}`}>
                            {statusBadge.label}
                          </span>
                          <div className="flex items-center gap-1">
                            <button className="p-1.5 text-neutral-400 hover:text-[#6C63FF] rounded-lg transition-colors"><Edit2 size={16} /></button>
                            <button className="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg transition-colors"><Trash2 size={16} /></button>
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
                      Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredItems.length)} of {filteredItems.length}
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
  );
}
