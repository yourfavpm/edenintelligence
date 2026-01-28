'use client';

import React, { useState } from 'react';
import Layout from '../../components/Layout';
import ProtectedRoute from '../../components/ProtectedRoute';
import { Button, Input, Toggle, Tabs, TabPanel } from '../../components/ui';
import { useAuth } from '../../components/auth/AuthContext';

// =============================================================================
// Settings Page
// =============================================================================

export default function SettingsPage() {
    const { user } = useAuth();

    const [profileData, setProfileData] = useState({
        displayName: user?.email.split('@')[0] || '', // Fallback
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
        {
            id: 'profile', label: 'Profile', icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            )
        },
        {
            id: 'organization', label: 'Organization', icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            )
        },
        {
            id: 'notifications', label: 'Notifications', icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
            )
        },
    ];

    return (
        <ProtectedRoute>
            <Layout>
                <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
                    {/* Header */}
                    <div>
                        <h1 className="text-3xl font-bold text-neutral-900">Settings</h1>
                        <p className="text-neutral-500">Manage your profile, organization, and preferences.</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
                        <div className="px-6">
                            <Tabs tabs={tabs}>
                                <TabPanel id="profile">
                                    <div className="py-8 space-y-8 max-w-xl">
                                        <section className="space-y-4">
                                            <h3 className="text-lg font-bold text-neutral-900">Profile Information</h3>
                                            <div className="space-y-4">
                                                <Input
                                                    label="Display Name"
                                                    value={profileData.displayName}
                                                    onChange={(e) => setProfileData(prev => ({ ...prev, displayName: e.target.value }))}
                                                />
                                                <Input
                                                    label="Email Address"
                                                    value={profileData.email}
                                                    disabled
                                                    helperText="Email address cannot be changed."
                                                />
                                            </div>
                                        </section>

                                        <section className="space-y-4">
                                            <h3 className="text-lg font-bold text-neutral-900">Regional Settings</h3>
                                            <div>
                                                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Preferred Language</label>
                                                <select
                                                    className="block w-full px-3 py-2 text-sm bg-white border border-neutral-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500"
                                                    value={profileData.language}
                                                    onChange={(e) => setProfileData(prev => ({ ...prev, language: e.target.value }))}
                                                >
                                                    <option>English (US)</option>
                                                    <option>Spanish</option>
                                                    <option>French</option>
                                                    <option>German</option>
                                                </select>
                                            </div>
                                        </section>

                                        <div className="pt-4 border-t border-neutral-100">
                                            <Button>Save Changes</Button>
                                        </div>
                                    </div>
                                </TabPanel>

                                <TabPanel id="organization">
                                    <div className="py-8 space-y-8">
                                        <div className="p-8 bg-neutral-50 rounded-2xl border border-neutral-100 flex items-center justify-between">
                                            <div>
                                                <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">Current Organization</p>
                                                <h3 className="text-2xl font-bold text-neutral-900">Eden Default Org</h3>
                                                <p className="text-neutral-500 mt-1">Free Tier Plan</p>
                                            </div>
                                            <Button variant="secondary" size="sm">Manage Billing</Button>
                                        </div>

                                        <section className="space-y-4">
                                            <h3 className="text-lg font-bold text-neutral-900">Invite Members</h3>
                                            <div className="flex gap-3 max-w-xl">
                                                <Input placeholder="Enter email address..." className="flex-1" />
                                                <Button variant="secondary">Invite</Button>
                                            </div>
                                        </section>
                                    </div>
                                </TabPanel>

                                <TabPanel id="notifications">
                                    <div className="py-8 space-y-8 max-w-xl">
                                        <section className="space-y-6">
                                            <h3 className="text-lg font-bold text-neutral-900">Email Notifications</h3>
                                            <Toggle
                                                label="Meeting Summaries"
                                                description="Receive an executive summary via email after every meeting."
                                                checked={notifications.emailSummary}
                                                onChange={() => handleToggleNotification('emailSummary')}
                                            />
                                            <Toggle
                                                label="New Action Items"
                                                description="Get notified when the AI assigns you a new action item."
                                                checked={notifications.newActionItems}
                                                onChange={() => handleToggleNotification('newActionItems')}
                                            />
                                            <Toggle
                                                label="Processing Complete"
                                                description="Get notified when AI processing for your recording is finished."
                                                checked={notifications.processingComplete}
                                                onChange={() => handleToggleNotification('processingComplete')}
                                            />
                                            <Toggle
                                                label="Marketing & Updates"
                                                description="Stay up to date with new features and best practices."
                                                checked={notifications.marketingEmails}
                                                onChange={() => handleToggleNotification('marketingEmails')}
                                            />
                                        </section>

                                        <div className="pt-4 border-t border-neutral-100">
                                            <Button>Save Preferences</Button>
                                        </div>
                                    </div>
                                </TabPanel>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </Layout>
        </ProtectedRoute>
    );
}
