import React from 'react';

// =============================================================================
// Skeleton Components
// =============================================================================

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return <div className={`skeleton rounded ${className}`} />;
}

// =============================================================================
// Table Skeleton
// =============================================================================

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export function TableSkeleton({ rows = 5, columns = 4 }: TableSkeletonProps) {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="flex gap-4 py-3 border-b border-neutral-200">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="flex-1">
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 py-4 border-b border-neutral-100">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={colIndex} className="flex-1">
              <Skeleton className="h-4 w-full max-w-[120px]" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// =============================================================================
// Card Skeleton
// =============================================================================

interface CardSkeletonProps {
  lines?: number;
}

export function CardSkeleton({ lines = 3 }: CardSkeletonProps) {
  return (
    <div className="card p-6 animate-pulse">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-4 mb-3 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`}
        />
      ))}
    </div>
  );
}

// =============================================================================
// Meeting Detail Skeleton
// =============================================================================

export function MeetingDetailSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-neutral-200 pb-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-20" />
        ))}
      </div>

      {/* Content */}
      <div className="grid gap-4">
        <Skeleton className="h-24 w-full" />
        <div className="flex gap-4">
          <Skeleton className="h-16 flex-1" />
          <Skeleton className="h-16 flex-1" />
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Dashboard Skeleton
// =============================================================================

export function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="card p-6">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card p-6">
        <Skeleton className="h-5 w-40 mb-4" />
        <TableSkeleton rows={5} columns={5} />
      </div>
    </div>
  );
}

// =============================================================================
// Transcript Skeleton
// =============================================================================

export function TranscriptSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="flex gap-2 items-center">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default {
  Skeleton,
  TableSkeleton,
  CardSkeleton,
  MeetingDetailSkeleton,
  DashboardSkeleton,
  TranscriptSkeleton,
};
