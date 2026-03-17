'use client';

import { useQuery } from '@tanstack/react-query';
import { Table, Column } from '../../../components/Table';
import { DashboardSkeleton } from '../../../components/Skeletons';
import { StatusBadge, Button } from '../../../components/ui';
import { useAuth } from '../../../components/auth/AuthContext';
import { apiService } from '../../../services/api';
import { Meeting, ExtractionRead } from '../../../types/api';
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
  const { user } = useAuth();
  
  const { data: meetings = [], isLoading: meetingsLoading } = useQuery({
    queryKey: ['meetings'],
    queryFn: () => apiService.getMeetings(),
  });

  const { data: extractions = [], isLoading: extractionsLoading } = useQuery({
    queryKey: ['extractions', 'all'],
    queryFn: () => apiService.getAllExtractions(),
  });

  const loading = meetingsLoading || extractionsLoading;

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
          <div className="w-8 h-8 rounded-[10px] border border-eden-border bg-eden-bg flex items-center justify-center text-eden-muted shrink-0 shadow-soft">
             <Calendar size={14} />
          </div>
          <div className="flex flex-col min-w-0">
            <Link href={`/meetings/${item.id}`} className="font-medium text-eden-text text-[14px] hover:text-eden-primary transition-colors truncate">
              {val}
            </Link>
            <span className="text-[13px] text-eden-muted truncate max-w-[280px]">
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
        if (!dateStr) return <span className="text-[13px] text-eden-muted">N/A</span>;
        const d = new Date(dateStr);
        return (
          <div className="flex flex-col gap-0.5">
            <span className="text-[14px] font-medium text-eden-text">{d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            <span className="text-[13px] text-eden-muted">{d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}</span>
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
          className="p-1.5 text-eden-muted hover:text-eden-primary hover:bg-eden-bg rounded-lg transition-all inline-block"
        >
          <ArrowRight size={16} />
        </Link>
      ),
    },
  ];

  if (loading && meetings.length === 0) {
    return <DashboardSkeleton />;
  }

  const allTasks = extractions.flatMap(ex => (ex.items || []).map(item => ({ 
    ...item, 
    meeting_title: ex.meeting_id,
    completed: Math.random() > 0.8 // Simulated status for demo
  })));
  const pendingTasks = allTasks.filter(t => !t.completed).slice(0, 8);

  return (
    <div className="max-w-[1100px] mx-auto space-y-10 pb-16">
      
      {/* Dashboard Header - Minimalist */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-4 md:pt-8 bg-transparent pb-6 border-b border-transparent">
        <div>
          <h1 className="text-[24px] font-medium text-eden-text tracking-tight">
            Good {getTimeOfDay()} {user?.display_name?.split(' ')[0] || ''} <span className="text-[20px] ml-1">👋</span>
          </h1>
          <p className="text-[15px] text-eden-muted mt-2 leading-relaxed">
            Here's your meeting intelligence overview today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/record">
            <Button variant="secondary" className="h-10 px-4 text-[14px] font-medium border-eden-border bg-white text-eden-text hover:bg-eden-bg rounded-button shadow-soft transition-shadow hover:shadow-hover-soft">
              <Mic size={16} className="mr-2 text-status-error-base" />
              Record Live
            </Button>
          </Link>
          <Link href="/uploads">
            <Button className="h-10 px-4 text-[14px] font-medium bg-eden-primary text-white rounded-button shadow-soft hover:shadow-hover-soft hover:bg-eden-indigo transition-all">
              <Upload size={16} className="mr-2" />
              Upload
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 xl:gap-10 items-start">
        
        {/* Main Column: Recent Meetings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[16px] font-medium text-eden-text flex items-center gap-2">
              <Clock size={16} className="text-eden-muted" />
              Recent Activity
            </h3>
            <Link href="/meetings" className="text-[13px] font-medium text-eden-primary hover:text-eden-indigo flex items-center gap-1 group">
              View all
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
          
          <div className="bg-white rounded-card border border-eden-border overflow-hidden shadow-soft">
            <Table
              columns={columns}
              data={meetings.slice(0, 10)}
              emptyMessage={
                <div className="py-16 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 bg-eden-bg rounded-full flex items-center justify-center mb-4 border border-eden-border">
                    <Inbox size={20} className="text-eden-muted" />
                  </div>
                  <p className="text-[15px] font-medium text-eden-text">No meetings yet</p>
                  <p className="text-[14px] text-eden-muted mt-1 max-w-[280px]">Upload a recording or start a live meeting to generate insights.</p>
                </div>
              }
            />
          </div>
        </div>

        {/* Side Column: Action Items Panel */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[16px] font-medium text-eden-text flex items-center gap-2">
              <CheckCircle2 size={16} className="text-eden-muted" />
              Your Tasks
            </h3>
            <Link href="/action-items" className="text-[13px] font-medium text-eden-primary hover:text-eden-indigo">
              Manage
            </Link>
          </div>
          
          <div className="bg-white rounded-card border border-eden-border shadow-soft overflow-hidden">
            <div className="divide-y divide-eden-divider">
              {pendingTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                  <CircleDashed size={24} className="text-eden-muted mb-3" />
                  <p className="text-[15px] font-medium text-eden-text">You're all caught up</p>
                  <p className="text-[14px] text-eden-muted mt-1 leading-relaxed">Tasks assigned to you will appear here.</p>
                </div>
              ) : (
                pendingTasks.map((item, idx) => (
                  <div key={idx} className="group p-5 hover:bg-eden-bg transition-colors duration-150 cursor-default">
                    <div className="flex items-start gap-4">
                      <input 
                        type="checkbox" 
                        className="mt-1 flex-shrink-0 w-[18px] h-[18px] rounded-[4px] border-eden-border text-eden-primary focus:ring-eden-primary focus:ring-offset-0 cursor-pointer transition-colors" 
                      />
                      <div className="flex-1 min-w-0 pt-0.5">
                        <p className="text-[14px] text-eden-text leading-snug font-medium transition-colors">{item.text}</p>
                        <div className="flex items-center justify-between mt-3">
                          <span className={`text-[11px] px-2 py-0.5 rounded pill font-medium uppercase tracking-widest ${item.decision ? 'bg-status-info-bg text-status-info-text border-white' : 'bg-eden-bg text-eden-muted'}`}>
                            {item.decision ? 'Decision' : 'Task'}
                          </span>
                          <span className="text-[12px] text-eden-muted truncate max-w-[140px]">
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
  );
}
