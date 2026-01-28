'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface SearchResult {
    id: number;
    type: 'meeting' | 'action-item' | 'transcript';
    title: string;
    description?: string;
    date?: string;
    href: string;
}

export default function SearchBar() {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Keyboard shortcut (Cmd/Ctrl + K)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                inputRef.current?.focus();
                setIsOpen(true);
            }
            // Escape to close
            if (e.key === 'Escape') {
                setIsOpen(false);
                inputRef.current?.blur();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Debounced search
    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        setLoading(true);
        const timer = setTimeout(async () => {
            try {
                // TODO: Replace with actual API call
                // const response = await apiService.search(query);
                // setResults(response.results);

                // Mock results for now
                const mockResults: SearchResult[] = [
                    {
                        id: 1,
                        type: 'meeting',
                        title: 'Team Standup - Jan 25',
                        description: 'Daily sync with engineering team',
                        date: '2026-01-25',
                        href: '/meetings/1',
                    },
                    {
                        id: 2,
                        type: 'action-item',
                        title: 'Review Q1 roadmap',
                        description: 'From Product Planning Meeting',
                        href: '/action-items',
                    },
                ].filter(r => r.title.toLowerCase().includes(query.toLowerCase()));

                setResults(mockResults);
            } catch (err) {
                console.error('Search error:', err);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    const handleResultClick = (href: string) => {
        router.push(href);
        setIsOpen(false);
        setQuery('');
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'meeting':
                return (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                );
            case 'action-item':
                return (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                );
        }
    };

    return (
        <div className="relative flex-1 max-w-2xl" ref={dropdownRef}>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search meetings, action items... (⌘K)"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-neutral-300 rounded-lg text-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
                {loading && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-500 border-t-transparent" />
                    </div>
                )}
            </div>

            {/* Results Dropdown */}
            {isOpen && (query.trim() || results.length > 0) && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-xl border border-neutral-200 max-h-96 overflow-y-auto z-50">
                    {results.length === 0 && !loading && query.trim() && (
                        <div className="p-4 text-center text-sm text-neutral-500">
                            No results found for "{query}"
                        </div>
                    )}

                    {results.length > 0 && (
                        <div className="py-2">
                            {results.map((result) => (
                                <button
                                    key={`${result.type}-${result.id}`}
                                    onClick={() => handleResultClick(result.href)}
                                    className="w-full px-4 py-3 hover:bg-neutral-50 transition-colors text-left flex items-start gap-3 group"
                                >
                                    <div className="mt-0.5 text-neutral-400 group-hover:text-primary-600 transition-colors">
                                        {getTypeIcon(result.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-neutral-900 truncate">
                                                {result.title}
                                            </span>
                                            <span className="text-xs px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded-full capitalize flex-shrink-0">
                                                {result.type.replace('-', ' ')}
                                            </span>
                                        </div>
                                        {result.description && (
                                            <p className="text-xs text-neutral-500 mt-1 truncate">
                                                {result.description}
                                            </p>
                                        )}
                                        {result.date && (
                                            <p className="text-xs text-neutral-400 mt-1">
                                                {new Date(result.date).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {results.length > 0 && (
                        <div className="border-t border-neutral-100 px-4 py-2">
                            <button className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                                See all results →
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
