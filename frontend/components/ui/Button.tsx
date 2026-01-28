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
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg";

    const sizeStyles = {
        sm: "px-3 py-1.5 text-[11px] h-8 gap-1.5",
        md: "px-4 py-2 text-xs h-10 gap-2",
        lg: "px-6 py-2.5 text-sm h-11 gap-2.5",
    };

    const variants = {
        primary: "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-sm border border-primary-700/10",
        secondary: "bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 focus:ring-neutral-100 shadow-xs",
        danger: "bg-error-500 text-white hover:bg-error-600 focus:ring-error-400 shadow-sm border border-error-600/10",
        ghost: "bg-transparent text-neutral-600 hover:bg-neutral-100 focus:ring-neutral-200 hover:text-neutral-900",
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
