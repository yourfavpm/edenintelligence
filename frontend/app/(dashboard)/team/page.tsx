'use client';

import React, { useState } from 'react';
import { Button, Input } from '../../../components/ui';

// =============================================================================
// Team Management - High-Density Enterprise Redesign
// =============================================================================

interface TeamMember {
    id: number;
    name: string;
    email: string;
    role: 'Admin' | 'Member' | 'Viewer';
    status: 'Active' | 'Pending';
    lastActive?: string;
}

const mockTeamMembers: TeamMember[] = [
    {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        role: 'Admin',
        status: 'Active',
        lastActive: '2026-01-25T16:30:00',
    },
];

export default function TeamPage() {
    const [members, setMembers] = useState<TeamMember[]>(mockTeamMembers);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState<'Admin' | 'Member' | 'Viewer'>('Member');
    const [searchQuery, setSearchQuery] = useState('');

    const handleInvite = () => {
        if (!inviteEmail) return;
        const newMember: TeamMember = {
            id: members.length + 1,
            name: inviteEmail.split('@')[0],
            email: inviteEmail,
            role: inviteRole,
            status: 'Pending',
        };
        setMembers([...members, newMember]);
        setInviteEmail('');
        setShowInviteModal(false);
    };

    const filteredMembers = members.filter(member =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-[1200px] mx-auto space-y-6 animate-fade-in py-2">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-6">
                        <div className="space-y-1">
                            <h1 className="text-[20px] font-bold text-neutral-900 tracking-tight">Identity & Access</h1>
                            <p className="text-[12px] text-neutral-500 font-medium">Manage institutional permissions and workspace participants.</p>
                        </div>
                        <Button 
                            onClick={() => setShowInviteModal(true)}
                            className="h-9 px-4 bg-[#0F172A] text-white text-[11px] font-bold uppercase tracking-widest rounded-lg shadow-sm hover:bg-black transition-all"
                        >
                            <svg className="w-3.5 h-3.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Participant
                        </Button>
                    </div>

                    {/* Filter Strip */}
                    <div className="flex items-center gap-4">
                        <div className="w-72">
                            <Input
                                placeholder="Search by name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="!h-9 !text-[12px] bg-[#F8FAFC]"
                            />
                        </div>
                    </div>

                    {/* Table Area */}
                    <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-[#F8FAFC] border-b border-[#E5E7EB]">
                                    <th className="px-6 py-3 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Participant</th>
                                    <th className="px-6 py-3 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Authority</th>
                                    <th className="px-6 py-3 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Condition</th>
                                    <th className="px-6 py-3 text-[10px] font-bold text-neutral-400 uppercase tracking-widest text-right">Terminal Activity</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F1F5F9]">
                                {filteredMembers.map((member) => (
                                    <tr key={member.id} className="hover:bg-[#F8FAFC] transition-colors group">
                                        <td className="px-6 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-[#F1F5F9] border border-[#E5E7EB] flex items-center justify-center text-[11px] font-bold text-neutral-600">
                                                    {member.name[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="text-[13px] font-bold text-neutral-900">{member.name}</div>
                                                    <div className="text-[11px] text-neutral-400 font-medium">{member.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3.5">
                                            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${
                                                member.role === 'Admin' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-neutral-50 text-neutral-600 border-neutral-100'
                                            }`}>
                                                {member.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3.5">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${member.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                                                <span className="text-[11px] font-bold text-neutral-700 uppercase tracking-wide">{member.status}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3.5 text-right font-mono text-[10px] text-neutral-400">
                                            {member.lastActive ? new Date(member.lastActive).toLocaleDateString() : '—'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>



                {/* Invite Modal */}
                {showInviteModal && (
                    <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-slide-up border border-[#E5E7EB]">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-[18px] font-bold text-neutral-900 tracking-tight">Provision New Access</h2>
                                <button onClick={() => setShowInviteModal(false)} className="text-neutral-400 hover:text-neutral-900 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Terminal Email</label>
                                    <Input
                                        type="email"
                                        placeholder="user@organization.com"
                                        value={inviteEmail}
                                        onChange={(e) => setInviteEmail(e.target.value)}
                                        className="!h-11 bg-[#F8FAFC]"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Authority Level</label>
                                    <select
                                        value={inviteRole}
                                        onChange={(e) => setInviteRole(e.target.value as any)}
                                        className="w-full h-11 px-4 bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg text-[13px] font-bold text-neutral-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiBzdHJva2U9IiM2YjcyODAiIHN0cm9rZS13aWR0aD0iMiIgdmlld0JveD0iMCAwIDI0IDI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0xOSAxOWwtNy03LTctNyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+')] bg-no-repeat bg-[right_1rem_center] bg-[length:1rem]"
                                    >
                                        <option value="Viewer">Viewer (Security-focused)</option>
                                        <option value="Member">Member (Operational)</option>
                                        <option value="Admin">Administrator (Privileged)</option>
                                    </select>
                                </div>

                                <div className="flex gap-3 pt-6">
                                    <button 
                                        onClick={() => setShowInviteModal(false)}
                                        className="flex-1 h-11 text-[11px] font-bold uppercase tracking-widest text-neutral-400 hover:text-neutral-900 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <Button onClick={handleInvite} className="flex-1 h-11 bg-[#0F172A] text-white text-[11px] font-bold uppercase tracking-widest rounded-lg shadow-lg hover:bg-black transition-all">
                                        Grant Access
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
    );
}
