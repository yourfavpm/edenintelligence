'use client';

import React, { useRef, useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Play, Pause, Volume2, PlayCircle, Maximize2, Minimize2, X } from 'lucide-react';

interface AudioPlayerProps {
    audioId: number;
    filename?: string;
    onTimeUpdate?: (time: number) => void;
}

export default function AudioPlayer({ audioId, filename, onTimeUpdate }: AudioPlayerProps) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [isFloating, setIsFloating] = useState(false);
    const [userClosedFloating, setUserClosedFloating] = useState(false);

    const [blobUrl, setBlobUrl] = useState<string | null>(null);

    const audioUrl = `${apiService.baseURL}/audio/${audioId}/download`;

    useEffect(() => {
        let active = true;

        async function loadAudio() {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem('access_token');
                const response = await fetch(audioUrl, {
                    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
                });

                if (!response.ok) {
                    throw new Error(`Failed to load audio: ${response.statusText}`);
                }

                const blob = await response.blob();
                if (!active) return;

                const url = URL.createObjectURL(blob);
                setBlobUrl(url);
            } catch (err: any) {
                if (active) {
                    setError(err.message || 'Failed to load audio file');
                    setLoading(false);
                }
            }
        }

        loadAudio();

        return () => {
            active = false;
            if (blobUrl) {
                URL.revokeObjectURL(blobUrl);
            }
        };
    }, [audioId]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !blobUrl) return;

        const handleLoadedMetadata = () => {
            setDuration(audio.duration);
            setLoading(false);
        };

        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
            onTimeUpdate?.(audio.currentTime);
        };

        const handleEnded = () => {
            setIsPlaying(false);
        };

        const handleError = () => {
            setError('Failed to load audio file');
            setLoading(false);
        };

        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('error', handleError);

        return () => {
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('error', handleError);
        };
    }, [blobUrl, onTimeUpdate]);

    useEffect(() => {
        const handleScroll = () => {
            if (userClosedFloating) return;
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                // If the user scrolls past the container
                if (rect.bottom < 0 && !isFloating) {
                    setIsFloating(true);
                } else if (rect.bottom >= 0 && isFloating) {
                    setIsFloating(false);
                    setUserClosedFloating(false); // Reset if they scroll back up
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isFloating, userClosedFloating]);

    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const audio = audioRef.current;
        if (!audio) return;

        const newTime = parseFloat(e.target.value);
        audio.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const changePlaybackRate = () => {
        const rates = [1, 1.2, 1.5, 2];
        const nextRate = rates[(rates.indexOf(playbackRate) + 1) % rates.length];
        setPlaybackRate(nextRate);
        if (audioRef.current) {
            audioRef.current.playbackRate = nextRate;
        }
    };

    const formatTime = (seconds: number) => {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-[13px] font-medium flex items-center gap-3">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {error}
            </div>
        );
    }

    const MainPlayerContent = () => (
        <div className="flex items-center gap-4 lg:gap-6 bg-white border border-[#E5E7EB] rounded-2xl p-4 lg:p-5 shadow-sm">
            {blobUrl && <audio ref={audioRef} src={blobUrl} preload="metadata" />}
            
            {/* Play/Pause */}
            <button
                onClick={togglePlay}
                disabled={loading}
                className="flex-shrink-0 w-12 h-12 lg:w-14 lg:h-14 flex items-center justify-center bg-[#6C63FF] hover:bg-[#5A52D5] disabled:bg-[#E5E7EB] text-white rounded-full transition-all shadow-md shadow-[#6C63FF]/20 hover:scale-105 active:scale-95"
            >
                {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 lg:h-6 lg:w-6 border-2 border-white/30 border-t-white" />
                ) : isPlaying ? (
                    <Pause size={20} fill="currentColor" />
                ) : (
                    <Play size={20} fill="currentColor" className="ml-1" />
                )}
            </button>

            {/* Info & Progress */}
            <div className="flex-1 min-w-0 space-y-1">
                <div className="hidden sm:flex justify-between items-center">
                     <p className="text-[14px] font-bold text-[#1F2937] truncate">
                        {filename || 'Meeting Recording'}
                    </p>
                    <div className="flex items-center gap-2 text-[12px] font-bold text-[#6B7280] font-mono tracking-tight">
                        <span>{formatTime(currentTime)}</span>
                        <span>/</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>

                <div className="relative group/range h-2 flex items-center w-full mt-2">
                    <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        value={currentTime}
                        onChange={handleSeek}
                        disabled={loading}
                        className="w-full h-2 bg-[#F7F8FB] border border-[#E5E7EB] rounded-full appearance-none cursor-pointer outline-none overflow-hidden z-10
                                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-0 [&::-webkit-slider-thumb]:h-0
                                  [&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:rounded-full"
                    />
                    {/* Track Fill */}
                    <div 
                        className="absolute left-0 top-0 bottom-0 bg-[#6C63FF] rounded-full pointer-events-none transition-all duration-100"
                        style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                    />
                </div>
            </div>

            {/* Quick Settings */}
            <div className="flex items-center gap-2">
                <button 
                    onClick={changePlaybackRate}
                    className="h-10 px-3 rounded-xl bg-[#F7F8FB] hover:bg-[#E5E7EB] text-[#4B5563] text-[13px] font-bold font-mono transition-all border border-[#E5E7EB]"
                >
                    {playbackRate}x
                </button>
            </div>
        </div>
    );

    const FloatingPlayerContent = () => (
        <div className="fixed bottom-6 right-6 z-50 bg-white border border-[#E5E7EB] rounded-2xl p-3 shadow-2xl animate-fade-in flex items-center gap-4 min-w-[320px] max-w-[400px]">
             {/* Close Button */}
             <button 
                onClick={() => { setIsFloating(false); setUserClosedFloating(true); }}
                className="absolute -top-3 -right-3 w-7 h-7 bg-white border border-[#E5E7EB] rounded-full text-neutral-400 hover:text-neutral-700 flex items-center justify-center shadow-sm"
             >
                 <X size={14} />
             </button>

             <button
                onClick={togglePlay}
                disabled={loading}
                className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-[#6C63FF] hover:bg-[#5A52D5] text-white rounded-full transition-all shadow-md shadow-[#6C63FF]/20"
            >
                {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
                ) : isPlaying ? (
                    <Pause size={16} fill="currentColor" />
                ) : (
                    <Play size={16} fill="currentColor" className="ml-0.5" />
                )}
            </button>

            <div className="flex-1 min-w-0">
                <p className="text-[12px] font-bold text-[#1F2937] truncate mb-1">
                    {filename || 'Meeting'}
                </p>
                 <div className="relative group/range h-1 flex items-center w-full">
                    <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        value={currentTime}
                        onChange={handleSeek}
                        disabled={loading}
                        className="w-full h-1 bg-[#F7F8FB] rounded-full appearance-none cursor-pointer outline-none overflow-hidden z-10 opacity-0"
                    />
                    <div className="absolute left-0 right-0 h-1 bg-[#F7F8FB] rounded-full border border-[#E5E7EB]" />
                    <div 
                        className="absolute left-0 top-0 bottom-0 bg-[#6C63FF] rounded-full pointer-events-none transition-all duration-100"
                        style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                    />
                </div>
            </div>

            <div className="text-[10px] font-bold text-[#6B7280] font-mono tracking-tight shrink-0">
                {formatTime(currentTime)}
            </div>
        </div>
    );

    return (
        <>
            <div ref={containerRef} className="w-full relative">
                <MainPlayerContent />
            </div>
            {isFloating && <FloatingPlayerContent />}
        </>
    );
}
