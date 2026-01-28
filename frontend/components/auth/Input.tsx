'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    helperText?: string;
}

export default function Input({
    label,
    error,
    helperText,
    className = '',
    ...props
}: InputProps) {
    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-0.5">
                {label}
            </label>
            <input
                className={`
          block w-full py-2.5 px-3 text-sm bg-white border rounded-md shadow-sm transition-all duration-200
          placeholder:text-gray-400 focus:outline-none focus:ring-2
          ${error
                        ? 'border-red-300 text-red-900 focus:ring-red-100 placeholder:text-red-300'
                        : 'border-gray-300 text-gray-900 focus:ring-indigo-100 focus:border-indigo-500'
                    }
          ${className}
        `}
                {...props}
            />
            {error && (
                <p className="mt-1.5 text-xs text-red-600 font-normal ml-0.5">
                    {error}
                </p>
            )}
            {!error && helperText && (
                <p className="mt-1.5 text-xs text-gray-500 font-normal ml-0.5">
                    {helperText}
                </p>
            )}
        </div>
    );
}
