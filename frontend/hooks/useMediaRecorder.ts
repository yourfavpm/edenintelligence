import { useState, useRef, useCallback, useEffect } from 'react';

export type RecordingState = 'idle' | 'recording' | 'paused' | 'stopped';

interface UseMediaRecorderOptions {
    onDataAvailable?: (blob: Blob) => void;
    onError?: (error: Error) => void;
}

interface UseMediaRecorderReturn {
    state: RecordingState;
    startRecording: () => Promise<void>;
    stopRecording: () => void;
    pauseRecording: () => void;
    resumeRecording: () => void;
    audioBlob: Blob | null;
    duration: number;
    error: string | null;
    isSupported: boolean;
    mediaStream: MediaStream | null;
}

export function useMediaRecorder(options: UseMediaRecorderOptions = {}): UseMediaRecorderReturn {
    const [state, setState] = useState<RecordingState>('idle');
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [duration, setDuration] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [isSupported] = useState(() => {
        return typeof window !== 'undefined' &&
            'MediaRecorder' in window &&
            navigator.mediaDevices?.getUserMedia !== undefined;
    });

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const streamRef = useRef<MediaStream | null>(null);
    const startTimeRef = useRef<number>(0);
    const pausedTimeRef = useRef<number>(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Get supported MIME type
    const getSupportedMimeType = useCallback((): string => {
        const types = [
            'audio/webm;codecs=opus',
            'audio/webm',
            'audio/ogg;codecs=opus',
            'audio/mp4',
            'audio/wav',
        ];

        for (const type of types) {
            if (MediaRecorder.isTypeSupported(type)) {
                return type;
            }
        }

        return ''; // Browser will use default
    }, []);

    // Update duration timer
    const updateDuration = useCallback(() => {
        if (state === 'recording' && startTimeRef.current > 0) {
            const elapsed = Date.now() - startTimeRef.current - pausedTimeRef.current;
            setDuration(Math.floor(elapsed / 1000));
        }
    }, [state]);

    // Start timer
    useEffect(() => {
        if (state === 'recording') {
            timerRef.current = setInterval(updateDuration, 1000);
        } else if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [state, updateDuration]);

    // Start recording
    const startRecording = useCallback(async () => {
        if (!isSupported) {
            const err = new Error('MediaRecorder is not supported in this browser');
            setError(err.message);
            options.onError?.(err);
            return;
        }

        try {
            setError(null);
            chunksRef.current = [];
            setAudioBlob(null);
            setDuration(0);
            pausedTimeRef.current = 0;

            // Request microphone access
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 44100,
                }
            });

            streamRef.current = stream;

            // Create MediaRecorder
            const mimeType = getSupportedMimeType();
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: mimeType || undefined,
                audioBitsPerSecond: 128000,
            });

            mediaRecorderRef.current = mediaRecorder;

            // Handle data available
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                    console.log(`DEBUG: Chunk received. Size: ${event.data.size}. Total chunks: ${chunksRef.current.length}`);
                }
            };

            // Handle stop
            mediaRecorder.onstop = () => {
                // Use the same mimeType logic as instantiation
                const blob = new Blob(chunksRef.current, {
                    type: mimeType || 'audio/webm'
                });
                console.log(`DEBUG: Recording finalized. Total chunks: ${chunksRef.current.length}, Final size: ${blob.size}, Type: ${blob.type}`);

                if (blob.size < 1000) {
                    console.warn('DEBUG: Generated suspiciously small blob!', {
                        size: blob.size,
                        chunks: chunksRef.current.length
                    });
                }

                setAudioBlob(blob);
                options.onDataAvailable?.(blob);

                // Clean up stream
                if (streamRef.current) {
                    streamRef.current.getTracks().forEach(track => track.stop());
                    streamRef.current = null;
                }
            };

            // Handle errors
            mediaRecorder.onerror = (event: Event) => {
                const err = new Error('MediaRecorder error occurred');
                setError(err.message);
                options.onError?.(err);
                setState('idle');
            };

            // Start recording
            mediaRecorder.start(1000); // Collect data every second
            startTimeRef.current = Date.now();
            setState('recording');
        } catch (err: any) {
            const errorMessage = err.name === 'NotAllowedError'
                ? 'Microphone permission denied. Please allow microphone access to record.'
                : err.name === 'NotFoundError'
                    ? 'No microphone found. Please connect a microphone and try again.'
                    : `Failed to start recording: ${err.message}`;

            setError(errorMessage);
            options.onError?.(new Error(errorMessage));
            setState('idle');
        }
    }, [isSupported, getSupportedMimeType, options]);

    // Stop recording
    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && state !== 'idle' && state !== 'stopped') {
            mediaRecorderRef.current.stop();
            setState('stopped');
        }
    }, [state]);

    // Pause recording
    const pauseRecording = useCallback(() => {
        if (mediaRecorderRef.current && state === 'recording') {
            mediaRecorderRef.current.pause();
            pausedTimeRef.current = Date.now() - startTimeRef.current;
            setState('paused');
        }
    }, [state]);

    // Resume recording
    const resumeRecording = useCallback(() => {
        if (mediaRecorderRef.current && state === 'paused') {
            mediaRecorderRef.current.resume();
            startTimeRef.current = Date.now() - pausedTimeRef.current;
            setState('recording');
        }
    }, [state]);

    // Cleanup on unmount only
    useEffect(() => {
        return () => {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
                mediaRecorderRef.current.stop();
            }
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };
    }, []); // Run ONLY on unmount

    return {
        state,
        startRecording,
        stopRecording,
        pauseRecording,
        resumeRecording,
        audioBlob,
        duration,
        error,
        isSupported,
        mediaStream: streamRef.current,
    };
}
