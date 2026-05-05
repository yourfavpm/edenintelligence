'use client';

import React, { useState } from 'react';
import { Button, Input, Toggle, Tabs, TabPanel } from '@/components/ui';
import { useAuth } from '@/components/auth/AuthContext';

// =============================================================================
// Settings - High-Density Enterprise Redesign
// =============================================================================

export default function SettingsPage() {
    const { user } = useAuth();

    const [profileData, setProfileData] = useState({
        displayName: user?.email.split('@')[0] || 'Administrator',
        email: user?.email || '',
        language: 'English (US)',
    });

    const [notifications, setNotifications] = useState({
        emailSummary: true,
        newActionItems: true,
        processingComplete: true,
        marketingEmails: false,
    });

    const handleToggleNotification = (key: keyof typeof notifications) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const tabs = [
        { id: 'profile', label: 'Identity' },
        { id: 'organization', label: 'Organization' },
        { id: 'notifications', label: 'Intelligence Alerts' },
    ];

    return (
        <div className="max-w-[1000px] mx-auto space-y-8 animate-fade-in py-2">
                    {/* Header */}
                    <div className="border-b border-[#E5E7EB] pb-6">
                        <h1 className="text-[20px] font-bold text-neutral-900 tracking-tight">System Configuration</h1>
                        <p className="text-[12px] text-neutral-500 font-medium">Manage your personal credentials, workspace parameters, and alert protocols.</p>
                    </div>

                    <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden">
                        <div className="px-6">
                            <Tabs tabs={tabs}>
                                <TabPanel id="profile">
                                    <div className="py-8 space-y-10 max-w-lg">
                                        <section className="space-y-6">
                                            <div className="space-y-1">
                                                <h3 className="text-[14px] font-bold text-neutral-900 uppercase tracking-wider">Identity Profile</h3>
                                                <p className="text-[11px] text-neutral-400 font-medium">This information is visible across the institution.</p>
                                            </div>
                                            
                                            <div className="space-y-5">
                                                <div className="space-y-1.5 focus-within:text-[#4F46E5] transition-colors">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-inherit ml-1">Display Name</label>
                                                    <Input
                                                        value={profileData.displayName}
                                                        onChange={(e) => setProfileData(prev => ({ ...prev, displayName: e.target.value }))}
                                                        className="!h-10 bg-[#F8FAFC]"
                                                    />
                                                </div>
                                                <div className="space-y-1.5 opacity-60">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Terminal Email</label>
                                                    <Input
                                                        value={profileData.email}
                                                        disabled
                                                        className="!h-10 bg-[#F1F5F9]"
                                                    />
                                                    <p className="text-[9px] text-neutral-400 ml-1 font-bold italic uppercase tracking-tighter">Read-only field.</p>
                                                </div>
                                            </div>
                                        </section>

                                        <section className="space-y-4 pt-6 border-t border-[#F1F5F9]">
                                            <div className="space-y-1">
                                                <h3 className="text-[14px] font-bold text-neutral-900 uppercase tracking-wider">Localization</h3>
                                                <p className="text-[11px] text-neutral-400 font-medium">Set your preferred regional interface defaults.</p>
                                            </div>
                                            <div className="w-full">
                                                <select
                                                    className="w-full h-10 px-3 py-2 text-[13px] font-bold text-neutral-700 bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-[#4F46E5] appearance-none"
                                                    value={profileData.language}
                                                    onChange={(e) => setProfileData(prev => ({ ...prev, language: e.target.value }))}
                                                >
                                                    <option>English (US)</option>
                                                    <option>Global Standard API</option>
                                                </select>
                                            </div>
                                        </section>

                                        <div className="pt-6">
                                            <Button className="h-10 bg-[#0F172A] text-white text-[11px] font-bold uppercase tracking-widest px-6 rounded-lg shadow-lg">Save Changes</Button>
                                        </div>
                                    </div>
                                </TabPanel>

                                <TabPanel id="organization">
                                    <div className="py-8 space-y-10">
                                        <div className="p-8 bg-[#F8FAFC] rounded-2xl border border-[#E5E7EB] flex items-center justify-between shadow-sm">
                                            <div>
                                                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-1.5">Operational Tier</p>
                                                <h3 className="text-[20px] font-bold text-neutral-900 tracking-tight">Claeron Enterprise Cloud</h3>
                                                <p className="text-[12px] text-neutral-500 font-medium mt-1 uppercase tracking-wider">Unlimited Neural Cycles • Unlimited Workspace Nodes</p>
                                            </div>
                                            <Button className="h-9 px-4 bg-white border border-[#E5E7EB] text-neutral-800 text-[10px] font-bold uppercase tracking-widest rounded-lg shadow-sm hover:bg-neutral-50 transition-all">Billing Portal</Button>
                                        </div>

                                        <section className="space-y-6 max-w-lg">
                                            <div className="space-y-1">
                                                <h3 className="text-[14px] font-bold text-neutral-900 uppercase tracking-wider">Participant Ingestion</h3>
                                                <p className="text-[11px] text-neutral-400 font-medium">Rapidly provision access to external system actors.</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Input placeholder="Enter email address..." className="flex-1 !h-10 bg-[#F8FAFC]" />
                                                <Button className="h-10 px-5 bg-[#F1F5F9] border border-[#E2E8F0] text-neutral-700 text-[10px] font-bold uppercase tracking-widest rounded-lg shadow-sm hover:bg-white transition-all">Invite</Button>
                                            </div>
                                        </section>
                                    </div>
                                </TabPanel>

                                <TabPanel id="notifications">
                                    <div className="py-8 space-y-10 max-w-xl">
                                        <section className="space-y-8">
                                            <div className="space-y-1">
                                                <h3 className="text-[14px] font-bold text-neutral-900 uppercase tracking-wider">Transmission Rules</h3>
                                                <p className="text-[11px] text-neutral-400 font-medium">Control when and how the system communicates critical events.</p>
                                            </div>

                                            <div className="space-y-8">
                                                <Toggle
                                                    label="Automated Executive Summaries"
                                                    description="Dispatch neural summaries to terminal email after every synchronous event."
                                                    checked={notifications.emailSummary}
                                                    onChange={() => handleToggleNotification('emailSummary')}
                                                />
                                                <Toggle
                                                    label="Task Vector Alerts"
                                                    description="Notify when new operational tasks are extracted and assigned to your actor ID."
                                                    checked={notifications.newActionItems}
                                                    onChange={() => handleToggleNotification('newActionItems')}
                                                />
                                                <Toggle
                                                    label="Ingestion Lifecycle Updates"
                                                    description="Confirm when asynchronous recordings have finished deep transcription."
                                                    checked={notifications.processingComplete}
                                                    onChange={() => handleToggleNotification('processingComplete')}
                                                />
                                            </div>
                                        </section>

                                        <div className="pt-6 border-t border-[#F1F5F9]">
                                            <Button className="h-10 bg-[#0F172A] text-white text-[11px] font-bold uppercase tracking-widest px-6 rounded-lg shadow-lg">Synchronize Preferences</Button>
                                        </div>
                                    </div>
                                </TabPanel>
                            </Tabs>
                        </div>
                    </div>
                </div>
    );
}
