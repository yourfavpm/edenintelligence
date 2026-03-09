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
                <div className="w-16 h-16 bg-eden-bg rounded-2xl flex items-center justify-center mb-6 border border-eden-border text-eden-muted">
                    <Sparkles size={32} />
                </div>
                <p className="text-[16px] font-medium text-eden-text">No action items found</p>
                <p className="text-[14px] text-eden-muted mt-2 max-w-[240px]">AI will extract tasks and follow-ups once processing is complete.</p>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-4 animate-fade-in custom-scrollbar overflow-y-auto h-full">
            <div className="space-y-3">
                {allItems.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-start gap-4 p-5 bg-white border border-transparent rounded-card shadow-soft hover:shadow-hover-soft transition-all duration-300 group cursor-default"
                    >
                        <div className="mt-1 flex-shrink-0">
                            <input 
                                type="checkbox" 
                                className="w-5 h-5 rounded border-eden-border text-eden-primary focus:ring-eden-primary cursor-pointer" 
                            />
                        </div>

                        <div className="flex-1 min-w-0">
                            <p className="text-[15px] text-eden-text leading-relaxed font-medium group-hover:text-eden-primary transition-colors">
                                {item.text}
                            </p>

                            <div className="flex flex-wrap items-center gap-4 mt-4">
                                <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-pill text-[10px] font-medium uppercase tracking-widest ${item.decision ? 'bg-status-info-bg text-status-info-text' : 'bg-eden-primary/10 text-eden-primary'}`}>
                                    <Tag size={12} />
                                    {item.decision ? 'Decision' : 'Action'}
                                </div>

                                <div className="flex items-center gap-2 text-[12px] text-eden-muted font-medium">
                                    <User size={14} />
                                    <span>{item.owner || 'Self'}</span>
                                </div>
                                
                                <div className="flex items-center gap-2 text-[12px] text-status-warning-text font-medium">
                                    <span className="w-1.5 h-1.5 rounded-full bg-status-warning-base" />
                                    Pending
                                </div>
                            </div>
                        </div>

                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                            <button className="p-1.5 bg-eden-bg text-eden-muted hover:text-eden-primary rounded-button transition-colors">
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
