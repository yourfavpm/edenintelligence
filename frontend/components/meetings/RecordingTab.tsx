'use client';

import React, { useState } from 'react';
import { MeetingDetail } from '../../types/api';
import { FileUpload, Button } from '../ui';
import { apiService } from '../../services/api';
import AudioPlayer from '../AudioPlayer';

// =============================================================================
// Recording Tab Component
// =============================================================================

interface RecordingTabProps {
    meeting: MeetingDetail;
}

export default function RecordingTab({ meeting }: RecordingTabProps) {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);

    // Check audio_files first (new system), then fall back to recordings (legacy)
    const audioFile = meeting.audio_files?.[0];
    const recording = meeting.recordings?.[0];

    const handleUpload = async (file: File) => {
        setUploading(true);
        setError(null);
        try {
            await apiService.uploadAudio(file, meeting.meeting.id, (p) => setProgress(p));
            // Refresh page or update state to show processing status
            window.location.reload();
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Upload failed.');
            setUploading(false);
        }
    };

    if (!audioFile && !recording) {
        return (
            <div className="py-12 max-w-xl mx-auto space-y-8 animate-fade-in text-center">
                <div>
                    <svg className="w-16 h-16 mx-auto mb-4 text-neutral-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                    <h3 className="text-xl font-bold text-neutral-900">No recording found</h3>
                    <p className="text-neutral-500 mt-2">Upload a meeting recording to start AI processing.</p>
                </div>

                <FileUpload
                    onFileSelect={handleUpload}
                    uploading={uploading}
                    progress={progress}
                    error={error}
                />
            </div>
        );
    }

    // Use audioFile if available, otherwise use recording
    const displayItem = audioFile || recording;

    return (
        <div className="py-8 space-y-8 animate-fade-in">
            {/* Audio Player */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-neutral-900">Recording</h3>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={async () => {
                            if (confirm('Are you sure you want to delete this recording? This action cannot be undone.')) {
                                try {
                                    await apiService.deleteAudio(displayItem.id);
                                    window.location.reload();
                                } catch (err) {
                                    alert('Failed to delete recording');
                                }
                            }
                        }}
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                    </Button>
                </div>
                <AudioPlayer audioId={displayItem.id} filename={displayItem.s3_key.split('/').pop()} />
            </div>

            {/* Stats & Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-100">
                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">Status</p>
                    <div className="flex items-center gap-2">
                        <p className="text-lg font-bold text-neutral-900">
                            {displayItem.processed ? 'Successfully Processed' :
                                displayItem.processing_status === 'failed' ? 'Processing Failed' :
                                    'Processing...'}
                        </p>
                        {displayItem.processed && <div className="w-2 h-2 rounded-full bg-success-500" />}
                        {displayItem.processing_status === 'failed' && <div className="w-2 h-2 rounded-full bg-error-500" />}
                        {!displayItem.processed && displayItem.processing_status !== 'failed' && (
                            <div className="w-2 h-2 rounded-full bg-warning-500 animate-pulse" />
                        )}
                    </div>
                </div>
                <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-100">
                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">File Size</p>
                    <p className="text-lg font-bold text-neutral-900">
                        {displayItem.size_bytes ? `${(displayItem.size_bytes / 1024 / 1024).toFixed(2)} MB` : 'Unknown'}
                    </p>
                </div>
                <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-100">
                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">Upload Date</p>
                    <p className="text-lg font-bold text-neutral-900">
                        {new Date(displayItem.uploaded_at).toLocaleDateString()}
                    </p>
                </div>
            </div>
        </div>
    );
}
