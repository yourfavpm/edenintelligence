'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../../components/Layout';
import ProtectedRoute from '../../components/ProtectedRoute';
import { FileUpload, Button } from '../../components/ui';
import { apiService } from '../../services/api';

// =============================================================================
// Upload Recording Page - Master Redesign
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
            setError(err.message || 'Transmission failed.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <ProtectedRoute>
            <Layout>
                <div className="max-w-4xl mx-auto py-12 px-4 animate-fade-in">
                    {/* Header */}
                    <div className="text-center mb-12 space-y-2">
                        <h1 className="text-[24px] font-bold text-neutral-900 tracking-tight">Upload Meeting</h1>
                        <p className="text-[13px] text-neutral-500 font-medium max-w-md mx-auto leading-relaxed">
                            Upload your recordings and let AI extract summary, decisions, and tasks.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xl overflow-hidden min-h-[460px] flex flex-col items-center justify-center p-8 md:p-14">
                        {!success ? (
                            <div className="w-full max-w-lg space-y-8 animate-fade-in">
                                
                                {/* Info Panel */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl">
                                        <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Formats</h3>
                                        <p className="text-[12px] font-bold text-neutral-700">MP3, WAV, M4A, MP4</p>
                                    </div>
                                    <div className="p-4 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl">
                                        <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Capacity</h3>
                                        <p className="text-[12px] font-bold text-neutral-700">Up to 500MB / File</p>
                                    </div>
                                </div>

                                {/* Title Input */}
                                <div className="space-y-1.5 focus-within:text-[#4F46E5] transition-colors">
                                    <label className="text-[11px] font-bold uppercase tracking-wider ml-1 text-inherit">Meeting Title</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Weekly Sync"
                                        value={customTitle}
                                        onChange={(e) => setCustomTitle(e.target.value)}
                                        className="w-full h-11 px-4 bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg text-[14px] font-medium focus:outline-none focus:ring-1 focus:ring-[#4F46E5] transition-all"
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
                                    <div className="text-center py-2 animate-pulse">
                                        <p className="text-[11px] font-bold text-[#4F46E5] uppercase tracking-[0.2em]">Uploading file...</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center space-y-10 animate-slide-up w-full max-w-md">
                                <div className="w-16 h-16 bg-success-50 border border-success-100 rounded-full flex items-center justify-center mx-auto shadow-sm text-success-600">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>

                                <div className="space-y-2">
                                    <h2 className="text-[20px] font-bold text-neutral-900 tracking-tight">Upload Successful</h2>
                                    <p className="text-[13px] text-neutral-500 font-medium leading-relaxed">
                                        Your recording is now in the queue. AI processing usually takes 2-5 minutes depending on the length.
                                    </p>
                                </div>

                                <div className="p-6 bg-[#F8FAFC] rounded-xl border border-[#E5E7EB] space-y-4">
                                    <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-wider">
                                        <span className="text-neutral-400">Meeting ID</span>
                                        <span className="text-neutral-900 font-mono tracking-normal">{result?.id}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-wider">
                                        <span className="text-neutral-400">Status</span>
                                        <span className="flex items-center gap-1.5 text-indigo-600">
                                            <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-pulse" />
                                            AI Processing
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-4">
                                    <button
                                        className="h-11 text-[11px] font-bold uppercase tracking-widest text-neutral-400 hover:text-neutral-900 transition-colors"
                                        onClick={() => { setSuccess(false); setProgress(0); }}
                                    >
                                        Upload More
                                    </button>
                                    <Button
                                        className="h-11 bg-[#0F172A] text-white text-[11px] font-bold uppercase tracking-widest rounded-lg shadow-lg hover:bg-black transition-all"
                                        onClick={() => router.push('/meetings')}
                                    >
                                        View Meetings
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
