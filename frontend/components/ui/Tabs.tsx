'use client';

import React, { useState } from 'react';

// =============================================================================
// Tabs Component
// =============================================================================

interface Tab {
    id: string;
    label: string;
    icon?: React.ReactNode;
}

interface TabsProps {
    tabs: Tab[];
    defaultTab?: string;
    onChange?: (tabId: string) => void;
    children: React.ReactNode;
}

interface TabPanelProps {
    id: string;
    children: React.ReactNode;
}

export function Tabs({ tabs, defaultTab, onChange, children }: TabsProps) {
    const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

    const handleTabClick = (tabId: string) => {
        setActiveTab(tabId);
        onChange?.(tabId);
    };

    // Filter children to show only active panel
    const activePanel = React.Children.toArray(children).find((child) => {
        if (React.isValidElement<TabPanelProps>(child)) {
            return child.props.id === activeTab;
        }
        return false;
    });

    return (
        <div>
            {/* Tab buttons */}
            <div className="border-b border-neutral-200">
                <nav className="flex -mb-px space-x-8" aria-label="Tabs">
                    {tabs.map((tab) => {
                        const isActive = tab.id === activeTab;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => handleTabClick(tab.id)}
                                className={`
                  flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors
                  ${isActive
                                        ? 'border-primary-500 text-primary-600'
                                        : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                                    }
                `}
                                aria-current={isActive ? 'page' : undefined}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Tab panel */}
            <div className="mt-4">{activePanel}</div>
        </div>
    );
}

// =============================================================================
// Tab Panel Component
// =============================================================================

export function TabPanel({ children }: TabPanelProps) {
    return <div className="animate-fade-in">{children}</div>;
}

export default Tabs;
