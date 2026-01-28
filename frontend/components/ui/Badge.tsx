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
    success: 'bg-success-100 text-success-700',
    warning: 'bg-warning-100 text-warning-700',
    error: 'bg-error-100 text-error-700',
    neutral: 'bg-neutral-100 text-neutral-700',
    primary: 'bg-primary-100 text-primary-700',
};

export function Badge({ children, variant = 'neutral', className = '' }: BadgeProps) {
    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantStyles[variant]} ${className}`}
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
