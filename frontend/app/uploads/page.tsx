'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../../components/Layout';
import ProtectedRoute from '../../components/ProtectedRoute';
import { FileUpload, Button } from '../../components/ui';
import { apiService } from '../../services/api';

// =============================================================================
// Upload Recording Page
// =============================================================================

export default function UploadPage() {
    const router = useRouter();
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [result, setResult] = useState<{ id: number; s3_key: string } | null>(null);
    const [customTitle, setCustomTitle] = useState('');

    const handleUpload = async (file: File) => {
        setUploading(true);
        setError(null);
        setSuccess(false);
        try {
            const data = await apiService.uploadAudio(file, undefined, (p) => setProgress(p), customTitle);
            setResult(data);
            setSuccess(true);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Upload failed.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <ProtectedRoute>
            <Layout>
                <div className="max-w-4xl mx-auto py-8 px-4">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight mb-2">
                            Upload Meeting Recording
                        </h1>
                        <p className="text-sm text-neutral-500 max-w-xl mx-auto font-medium">
                            Turn your recordings into actionable insights. Simply drop your audio or video file here.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-neutral-200 shadow-lg overflow-hidden min-h-[400px] flex flex-col items-center justify-center p-6 md:p-12">
                        {!success ? (
                            <div className="w-full max-w-xl space-y-8 animate-fade-in">
                                <div className="bg-primary-50 p-6 rounded-2xl flex items-start gap-4 border border-primary-100 mb-8">
                                    <div className="p-2 bg-primary-100 rounded-lg text-primary-600">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-primary-900">Supported Formats</h3>
                                        <p className="text-xs text-primary-700 mt-1 leading-relaxed">
                                            We support MP3, WAV, M4A, and MP4 files. Maximum file size is 500MB.
                                        </p>
                                    </div>
                                </div>

                                {/* Title Input */}
                                <div className="space-y-4 mb-6">
                                    <label className="block text-sm font-medium text-neutral-700">
                                        Recording Name (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Q4 Strategy Meeting"
                                        value={customTitle}
                                        onChange={(e) => setCustomTitle(e.target.value)}
                                        className="block w-full rounded-xl border-neutral-200 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-neutral-50"
                                        disabled={uploading}
                                    />
                                </div>

                                <FileUpload
                                    onFileSelect={handleUpload}
                                    uploading={uploading}
                                    progress={progress}
                                    error={error}
                                />

                                {uploading && (
                                    <div className="text-center space-y-2 animate-pulse">
                                        <p className="text-sm font-bold text-neutral-700">AI is preparing your processing pipeline...</p>
                                        <p className="text-xs text-neutral-400">Please do not close this window until the upload is complete.</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center space-y-10 animate-slide-up w-full max-w-md">
                                <div className="w-24 h-24 bg-success-100 rounded-full flex items-center justify-center mx-auto shadow-sm">
                                    <svg className="w-12 h-12 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>

                                <div className="space-y-3">
                                    <h2 className="text-2xl font-bold text-neutral-900">Upload Complete!</h2>
                                    <p className="text-sm text-neutral-500 font-medium">
                                        Your recording has been successfully uploaded and is now being processed by our AI engines.
                                    </p>
                                </div>

                                <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-100 space-y-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-neutral-500">File ID</span>
                                        <span className="font-mono text-neutral-900">{result?.id}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-neutral-500">Status</span>
                                        <span className="flex items-center gap-1.5 text-warning-600 font-bold">
                                            <div className="w-2 h-2 bg-warning-500 rounded-full animate-pulse" />
                                            Analyzing Audio
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <Button
                                        variant="secondary"
                                        block
                                        onClick={() => { setSuccess(false); setProgress(0); }}
                                    >
                                        Upload Another
                                    </Button>
                                    <Button
                                        block
                                        onClick={() => router.push('/meetings')}
                                    >
                                        Go to Meetings
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Layout>
        </ProtectedRoute>
    );
}
