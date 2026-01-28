'use client';

import React from 'react';

// =============================================================================
// Input Component - Reusable across the app
// =============================================================================

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

export function Input({
    label,
    error,
    helperText,
    className = '',
    id,
    ...props
}: InputProps) {
    const inputId = id || `input-${Math.random().toString(36).slice(2)}`;

    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-sm font-medium text-neutral-700 mb-1.5"
                >
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    id={inputId}
                    className={`
            block w-full px-3 py-2 text-sm bg-white border rounded-lg shadow-sm transition-all duration-200
            placeholder:text-neutral-400 focus:outline-none focus:ring-2
            ${error
                            ? 'border-error-300 text-error-900 focus:ring-error-100 placeholder:text-error-300'
                            : 'border-neutral-300 text-neutral-900 focus:ring-primary-100 focus:border-primary-500'
                        }
            disabled:bg-neutral-50 disabled:text-neutral-500 disabled:cursor-not-allowed
            ${className}
          `}
                    {...props}
                />
            </div>
            {(error || helperText) && (
                <p
                    className={`mt-1.5 text-xs ${error ? 'text-error-600' : 'text-neutral-500'
                        }`}
                >
                    {error || helperText}
                </p>
            )}
        </div>
    );
}

export default Input;
