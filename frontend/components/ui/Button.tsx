'use client';

import React from 'react';

// =============================================================================
// Button Component - Reusable across the app
// =============================================================================

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    block?: boolean;
}

export function Button({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    block = false,
    className = '',
    disabled,
    ...props
}: ButtonProps) {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed rounded-button";

    const sizeStyles = {
        sm: "px-3 py-1.5 text-[13px] h-9 gap-1.5",
        md: "px-4 py-2 text-[14px] h-10 gap-2",
        lg: "px-6 py-2.5 text-[15px] h-12 gap-2.5",
    };

    const variants = {
        primary: "bg-eden-primary text-white hover:bg-eden-indigo focus:ring-eden-primary/20 shadow-soft hover:shadow-hover-soft border border-transparent",
        secondary: "bg-white border border-eden-border text-eden-text hover:bg-eden-bg focus:ring-eden-primary/10 shadow-soft hover:shadow-hover-soft",
        danger: "bg-status-error-base text-white hover:opacity-90 focus:ring-status-error-base/20 shadow-soft hover:shadow-hover-soft border border-transparent",
        ghost: "bg-transparent text-eden-muted hover:bg-eden-bg focus:ring-transparent hover:text-eden-text border border-transparent",
    };

    const widthStyle = block ? 'w-full' : '';

    return (
        <button
            className={`${baseStyles} ${sizeStyles[size]} ${variants[variant]} ${widthStyle} ${className}`}
            disabled={loading || disabled}
            {...props}
        >
            {loading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
            )}
            <span className={loading ? 'opacity-80' : 'opacity-100'}>
                {children}
            </span>
        </button>
    );
}

export default Button;
