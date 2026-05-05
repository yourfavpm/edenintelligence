'use client';

import React from 'react';

// =============================================================================
// Badge Component - Status indicators
// =============================================================================

type BadgeVariant = 'success' | 'warning' | 'error' | 'neutral' | 'primary';

interface BadgeProps {
    children: React.ReactNode;
    variant?: BadgeVariant;
    className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
    success: 'bg-status-success-bg text-status-success-text',
    warning: 'bg-status-warning-bg text-status-warning-text',
    error: 'bg-status-error-bg text-status-error-text',
    neutral: 'bg-claeron-bg text-claeron-muted',
    primary: 'bg-status-info-bg text-status-info-text',
};

export function Badge({ children, variant = 'neutral', className = '' }: BadgeProps) {
    return (
        <span
            className={`inline-flex items-center justify-center px-2 py-1 rounded-pill text-[11px] font-medium uppercase tracking-widest min-w-[90px] ${variantStyles[variant]} ${className}`}
        >
            {children}
        </span>
    );
}

// =============================================================================
// Processing Status Badge
// =============================================================================

type ProcessingStatus = 'uploaded' | 'processing' | 'processed' | 'failed';

interface StatusBadgeProps {
    status: ProcessingStatus | string;
    className?: string;
}

const statusConfig: Record<string, { variant: BadgeVariant; label: string }> = {
    uploaded: { variant: 'neutral', label: 'Uploaded' },
    processing: { variant: 'warning', label: 'Processing' },
    processed: { variant: 'success', label: 'Completed' },
    completed: { variant: 'success', label: 'Completed' },
    failed: { variant: 'error', label: 'Failed' },
    pending: { variant: 'warning', label: 'Pending' },
};

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
    const config = statusConfig[status.toLowerCase()] || {
        variant: 'neutral' as BadgeVariant,
        label: status,
    };

    return (
        <Badge variant={config.variant} className={className}>
            {config.label}
        </Badge>
    );
}

export default Badge;
