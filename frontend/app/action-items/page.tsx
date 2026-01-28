'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Layout from '../../components/Layout';
import ProtectedRoute from '../../components/ProtectedRoute';
import { Table, Column } from '../../components/Table';
import { TableSkeleton } from '../../components/Skeletons';
import { Input, Button } from '../../components/ui';
import { apiService } from '../../services/api';
import { ExtractionRead } from '../../types/api';
import Link from 'next/link';

// =============================================================================
// Action Items Page (Aggregated View)
// =============================================================================

export default function ActionItemsPage() {
    const [extractions, setExtractions] = useState<ExtractionRead[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchExtractions = async () => {
            setLoading(true);
            try {
                const data = await apiService.getAllExtractions();
                setExtractions(data);
            } catch (err: any) {
                console.error(err);
                setError('Failed to load action items.');
            } finally {
                setLoading(false);
            }
        };

        fetchExtractions();
    }, []);

    // Flatten extractions into individual items for the table
    const flattenedItems = useMemo(() => {
        return extractions.flatMap(ex => (ex.items || []).map(item => ({
            ...item,
            meeting_id: ex.meeting_id,
            id: `${ex.id}-${item.text.substring(0, 10)}` // Unique key
        })));
    }, [extractions]);

    // Filter logic
    const filteredItems = useMemo(() => {
        return flattenedItems.filter((item) =>
            item.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.owner?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [flattenedItems, searchQuery]);

    const columns: Column<any>[] = [
        {
            key: 'text',
            label: 'Task Details',
            render: (val) => (
                <div className="flex gap-3 max-w-xl">
                    <div className="mt-1 w-4 h-4 rounded-full border-2 border-primary-400 flex-shrink-0" />
                    <span className="text-neutral-800 font-medium leading-relaxed">{val}</span>
                </div>
            ),
        },
        {
            key: 'decision',
            label: 'Type',
            render: (val) => (
                <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider ${val ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-neutral-100 text-neutral-500 border border-neutral-200'}`}>
                    {val ? 'Decision' : 'Action Item'}
                </span>
            ),
        },
        {
            key: 'owner',
            label: 'Owner',
            render: (val) => val || <span className="text-neutral-400 italic">Unassigned</span>,
        },
        {
            key: 'meeting_id',
            label: 'Meeting',
            render: (val) => (
                <Link
                    href={`/meetings/${val}`}
                    className="text-primary-600 hover:text-primary-700 font-medium text-xs flex items-center gap-1"
                >
                    View Meeting
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
            ),
        },
    ];

    return (
        <ProtectedRoute>
            <Layout>
                <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-neutral-100">
                        <div>
                            <h1 className="text-3xl font-bold text-neutral-900">Action Items</h1>
                            <p className="text-neutral-500 font-medium">All tasks and follow-ups extracted from your meetings.</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-72">
                                <Input
                                    placeholder="Filter by keyword, owner, or category..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="!py-1.5"
                                />
                            </div>
                            <Button variant="secondary">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Export CSV
                            </Button>
                        </div>
                    </div>

                    {/* Quick Filters Placeholder */}
                    <div className="flex gap-2">
                        {['All Items', 'High Priority', 'General', 'Legal', 'Product'].map((tag) => (
                            <button
                                key={tag}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide border transition-all ${tag === 'All Items'
                                    ? 'bg-primary-600 border-primary-600 text-white shadow-sm'
                                    : 'bg-white border-neutral-200 text-neutral-500 hover:border-neutral-300'
                                    }`}
                            >
                                {tag.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    {/* Table Area */}
                    <div className="space-y-4">
                        {loading ? (
                            <div className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-sm">
                                <TableSkeleton rows={10} columns={4} />
                            </div>
                        ) : error ? (
                            <div className="p-12 text-center bg-error-50 rounded-2xl border border-error-100">
                                <p className="text-error-600 font-bold">{error}</p>
                                <Button variant="secondary" size="sm" className="mt-4" onClick={() => window.location.reload()}>
                                    Try Again
                                </Button>
                            </div>
                        ) : (
                            <Table
                                columns={columns}
                                data={filteredItems}
                                emptyMessage={searchQuery ? "No action items match your filters." : "No action items have been extracted yet."}
                            />
                        )}
                    </div>
                </div>
            </Layout>
        </ProtectedRoute>
    );
}
