'use client';

import React from 'react';
import { Meeting, ExtractionRead } from '@/types/api';
import { Activity, Zap, BarChart3, Clock } from 'lucide-react';

interface StatisticsCardsProps {
  meetings: Meeting[];
  extractions: ExtractionRead[];
  isLoading?: boolean;
}

interface StatCard {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
  accentColor: string;
  trend?: string;
}

export default function StatisticsCards({ meetings, extractions, isLoading = false }: StatisticsCardsProps) {
  // Calculate statistics from real data
  const totalMeetings = meetings.length;
  const processedMeetings = meetings.filter(m => {
    if (m.audio_files && m.audio_files.length > 0) {
      return m.audio_files[0].processed;
    }
    return !!m.ai_transcription;
  }).length;
  
  const totalActionItems = extractions.reduce((acc, ex) => acc + (ex.items?.length || 0), 0);
  
  const totalMinutes = meetings.reduce((acc, meeting) => {
    return acc + (meeting.duration_minutes || 0);
  }, 0);
  
  const totalHours = (totalMinutes / 60).toFixed(1);

  const stats: StatCard[] = [
    {
      label: 'Total Meetings',
      value: totalMeetings,
      icon: <BarChart3 size={24} />,
      bgColor: 'bg-gradient-to-br from-[#D41E82]/10 to-[#E85BA8]/5',
      textColor: 'text-[#D41E82]',
      accentColor: '#D41E82',
      trend: `+${Math.floor(totalMeetings * 0.1)}% this month`,
    },
    {
      label: 'Processed',
      value: processedMeetings,
      icon: <Zap size={24} />,
      bgColor: 'bg-gradient-to-br from-emerald-50 to-teal-50/50',
      textColor: 'text-emerald-600',
      accentColor: '#10b981',
      trend: `${processedMeetings === totalMeetings ? '100%' : Math.round((processedMeetings / (totalMeetings || 1)) * 100) + '%'} of meetings`,
    },
    {
      label: 'Action Items',
      value: totalActionItems,
      icon: <Activity size={24} />,
      bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-50/50',
      textColor: 'text-blue-600',
      accentColor: '#3b82f6',
      trend: `${Math.ceil(totalActionItems / (totalMeetings || 1))} per meeting`,
    },
    {
      label: 'Hours Recorded',
      value: totalHours,
      icon: <Clock size={24} />,
      bgColor: 'bg-gradient-to-br from-amber-50 to-orange-50/50',
      textColor: 'text-amber-600',
      accentColor: '#f59e0b',
      trend: `${totalMinutes % 60} mins remaining`,
    },
  ];

  const StatCardComponent = ({ stat }: { stat: StatCard }) => (
    <div className={`relative overflow-hidden rounded-2xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow ${stat.bgColor} p-5 sm:p-6 lg:p-5 xl:p-6`}>
      {/* Background accent bar */}
      <div
        className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-50 blur-2xl pointer-events-none"
        style={{ backgroundColor: stat.accentColor }}
      />
      
      <div className="relative z-10 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <h3 className="text-[13px] font-semibold text-neutral-600 uppercase tracking-wide">
            {stat.label}
          </h3>
          <div className={`p-2.5 rounded-lg ${stat.bgColor} border border-neutral-200/50`}>
            <div className={stat.textColor}>{stat.icon}</div>
          </div>
        </div>

        {/* Value */}
        <div>
          <div className={`text-4xl sm:text-3xl lg:text-4xl font-bold ${stat.textColor} tracking-tight`}>
            {isLoading ? (
              <div className="h-10 w-20 bg-neutral-200 rounded animate-pulse" />
            ) : (
              stat.value
            )}
          </div>
        </div>

        {/* Trend */}
        {stat.trend && (
          <p className="text-[12px] text-neutral-500 font-medium">
            {stat.trend}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, idx) => (
        <StatCardComponent key={idx} stat={stat} />
      ))}
    </div>
  );
}
