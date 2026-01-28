'use client';

import React from 'react';

// =============================================================================
// Toggle Component
// =============================================================================

interface ToggleProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    description?: string;
    disabled?: boolean;
    id?: string;
}

export function Toggle({
    checked,
    onChange,
    label,
    description,
    disabled = false,
    id,
}: ToggleProps) {
    const toggleId = id || `toggle-${Math.random().toString(36).slice(2)}`;

    return (
        <div className="flex items-start">
            <button
                id={toggleId}
                type="button"
                role="switch"
                aria-checked={checked}
                disabled={disabled}
                onClick={() => onChange(!checked)}
                className={`
          relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
          transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
          ${checked ? 'bg-primary-600' : 'bg-neutral-200'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
            >
                <span
                    className={`
            pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
            transition duration-200 ease-in-out
            ${checked ? 'translate-x-5' : 'translate-x-0'}
          `}
                />
            </button>
            {(label || description) && (
                <div className="ml-3">
                    {label && (
                        <label
                            htmlFor={toggleId}
                            className={`text-sm font-medium ${disabled ? 'text-neutral-400' : 'text-neutral-900'
                                }`}
                        >
                            {label}
                        </label>
                    )}
                    {description && (
                        <p className="text-sm text-neutral-500">{description}</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default Toggle;
