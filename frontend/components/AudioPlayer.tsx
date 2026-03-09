'use client';

import React, { useRef, useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Play, Pause, RotateCcw, Volume2, FastForward, PlayCircle } from 'lucide-react';

interface AudioPlayerProps {
    audioId: number;
    filename?: string;
    onTimeUpdate?: (time: number) => void;
}

export default function AudioPlayer({ audioId, filename, onTimeUpdate }: AudioPlayerProps) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [playbackRate, setPlaybackRate] = useState(1);

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
                <RotateCcw className="w-4 h-4" />
                {error}
            </div>
        );
    }

    return (
        <div className="bg-[#0A1B3D] border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#6C63FF] opacity-5 rounded-full -translate-y-1/2 translate-x-1/2" />
            
            {blobUrl && <audio ref={audioRef} src={blobUrl} preload="metadata" />}

            <div className="relative z-10 space-y-6">
                {/* Top: Metadata & Filename */}
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[#A5A0FF]">
                            <PlayCircle size={18} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[12px] font-bold text-white truncate px-1">
                                {filename || 'Meeting Recording'}
                            </p>
                            <p className="text-[10px] text-[#A5A0FF] font-bold uppercase tracking-widest px-1 mt-0.5">
                                Professional Workspace
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Controls Row */}
                <div className="flex items-center gap-6">
                    {/* Play/Pause Button */}
                    <button
                        onClick={togglePlay}
                        disabled={loading}
                        className="flex-shrink-0 w-14 h-14 flex items-center justify-center bg-[#6C63FF] hover:bg-[#A5A0FF] disabled:bg-white/10 text-white rounded-full transition-all shadow-lg shadow-[#6C63FF]/20 hover:scale-105 active:scale-95"
                    >
                        {loading ? (
                            <div className="animate-spin rounded-full h-6 w-6 border-2 border-white/30 border-t-white" />
                        ) : isPlaying ? (
                            <Pause size={24} fill="currentColor" />
                        ) : (
                            <Play size={24} fill="currentColor" className="ml-1" />
                        )}
                    </button>

                    {/* Progress Area */}
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-bold text-white/40 font-mono tracking-tighter">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                        <div className="relative group/range h-1.5 flex items-center">
                            <input
                                type="range"
                                min="0"
                                max={duration || 0}
                                value={currentTime}
                                onChange={handleSeek}
                                disabled={loading}
                                className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer outline-none overflow-hidden z-10
                                          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-1 [&::-webkit-slider-thumb]:h-1 [&::-webkit-slider-thumb]:bg-[#6C63FF]
                                          [&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:rounded-full"
                            />
                            {/* Track Fill */}
                            <div 
                                className="absolute left-0 top-0 bottom-0 bg-[#6C63FF] rounded-full pointer-events-none transition-all duration-100"
                                style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Quick Settings Row */}
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={changePlaybackRate}
                            className="h-10 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-[12px] font-bold font-mono transition-all border border-white/5"
                        >
                            {playbackRate}x
                        </button>
                        <button className="h-10 w-10 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition-all border border-white/5">
                            <Volume2 size={18} />
                        </button>
                    </div>
                </div>
                
                {/* Waveform Visualization Placeholder */}
                <div className="h-8 flex items-end gap-[3px] opacity-20 group-hover:opacity-40 transition-opacity">
                    {Array.from({ length: 120 }).map((_, i) => {
                        const h = Math.random() * (isPlaying ? 100 : 20) + 10;
                        return (
                            <div 
                                key={i} 
                                className="flex-1 bg-gradient-to-t from-[#6C63FF] to-[#A5A0FF] rounded-full transition-all duration-300" 
                                style={{ height: `${h}%` }}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
