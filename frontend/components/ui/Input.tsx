'use client';

import React from 'react';

// =============================================================================
// Input Component - Reusable across the app
// =============================================================================

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    rightElement?: React.ReactNode;
}

export function Input({
    label,
    error,
    helperText,
    rightElement,
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
                    className="block text-[14px] font-medium text-[#1F2937] mb-2"
                >
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    id={inputId}
                    className={`
            block w-full h-[44px] px-4 text-[15px] bg-white border border-[#E5E7EB] rounded-[10px] shadow-sm transition-all duration-200
            placeholder:text-neutral-400 focus:outline-none focus:ring-4
            ${rightElement ? 'pr-10' : ''}
            ${error
                            ? 'border-error-300 text-error-900 focus:ring-error-100 placeholder:text-error-300'
                            : 'text-neutral-900 focus:ring-[#D41E82]/20 focus:border-[#D41E82]'
                        }
            disabled:bg-neutral-50 disabled:text-neutral-500 disabled:cursor-not-allowed
            ${className}
          `}
                    {...props}
                />
                {rightElement && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        {rightElement}
                    </div>
                )}
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
