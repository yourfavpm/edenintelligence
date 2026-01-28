'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../../components/Layout';
import ProtectedRoute from '../../components/ProtectedRoute';
import { Button, Input } from '../../components/ui';
import AudioVisualizer from '../../components/AudioVisualizer';
import { useMediaRecorder } from '../../hooks/useMediaRecorder';
import { apiService } from '../../services/api';

// =============================================================================
// Record Meeting Page - Live Audio Recording
// =============================================================================

export default function RecordPage() {
    const router = useRouter();
    const [countdown, setCountdown] = useState<number | null>(null);
    const [meetingTitle, setMeetingTitle] = useState('');
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const {
        state,
        startRecording,
        stopRecording,
        pauseRecording,
        resumeRecording,
        audioBlob,
        duration,
        error,
        isSupported,
        mediaStream,
    } = useMediaRecorder({
        onError: (err) => console.error('Recording error:', err),
    });

    // Format duration as MM:SS
    const formatDuration = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Handle start with countdown
    const handleStartWithCountdown = async () => {
        setCountdown(3);
        const interval = setInterval(() => {
            setCountdown((prev) => {
                if (prev === null || prev <= 1) {
                    clearInterval(interval);
                    return null;
                }
                return prev - 1;
            });
        }, 1000);

        setTimeout(async () => {
            await startRecording();
        }, 3000);
    };

    // Handle save and upload
    const handleSave = async () => {
        if (!audioBlob) return;

        setUploading(true);
        try {
            // Convert Blob to File
            const fileName = meetingTitle
                ? `${meetingTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${Date.now()}.webm`
                : `recording_${Date.now()}.webm`;

            const file = new File([audioBlob], fileName, { type: audioBlob.type });
            console.log('DEBUG: Uploading file:', {
                name: file.name,
                size: file.size,
                type: file.type,
                blobSize: audioBlob.size,
                blobType: audioBlob.type
            });

            // Upload using existing API
            await apiService.uploadAudio(file, undefined, (progress) => {
                setUploadProgress(progress);
            });

            // Redirect to meetings
            router.push('/meetings');
        } catch (err: any) {
            console.error('Upload failed:', err);
            alert(`Failed to upload recording: ${err.message || err.toString()}`);
        } finally {
            setUploading(false);
        }
    };

    // Handle discard
    const handleDiscard = () => {
        if (confirm('Are you sure you want to discard this recording?')) {
            window.location.reload();
        }
    };

    // Cleanup handled by useMediaRecorder
    useEffect(() => {
        return () => {
            // cleanup if needed
        };
    }, []);

    // Create audio URL for playback
    const audioUrl = audioBlob ? URL.createObjectURL(audioBlob) : null;

    if (!isSupported) {
        return (
            <ProtectedRoute>
                <Layout>
                    <div className="max-w-2xl mx-auto py-12 text-center">
                        <div className="bg-error-50 border border-error-200 rounded-2xl p-8">
                            <svg className="w-16 h-16 text-error-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <h2 className="text-2xl font-bold text-error-900 mb-2">Browser Not Supported</h2>
                            <p className="text-error-700">
                                Your browser doesn't support audio recording. Please use a modern browser like Chrome, Firefox, Safari, or Edge.
                            </p>
                        </div>
                    </div>
                </Layout>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <Layout>
                <div className="max-w-4xl mx-auto py-8 px-4">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight mb-2">
                            Record Meeting
                        </h1>
                        <p className="text-sm text-neutral-500 max-w-xl mx-auto font-medium">
                            Record your meeting directly in the browser. Your recording will be automatically transcribed and summarized.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-neutral-200 shadow-lg overflow-hidden p-6 md:p-10">
                        {/* Countdown Overlay */}
                        {countdown !== null && (
                            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                                <div className="text-white text-9xl font-bold animate-pulse">
                                    {countdown}
                                </div>
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 p-4 bg-error-50 border border-error-100 rounded-xl text-error-600 text-sm font-medium">
                                {error}
                            </div>
                        )}

                        {/* Recording State: Idle */}
                        {state === 'idle' && !audioBlob && (
                            <div className="text-center space-y-8">
                                <div className="w-32 h-32 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                                    <svg className="w-16 h-16 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                    </svg>
                                </div>

                                <div>
                                    <h2 className="text-xl font-bold text-neutral-900 mb-1">Ready to Record</h2>
                                    <p className="text-sm text-neutral-500">Click the button below to start recording your meeting</p>
                                </div>

                                <Button
                                    onClick={handleStartWithCountdown}
                                    className="px-8 py-3 text-base"
                                >
                                    <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="10" />
                                    </svg>
                                    Start Recording
                                </Button>
                            </div>
                        )}

                        {/* Recording State: Recording or Paused */}
                        {(state === 'recording' || state === 'paused') && (
                            <div className="space-y-8">
                                {/* Recording Indicator */}
                                <div className="flex items-center justify-center gap-3">
                                    {state === 'recording' && (
                                        <div className="w-4 h-4 bg-error-500 rounded-full animate-pulse" />
                                    )}
                                    <span className="text-2xl font-bold text-neutral-900">
                                        {state === 'recording' ? 'Recording...' : 'Paused'}
                                    </span>
                                </div>

                                {/* Duration */}
                                <div className="text-center">
                                    <div className="text-4xl font-mono font-bold text-primary-600">
                                        {formatDuration(duration)}
                                    </div>
                                </div>

                                {/* Visualizer */}
                                <AudioVisualizer stream={mediaStream} isRecording={state === 'recording'} />

                                {/* Controls */}
                                <div className="flex justify-center gap-4">
                                    {state === 'recording' ? (
                                        <Button variant="secondary" onClick={pauseRecording}>
                                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                                            </svg>
                                            Pause
                                        </Button>
                                    ) : (
                                        <Button variant="secondary" onClick={resumeRecording}>
                                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                            Resume
                                        </Button>
                                    )}
                                    <Button onClick={stopRecording} className="bg-error-600 hover:bg-error-700">
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                            <rect x="6" y="6" width="12" height="12" />
                                        </svg>
                                        Stop Recording
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Recording State: Stopped (Preview) */}
                        {state === 'stopped' && audioBlob && (
                            <div className="space-y-8">
                                <div className="text-center">
                                    <div className="w-24 h-24 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-12 h-12 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h2 className="text-2xl font-bold text-neutral-900 mb-2">Recording Complete!</h2>
                                    <p className="text-neutral-500">Duration: {formatDuration(duration)}</p>
                                </div>

                                {/* Audio Preview */}
                                <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-200">
                                    <h3 className="text-sm font-bold text-neutral-700 mb-3">Preview Recording</h3>
                                    <audio
                                        ref={audioRef}
                                        src={audioUrl || undefined}
                                        controls
                                        className="w-full"
                                    />
                                </div>

                                {/* Meeting Title */}
                                <Input
                                    label="Meeting Title (Optional)"
                                    placeholder="e.g. Team Standup - Jan 25"
                                    value={meetingTitle}
                                    onChange={(e) => setMeetingTitle(e.target.value)}
                                />

                                {/* Actions */}
                                {!uploading ? (
                                    <div className="flex gap-4">
                                        <Button variant="secondary" onClick={handleDiscard} block>
                                            Discard
                                        </Button>
                                        <Button onClick={handleSave} block>
                                            Save & Process
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm text-neutral-600">
                                            <span>Uploading...</span>
                                            <span>{uploadProgress}%</span>
                                        </div>
                                        <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
                                            <div
                                                className="bg-primary-600 h-full transition-all duration-300"
                                                style={{ width: `${uploadProgress}%` }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </Layout>
        </ProtectedRoute>
    );
}
