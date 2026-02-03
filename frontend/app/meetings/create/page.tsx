'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../../../components/Layout';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { Button, Input, Toggle } from '../../../components/ui';
import { createMeeting, addParticipants } from '../../../services/api';
import { MeetingType } from '../../../types/api';

// =============================================================================
// Create Meeting Page - Multi-step Form
// =============================================================================

export default function CreateMeetingPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        meeting_type: MeetingType.ZOOM,
        start_time: '',
        duration_minutes: 60,
        external_link: '',
        ai_transcription: true,
        ai_translation: false,
        ai_recording: true,
    });

    const [participants, setParticipants] = useState<string[]>([]);
    const [currentEmail, setCurrentEmail] = useState('');

    // Handlers
    const handleInputChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const addParticipant = (e: React.FormEvent) => {
        e.preventDefault();
        if (currentEmail && !participants.includes(currentEmail)) {
            setParticipants([...participants, currentEmail]);
            setCurrentEmail('');
        }
    };

    const removeParticipant = (email: string) => {
        setParticipants(participants.filter((p) => p !== email));
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        try {
            const meeting = await createMeeting({
                ...formData,
                start_time: formData.start_time ? new Date(formData.start_time).toISOString() : undefined,
            });

            // 2. Add Participants if any
            if (participants.length > 0) {
                await addParticipants(meeting.id, participants);
            }

            // 3. Redirect to meeting detail
            router.push(`/meetings/${meeting.id}`);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to create meeting.');
            setLoading(false);
        }
    };

    const nextStep = () => {
        if (step === 1 && !formData.title) {
            setError('Meeting title is required.');
            return;
        }
        setError(null);
        setStep(step + 1);
    };

    const prevStep = () => setStep(step - 1);

    return (
        <ProtectedRoute>
            <Layout>
                <div className="max-w-3xl mx-auto py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-neutral-900">Create New Meeting</h1>
                        <p className="text-neutral-500">Configure your meeting and AI intelligence options.</p>
                    </div>

                    {/* Stepper */}
                    <div className="mb-12">
                        <div className="flex items-center justify-between relative">
                            {[1, 2, 3, 4].map((s) => (
                                <div key={s} className="flex flex-col items-center z-10">
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${step >= s ? 'bg-primary-600 text-white' : 'bg-neutral-200 text-neutral-500'
                                            }`}
                                    >
                                        {s}
                                    </div>
                                    <span className={`text-xs mt-2 font-medium ${step >= s ? 'text-primary-600' : 'text-neutral-400'}`}>
                                        {s === 1 ? 'Details' : s === 2 ? 'Participants' : s === 3 ? 'AI Options' : 'Review'}
                                    </span>
                                </div>
                            ))}
                            {/* Progress Line */}
                            <div className="absolute top-5 left-0 w-full h-0.5 bg-neutral-200 -z-0" />
                            <div
                                className="absolute top-5 left-0 h-0.5 bg-primary-600 transition-all duration-300 -z-0"
                                style={{ width: `${((step - 1) / 3) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Form Content */}
                    <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8 min-h-[400px]">
                        {error && (
                            <div className="mb-6 p-4 bg-error-50 border border-error-100 rounded-xl text-error-600 text-sm font-medium">
                                {error}
                            </div>
                        )}

                        {/* Step 1: Details */}
                        {step === 1 && (
                            <div className="space-y-6 animate-fade-in">
                                <h2 className="text-xl font-bold text-neutral-900">Meeting Details</h2>
                                <Input
                                    label="Meeting Title"
                                    placeholder="e.g. Weekly Sync with Marketing"
                                    value={formData.title}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                    required
                                />
                                <Input
                                    label="Description (Optional)"
                                    placeholder="What is this meeting about?"
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input
                                        label="Start Time"
                                        type="datetime-local"
                                        value={formData.start_time}
                                        onChange={(e) => handleInputChange('start_time', e.target.value)}
                                    />
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-1.5">Meeting Type</label>
                                        <select
                                            className="block w-full px-3 py-2 text-sm bg-white border border-neutral-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500"
                                            value={formData.meeting_type}
                                            onChange={(e) => handleInputChange('meeting_type', e.target.value)}
                                        >
                                            <option value={MeetingType.ZOOM}>Zoom</option>
                                            <option value={MeetingType.GOOGLE_MEET}>Google Meet</option>
                                            <option value={MeetingType.TEAMS}>Microsoft Teams</option>
                                            <option value={MeetingType.IN_PERSON}>In Person</option>
                                            <option value={MeetingType.OTHER}>Other</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Participants */}
                        {step === 2 && (
                            <div className="space-y-6 animate-fade-in">
                                <h2 className="text-xl font-bold text-neutral-900">Add Participants</h2>
                                <form onSubmit={addParticipant} className="flex gap-3">
                                    <div className="flex-1">
                                        <Input
                                            placeholder="Enter participant email..."
                                            type="email"
                                            value={currentEmail}
                                            onChange={(e) => setCurrentEmail(e.target.value)}
                                        />
                                    </div>
                                    <Button type="submit" variant="secondary">
                                        Add
                                    </Button>
                                </form>

                                <div className="space-y-3">
                                    <p className="text-sm font-medium text-neutral-700">Participants ({participants.length})</p>
                                    {participants.length === 0 ? (
                                        <p className="text-sm text-neutral-400 italic">No participants added yet.</p>
                                    ) : (
                                        <div className="flex flex-wrap gap-2">
                                            {participants.map((email) => (
                                                <div
                                                    key={email}
                                                    className="flex items-center gap-2 px-3 py-1.5 bg-neutral-100 rounded-full text-sm text-neutral-700"
                                                >
                                                    {email}
                                                    <button
                                                        onClick={() => removeParticipant(email)}
                                                        className="text-neutral-400 hover:text-error-600"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Step 3: AI Options */}
                        {step === 3 && (
                            <div className="space-y-8 animate-fade-in">
                                <h2 className="text-xl font-bold text-neutral-900">AI Intelligence Options</h2>

                                <div className="space-y-6">
                                    <Toggle
                                        label="Automaic Transcription"
                                        description="Convert speech to text automatically after the meeting."
                                        checked={formData.ai_transcription}
                                        onChange={(checked) => handleInputChange('ai_transcription', checked)}
                                    />
                                    <Toggle
                                        label="AI Recording"
                                        description="Allow the Eden AI listener to record the meeting audio."
                                        checked={formData.ai_recording}
                                        onChange={(checked) => handleInputChange('ai_recording', checked)}
                                    />
                                    <Toggle
                                        label="AI Translation (Coming Soon)"
                                        description="Translate the transcript into multiple languages."
                                        checked={formData.ai_translation}
                                        onChange={(checked) => handleInputChange('ai_translation', checked)}
                                        disabled
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 4: Review */}
                        {step === 4 && (
                            <div className="space-y-8 animate-fade-in">
                                <h2 className="text-xl font-bold text-neutral-900">Review Meeting</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <h3 className="text-xs uppercase tracking-wider font-bold text-neutral-400">Basic Info</h3>
                                        <div>
                                            <p className="text-sm font-bold text-neutral-900">{formData.title}</p>
                                            <p className="text-sm text-neutral-500">{formData.description || 'No description'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-neutral-400">Date & Time</p>
                                            <p className="text-sm text-neutral-700">
                                                {formData.start_time ? new Date(formData.start_time).toLocaleString() : 'Not set'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-neutral-400">Meeting Type</p>
                                            <p className="text-sm text-neutral-700 capitalize">{formData.meeting_type}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-xs uppercase tracking-wider font-bold text-neutral-400">AI Configurations</h3>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${formData.ai_transcription ? 'bg-success-500' : 'bg-neutral-300'}`} />
                                                <span className="text-sm text-neutral-700">Transcription: {formData.ai_transcription ? 'Enabled' : 'Disabled'}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${formData.ai_recording ? 'bg-success-500' : 'bg-neutral-300'}`} />
                                                <span className="text-sm text-neutral-700">Recording: {formData.ai_recording ? 'Enabled' : 'Disabled'}</span>
                                            </div>
                                        </div>

                                        <h3 className="text-xs uppercase tracking-wider font-bold text-neutral-400 mt-6">Participants</h3>
                                        <p className="text-sm text-neutral-700">{participants.length} people added</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Footer Actions */}
                        <div className="mt-12 flex justify-between border-t border-neutral-100 pt-8">
                            <Button
                                variant="secondary"
                                onClick={step === 1 ? () => router.back() : prevStep}
                                disabled={loading}
                            >
                                {step === 1 ? 'Cancel' : 'Back'}
                            </Button>

                            {step < 4 ? (
                                <Button onClick={nextStep}>
                                    Continue
                                </Button>
                            ) : (
                                <Button onClick={handleSubmit} loading={loading}>
                                    Create Meeting
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </Layout>
        </ProtectedRoute>
    );
}
