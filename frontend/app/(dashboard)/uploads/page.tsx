'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileUpload, Button, AILoader } from '@/components/ui';
import { apiService } from '@/services/api';

// =============================================================================
// Upload Recording Page - Master Redesign
// =============================================================================

export default function UploadPage() {
    const router = useRouter();
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [result, setResult] = useState<{ id: string | number; s3_key: string } | null>(null);
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
        <div className="max-w-[800px] mx-auto py-16 px-4 animate-fade-in">
                    {/* Centered Page Header */}
                    {!uploading && !success && (
                        <div className="text-center mb-12 space-y-3">
                            <h1 className="text-[22px] font-bold text-[#1F2937] tracking-tight">Upload Recording</h1>
                            <p className="text-[15px] text-neutral-500 font-medium max-w-lg mx-auto leading-relaxed">
                                Upload your meeting recording and Claeron will generate transcripts, summaries and action items.
                            </p>
                        </div>
                    )}

                    <div className="flex flex-col items-center justify-center">
                        {!uploading && !success && (
                            <div className="w-full">
                                <FileUpload
                                    onFileSelect={handleUpload}
                                    uploading={false}
                                />
                            </div>
                        )}

                        {uploading && !success && (
                            <div className="w-full flex items-center justify-center min-h-[400px]">
                                <AILoader />
                            </div>
                        )}

                        {success && (
                            <div className="text-center space-y-10 animate-fade-in w-full max-w-md bg-white border border-[#E5E7EB] rounded-2xl p-10 shadow-sm mx-auto">
                                <div className="w-16 h-16 bg-[#10B981]/10 border border-[#10B981]/20 rounded-full flex items-center justify-center mx-auto shadow-sm text-[#10B981]">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>

                                <div className="space-y-3">
                                    <h2 className="text-[22px] font-bold text-[#1F2937] tracking-tight">Your meeting is ready.</h2>
                                    <p className="text-[15px] text-neutral-500 font-medium leading-relaxed">
                                        Claeron has generated transcripts and insights for your recording.
                                    </p>
                                </div>

                                <div className="flex flex-col gap-3 pt-6">
                                    <Button
                                        className="h-12 bg-[#6C63FF] text-white text-[15px] font-bold rounded-lg shadow-sm hover:bg-[#5A52D5] transition-all"
                                        onClick={() => router.push(`/meetings`)}
                                    >
                                        View Meeting Intelligence
                                    </Button>
                                    <button
                                        className="h-12 text-[15px] font-bold text-neutral-500 hover:text-neutral-900 transition-colors"
                                        onClick={() => { setSuccess(false); setProgress(0); setCustomTitle(''); }}
                                    >
                                        Upload Another Recording
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
    );
}
