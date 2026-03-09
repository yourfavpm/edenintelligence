'use client';

import React from 'react';
import { MeetingDetail } from '../../types/api';
import { Sparkles, User, Tag, ChevronRight } from 'lucide-react';

// =============================================================================
// Action Items Tab Component - Eden Intelligence
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
            <div className="py-20 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-neutral-50 rounded-2xl flex items-center justify-center mb-6 border border-neutral-100 text-neutral-300">
                    <Sparkles size={32} />
                </div>
                <p className="text-[16px] font-bold text-[#0A1B3D]">No action items found</p>
                <p className="text-[13px] text-neutral-500 mt-2 max-w-[240px]">AI will extract tasks and follow-ups once processing is complete.</p>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-4 animate-fade-in custom-scrollbar overflow-y-auto h-full">
            <div className="space-y-3">
                {allItems.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-start gap-4 p-5 bg-white border border-[#E5E7EB] rounded-xl hover:border-[#6C63FF]/30 transition-all hover:shadow-md group cursor-default"
                    >
                        <div className="mt-1 flex-shrink-0">
                            <input 
                                type="checkbox" 
                                className="w-5 h-5 rounded border-[#E5E7EB] text-[#6C63FF] focus:ring-[#6C63FF] cursor-pointer" 
                            />
                        </div>

                        <div className="flex-1 min-w-0">
                            <p className="text-[14px] text-[#1F2937] leading-relaxed font-medium group-hover:text-black transition-colors">
                                {item.text}
                            </p>

                            <div className="flex flex-wrap items-center gap-4 mt-3">
                                <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${item.decision ? 'bg-indigo-50 text-indigo-700' : 'bg-[#6C63FF]/10 text-[#6C63FF]'}`}>
                                    <Tag size={10} />
                                    {item.decision ? 'Decision' : 'Action'}
                                </div>

                                <div className="flex items-center gap-2 text-[11px] text-neutral-400 font-medium">
                                    <User size={12} />
                                    <span>{item.owner || 'Self'}</span>
                                </div>
                                
                                <div className="flex items-center gap-2 text-[11px] text-amber-500 font-medium">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                    Pending
                                </div>
                            </div>
                        </div>

                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                            <button className="p-1 text-neutral-300 hover:text-[#6C63FF] transition-colors">
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
