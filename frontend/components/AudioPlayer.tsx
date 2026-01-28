'use client';

import React, { useRef, useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface AudioPlayerProps {
    audioId: number;
    filename?: string;
}

export default function AudioPlayer({ audioId, filename }: AudioPlayerProps) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [blobUrl, setBlobUrl] = useState<string | null>(null);

    // Use the base URL from apiService
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
                setLoading(false);
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
    }, []);

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

    const formatTime = (seconds: number) => {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (error) {
        return (
            <div className="bg-error-50 border border-error-200 rounded-lg p-4 text-error-700 text-sm">
                {error}
            </div>
        );
    }

    return (
        <div className="bg-white border border-neutral-200 rounded-lg p-4 shadow-sm">
            {blobUrl && <audio ref={audioRef} src={blobUrl} preload="metadata" />}

            <div className="flex items-center gap-4">
                {/* Play/Pause Button */}
                <button
                    onClick={togglePlay}
                    disabled={loading}
                    className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-300 text-white rounded-full transition-colors"
                >
                    {loading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    ) : isPlaying ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    )}
                </button>

                {/* Progress Bar */}
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-neutral-600">
                            {formatTime(currentTime)}
                        </span>
                        <input
                            type="range"
                            min="0"
                            max={duration || 0}
                            value={currentTime}
                            onChange={handleSeek}
                            disabled={loading}
                            className="flex-1 h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-600 [&::-webkit-slider-thumb]:cursor-pointer"
                        />
                        <span className="text-xs font-medium text-neutral-600">
                            {formatTime(duration)}
                        </span>
                    </div>
                    {filename && (
                        <p className="text-xs text-neutral-500 truncate">{filename}</p>
                    )}
                </div>
            </div>
        </div>
    );
}
