'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ActionItem {
    id: string;
    label: string;
    description: string;
    icon: React.ReactNode;
    href: string;
    isComingSoon?: boolean;
}

const actions: ActionItem[] = [
    {
        id: 'record',
        label: 'Record Meeting',
        description: 'Start recording now',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
        ),
        href: '/record',
    },
    {
        id: 'upload',
        label: 'Upload Recording',
        description: 'Upload audio or video file',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
        ),
        href: '/uploads',
    },
    {
        id: 'schedule',
        label: 'Schedule Meeting',
        description: 'Plan a future meeting',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        ),
        href: '#',
        isComingSoon: true,
    },
    {
        id: 'join',
        label: 'Join Live Meeting',
        description: 'Connect to ongoing meeting',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
        ),
        href: '#',
        isComingSoon: true,
    },
];

export default function ActionDropdown() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    // Keyboard navigation
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    const handleActionClick = (href: string) => {
        setIsOpen(false);
        if (href !== '#') {
            router.push(href);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white rounded-lg font-medium text-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all shadow-sm hover:shadow-md"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Summarize Meeting
                <svg
                    className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full mt-2 right-0 w-80 bg-white rounded-lg shadow-xl border border-neutral-200 py-2 z-50 animate-fade-in">
                    {actions.map((action, index) => (
                        <React.Fragment key={action.id}>
                            <button
                                onClick={() => handleActionClick(action.href)}
                                className="w-full px-4 py-3 hover:bg-neutral-50 transition-colors text-left flex items-start gap-3 group"
                            >
                                <div className="mt-0.5 text-neutral-400 group-hover:text-primary-600 transition-colors">
                                    {action.icon}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <div className={`text-sm font-medium transition-colors ${action.isComingSoon ? 'text-neutral-400' : 'text-neutral-900 group-hover:text-primary-600'}`}>
                                            {action.label}
                                        </div>
                                        {action.isComingSoon && (
                                            <span className="px-1.5 py-0.5 bg-neutral-100 text-[10px] font-bold text-neutral-500 rounded uppercase tracking-wider leading-none">
                                                Coming Soon
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-xs text-neutral-500 mt-0.5">
                                        {action.description}
                                    </div>
                                </div>
                                {!action.isComingSoon && (
                                    <svg className="w-4 h-4 text-neutral-300 group-hover:text-primary-600 transition-colors mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                )}
                            </button>
                            {index < actions.length - 1 && (
                                <div className="mx-4 border-t border-neutral-100" />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            )}
        </div>
    );
}
