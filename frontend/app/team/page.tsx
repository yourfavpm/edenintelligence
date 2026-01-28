'use client';

import React, { useState } from 'react';
import Layout from '../../components/Layout';
import ProtectedRoute from '../../components/ProtectedRoute';
import { Button, Input } from '../../components/ui';

// =============================================================================
// Team Management Page
// =============================================================================

interface TeamMember {
    id: number;
    name: string;
    email: string;
    role: 'Admin' | 'Member' | 'Viewer';
    status: 'Active' | 'Pending';
    lastActive?: string;
    avatar?: string;
}

// Mock data
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
        setInviteRole('Member');
        setShowInviteModal(false);
    };

    const handleRemoveMember = (id: number) => {
        if (confirm('Are you sure you want to remove this team member?')) {
            setMembers(members.filter(m => m.id !== id));
        }
    };

    const filteredMembers = members.filter(member =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'Admin':
                return 'bg-purple-100 text-purple-700';
            case 'Member':
                return 'bg-blue-100 text-blue-700';
            case 'Viewer':
                return 'bg-neutral-100 text-neutral-700';
            default:
                return 'bg-neutral-100 text-neutral-700';
        }
    };

    const getStatusBadgeColor = (status: string) => {
        return status === 'Active'
            ? 'bg-success-100 text-success-700'
            : 'bg-warning-100 text-warning-700';
    };

    return (
        <ProtectedRoute>
            <Layout>
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Team Members</h1>
                        <p className="text-neutral-500">Manage your team and control access permissions</p>
                    </div>

                    {/* Actions Bar */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        {/* Search */}
                        <div className="flex-1">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search members..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2.5 border border-neutral-300 rounded-lg text-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Invite Button */}
                        <Button onClick={() => setShowInviteModal(true)}>
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Invite Member
                        </Button>
                    </div>

                    {/* Team Members List */}
                    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
                        {filteredMembers.length === 0 ? (
                            <div className="p-12 text-center">
                                <svg className="w-16 h-16 text-neutral-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                <h3 className="text-lg font-semibold text-neutral-900 mb-2">No team members found</h3>
                                <p className="text-neutral-500 mb-4">Get started by inviting your first team member</p>
                                <Button onClick={() => setShowInviteModal(true)}>Invite Member</Button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-neutral-50 border-b border-neutral-200">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">Member</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">Role</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">Last Active</th>
                                            <th className="px-6 py-3 text-right text-xs font-semibold text-neutral-600 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-200">
                                        {filteredMembers.map((member) => (
                                            <tr key={member.id} className="hover:bg-neutral-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-medium text-sm">
                                                            {member.name[0].toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-medium text-neutral-900">{member.name}</div>
                                                            <div className="text-sm text-neutral-500">{member.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(member.role)}`}>
                                                        {member.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(member.status)}`}>
                                                        {member.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-neutral-500">
                                                    {member.lastActive ? new Date(member.lastActive).toLocaleDateString() : 'Never'}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => handleRemoveMember(member.id)}
                                                        className="text-error-600 hover:text-error-700 text-sm font-medium"
                                                    >
                                                        Remove
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Invite Modal */}
                    {showInviteModal && (
                        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-fade-in">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-neutral-900">Invite Team Member</h2>
                                    <button
                                        onClick={() => setShowInviteModal(false)}
                                        className="text-neutral-400 hover:text-neutral-600"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <Input
                                        label="Email Address"
                                        type="email"
                                        placeholder="colleague@company.com"
                                        value={inviteEmail}
                                        onChange={(e) => setInviteEmail(e.target.value)}
                                    />

                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-1.5">Role</label>
                                        <select
                                            value={inviteRole}
                                            onChange={(e) => setInviteRole(e.target.value as any)}
                                            className="block w-full px-3 py-2 text-sm bg-white border border-neutral-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500"
                                        >
                                            <option value="Viewer">Viewer - Read-only access</option>
                                            <option value="Member">Member - Can create and edit</option>
                                            <option value="Admin">Admin - Full access</option>
                                        </select>
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <Button variant="secondary" onClick={() => setShowInviteModal(false)} block>
                                            Cancel
                                        </Button>
                                        <Button onClick={handleInvite} block>
                                            Send Invite
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Layout>
        </ProtectedRoute>
    );
}
