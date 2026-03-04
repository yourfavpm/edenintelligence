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
// Action Items Aggregator - High-Density Enterprise Redesign
// =============================================================================

export default function ActionItemsPage() {
    const [extractions, setExtractions] = useState<ExtractionRead[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('ALL');

    useEffect(() => {
        const fetchExtractions = async () => {
            setLoading(true);
            try {
                const data = await apiService.getAllExtractions();
                setExtractions(data);
            } catch (err: any) {
                console.error(err);
                setError('Failed to synchronize task index.');
            } finally {
                setLoading(false);
            }
        };
        fetchExtractions();
    }, []);

    const flattenedItems = useMemo(() => {
        return extractions.flatMap(ex => (ex.items || []).map(item => ({
            ...item,
            meeting_id: ex.meeting_id,
            id: `${ex.id}-${item.text.substring(0, 10)}`
        })));
    }, [extractions]);

    const filteredItems = useMemo(() => {
        return flattenedItems.filter((item) => {
            const matchesSearch = item.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
                               item.owner?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesFilter = activeFilter === 'ALL' || 
                               (activeFilter === 'DECISIONS' && item.decision) || 
                               (activeFilter === 'TASKS' && !item.decision);
            return matchesSearch && matchesFilter;
        });
    }, [flattenedItems, searchQuery, activeFilter]);

    const columns: Column<any>[] = [
        {
            key: 'text',
            label: 'Task Definition',
            render: (val, row) => (
                <div className="flex gap-2.5 max-w-2xl py-0.5">
                    <div className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${row.decision ? 'bg-indigo-500' : 'bg-emerald-500'}`} />
                    <span className="text-[13px] font-medium text-neutral-800 leading-normal">{val}</span>
                </div>
            ),
        },
        {
            key: 'decision',
            label: 'Classification',
            render: (val) => (
                <span className={`text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border ${val ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'}`}>
                    {val ? 'Decision' : 'Task'}
                </span>
            ),
        },
        {
            key: 'owner',
            label: 'Owner',
            render: (val) => val ? (
                <span className="text-[12px] font-bold text-neutral-700">{val}</span>
            ) : (
                <span className="text-[11px] text-neutral-400 font-medium">Unassigned</span>
            ),
        },
        {
            key: 'meeting_id',
            label: 'Context',
            render: (val) => (
                <Link href={`/meetings/${val}`} className="group flex items-center gap-1.5 text-[11px] font-bold text-neutral-400 hover:text-[#4F46E5] transition-colors uppercase tracking-wider">
                    Source
                    <svg className="w-3 h-3 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </Link>
            ),
        },
    ];

    return (
        <ProtectedRoute>
            <Layout>
                <div className="max-w-[1400px] mx-auto space-y-6 animate-fade-in py-2">
                    {/* Compact Header */}
                    <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-6">
                        <div className="space-y-1">
                            <h1 className="text-[20px] font-bold text-neutral-900 tracking-tight">Intelligence Hub</h1>
                            <p className="text-[12px] text-neutral-500 font-medium">Aggregated decisions and action items across all workspaces.</p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-64">
                                <Input
                                    placeholder="Filter by keyword or owner..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="!h-9 !text-[12px] bg-[#F8FAFC]"
                                />
                            </div>
                            <Button className="h-9 px-4 bg-white border border-[#E5E7EB] text-neutral-700 hover:bg-neutral-50 shadow-sm text-[11px] font-bold uppercase tracking-wider">
                                Export Data
                            </Button>
                        </div>
                    </div>

                    {/* Filter Strip */}
                    <div className="flex gap-1 bg-[#F1F5F9] p-1 rounded-lg w-fit">
                        {[
                            { id: 'ALL', label: 'All Items' },
                            { id: 'TASKS', label: 'Tasks Only' },
                            { id: 'DECISIONS', label: 'Decisions Only' },
                        ].map((filter) => (
                            <button
                                key={filter.id}
                                onClick={() => setActiveFilter(filter.id)}
                                className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${
                                    activeFilter === filter.id
                                        ? 'bg-white text-neutral-900 shadow-sm'
                                        : 'text-neutral-500 hover:text-neutral-700'
                                }`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>

                    {/* Table Area */}
                    <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden">
                        {loading ? (
                            <div className="p-8">
                                <TableSkeleton rows={12} columns={4} />
                            </div>
                        ) : error ? (
                            <div className="p-16 text-center">
                                <p className="text-red-600 text-[13px] font-bold">{error}</p>
                                <Button variant="secondary" size="sm" className="mt-4" onClick={() => window.location.reload()}>
                                    Reconnect
                                </Button>
                            </div>
                        ) : (
                            <Table
                                columns={columns}
                                data={filteredItems}
                                emptyMessage={searchQuery ? "No intelligence units match current filters." : "No action items have been indexed."}
                            />
                        )}
                    </div>
                </div>
            </Layout>
        </ProtectedRoute>
    );
}
