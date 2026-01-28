'use client';

import React from 'react';
import { MeetingDetail } from '../../types/api';

// =============================================================================
// Action Items Tab Component
// =============================================================================

interface ActionItemsTabProps {
    meeting: MeetingDetail;
}

export default function ActionItemsTab({ meeting }: ActionItemsTabProps) {
    const extractions = meeting.extractions || [];

    // Flatten nested items from all extraction records
    const allItems = React.useMemo(() => {
        return extractions.flatMap(ex => (ex.items || []).map(item => ({
            ...item,
            id: `${ex.id}-${item.text.substring(0, 10)}`
        })));
    }, [extractions]);

    if (allItems.length === 0) {
        return (
            <div className="py-12 text-center text-neutral-500">
                <svg className="w-12 h-12 mx-auto mb-4 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <p className="text-lg font-medium">No action items found.</p>
                <p className="text-sm">The AI will extract tasks and follow-ups once processing is complete.</p>
            </div>
        );
    }

    return (
        <div className="py-6 space-y-6 animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                <h3 className="text-lg font-bold text-neutral-900">Extracted Action Items</h3>
                <button className="text-xs font-bold uppercase tracking-widest text-primary-600 hover:text-primary-700">
                    Sync with CRM
                </button>
            </div>

            <div className="space-y-4">
                {allItems.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-start gap-4 p-5 bg-neutral-50 border border-neutral-100 rounded-2xl hover:border-primary-200 transition-all hover:shadow-sm group"
                    >
                        <div className="mt-1">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 group-hover:bg-opacity-50 transition-colors cursor-pointer ${item.decision ? 'border-indigo-500 hover:bg-indigo-50' : 'border-primary-500 hover:bg-primary-50'}`}>
                                {/* Mock checkbox */}
                            </div>
                        </div>

                        <div className="flex-1 space-y-2">
                            <p className="text-[15px] text-neutral-800 leading-relaxed font-medium">
                                {item.text}
                            </p>

                            <div className="flex flex-wrap items-center gap-4">
                                <div className={`flex items-center gap-1.5 px-2.5 py-1 border rounded-lg text-[11px] font-bold uppercase tracking-wider shadow-xs ${item.decision ? 'bg-indigo-50 border-indigo-100 text-indigo-700' : 'bg-white border-neutral-200 text-neutral-500'}`}>
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                    {item.decision ? 'Decision' : 'Action Item'}
                                </div>

                                <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Assignee: {item.owner || 'AI Identified'}
                                </span>
                            </div>
                        </div>

                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 text-neutral-400 hover:text-primary-600">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
