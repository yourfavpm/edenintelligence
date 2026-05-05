'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@/components/ui';
import AudioVisualizer from '@/components/AudioVisualizer';
import { useMediaRecorder } from '../../../hooks/useMediaRecorder';
import { apiService } from '@/services/api';

// =============================================================================
// Record Meeting Page - Master Redesign
// =============================================================================

export default function RecordPage() {
    const router = useRouter();
    const [countdown, setCountdown] = useState<number | null>(null);
    const [meetingTitle, setMeetingTitle] = useState('');
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(null);

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

    const formatDuration = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

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

    const handleSave = async () => {
        if (!audioBlob) return;
        setUploading(true);
        try {
            const fileName = meetingTitle
                ? `${meetingTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${Date.now()}.webm`
                : `recording_${Date.now()}.webm`;
            const file = new File([audioBlob], fileName, { type: audioBlob.type });
            await apiService.uploadAudio(file, undefined, (progress) => {
                setUploadProgress(progress);
            });
            router.push('/meetings');
        } catch (err: any) {
            console.error('Upload failed:', err);
            alert(`Upload failed: ${err.message}`);
        } finally {
            setUploading(false);
        }
    };

    if (!isSupported) {
        return (
            <div className="max-w-2xl mx-auto py-20 text-center">
                <div className="bg-red-50 border border-red-100 rounded-xl p-10">
                    <h2 className="text-xl font-bold text-red-900 mb-2">Browser Incompatible</h2>
                    <p className="text-red-700 text-sm">Recording is not supported in this environment.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto py-10 animate-fade-in">
                    {/* Header */}
                    <div className="mb-10 text-center space-y-2">
                        <h1 className="text-[24px] font-bold text-neutral-900 tracking-tight">Record Meeting</h1>
                        <p className="text-[13px] text-neutral-500 font-medium max-w-lg mx-auto leading-relaxed">Capture your meeting live. Audio will be saved and processed using AI.</p>
                    </div>

                    <div className="relative bg-white rounded-2xl border border-[#E5E7EB] shadow-xl overflow-hidden min-h-[520px] flex flex-col">
                        
                        {/* Countdown Overlay */}
                        {countdown !== null && (
                            <div className="absolute inset-0 bg-[#0F172A]/90 z-50 flex flex-col items-center justify-center text-white">
                                <div className="text-[100px] font-bold animate-ping">{countdown}</div>
                                <p className="text-[12px] font-bold uppercase tracking-[0.3em] mt-8 text-indigo-400">Starting...</p>
                            </div>
                        )}

                        {/* Workspace View */}
                        <div className="flex-1 flex flex-col items-center justify-center p-12 space-y-10">
                            
                            {state === 'idle' && !audioBlob && (
                                <div className="text-center group cursor-pointer" onClick={handleStartWithCountdown}>
                                    <div className="w-40 h-40 bg-[#F8FAFC] border border-[#E5E7EB] rounded-full flex items-center justify-center mx-auto mb-8 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-all active:scale-95 shadow-lg relative">
                                        <div className="absolute inset-0 rounded-full bg-[#4F46E5] opacity-5 animate-pulse" />
                                        <svg className="w-16 h-16 text-[#4F46E5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                        </svg>
                                    </div>
                                    <p className="text-[14px] font-bold text-neutral-900">Click to start recording</p>
                                    <p className="text-[11px] text-neutral-400 font-bold uppercase tracking-widest mt-2">Ready to record</p>
                                </div>
                            )}

                            {(state === 'recording' || state === 'paused') && (
                                <div className="w-full max-w-2xl space-y-12">
                                    <div className="text-center space-y-4">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-bold uppercase tracking-wider animate-pulse">
                                            <div className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                                            Live Stream
                                        </div>
                                        <div className="text-[64px] font-mono font-bold text-neutral-900 tracking-tighter leading-none">
                                            {formatDuration(duration)}
                                        </div>
                                    </div>

                                    <div className="h-24 bg-[#0F172A] rounded-xl overflow-hidden border border-slate-800 shadow-inner">
                                        <AudioVisualizer stream={mediaStream} isRecording={state === 'recording'} />
                                    </div>

                                    <div className="flex justify-center gap-4">
                                        <button 
                                            onClick={state === 'recording' ? pauseRecording : resumeRecording}
                                            className="px-6 py-2.5 rounded-lg border border-[#E5E7EB] text-[13px] font-bold text-neutral-700 hover:bg-neutral-50 active:scale-95 transition-all flex items-center gap-2"
                                        >
                                            {state === 'recording' ? (
                                                <><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4h3v12H5V4zm7 0h3v12h-3V4z"/></svg>Pause</>
                                            ) : (
                                                <><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M4.53 4.39a.75.75 0 01.75 0l11 6.5a.75.75 0 010 1.28l-11 6.5a.75.75 0 01-1.12-.64V5.03a.75.75 0 01.37-.64z"/></svg>Resume</>
                                            )}
                                        </button>
                                        <button 
                                            onClick={stopRecording}
                                            className="px-10 py-2.5 rounded-lg bg-[#0F172A] text-white text-[13px] font-bold hover:bg-black active:scale-95 transition-all shadow-lg flex items-center gap-2 border border-slate-800"
                                        >
                                            <div className="w-2.5 h-2.5 bg-red-500 rounded-sm" />
                                            Stop & Save
                                        </button>
                                    </div>
                                </div>
                            )}

                            {state === 'stopped' && audioBlob && (
                                <div className="w-full max-w-md space-y-8 animate-fade-in">
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-indigo-50 text-[#4F46E5] rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-100">
                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <h2 className="text-[18px] font-bold text-neutral-900 tracking-tight">Recording Finished</h2>
                                        <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mt-1">Ready to process</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider ml-1">Meeting Title</label>
                                            <input 
                                                type="text" 
                                                placeholder="e.g. Project Roadmap Sync" 
                                                className="w-full h-11 px-4 bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg text-[14px] font-medium focus:outline-none focus:ring-1 focus:ring-[#4F46E5] transition-all"
                                                value={meetingTitle}
                                                onChange={(e) => setMeetingTitle(e.target.value)}
                                            />
                                        </div>
                                        
                                        {!uploading ? (
                                            <div className="flex gap-3 pt-4">
                                                <button onClick={() => window.location.reload()} className="flex-1 h-11 text-[13px] font-bold text-neutral-500 hover:text-neutral-900 transition-colors uppercase tracking-widest">Discard</button>
                                                <Button onClick={handleSave} className="flex-[2] h-11 bg-[#4F46E5] text-white text-[13px] font-bold rounded-lg shadow-lg hover:bg-indigo-700 transition-all uppercase tracking-widest">Save & Process</Button>
                                            </div>
                                        ) : (
                                            <div className="space-y-3 pt-4">
                                                <div className="flex justify-between text-[11px] font-bold text-neutral-500 uppercase tracking-widest">
                                                    <span>Uploading...</span>
                                                    <span>{uploadProgress}%</span>
                                                </div>
                                                <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-[#4F46E5] transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Workspace Footer Info */}
                        <div className="bg-[#F8FAFC] border-t border-[#E5E7EB] px-8 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-[11px] text-neutral-400 font-bold uppercase tracking-tight">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                Audio Engine: Active
                            </div>
                            <div className="text-[11px] text-neutral-400 font-bold uppercase tracking-tight">
                                Secure End-to-End Processing
                            </div>
                        </div>
            </div>
        </div>
    );
}
