'use client';

import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
    stream: MediaStream | null;
    isRecording: boolean;
}

export default function AudioVisualizer({ stream, isRecording }: AudioVisualizerProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);

    useEffect(() => {
        if (!stream || !isRecording || !canvasRef.current) {
            // Clean up
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
                animationRef.current = null;
            }
            if (audioContextRef.current) {
                audioContextRef.current.close();
                audioContextRef.current = null;
            }
            return;
        }

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        canvas.width = canvas.offsetWidth * window.devicePixelRatio;
        canvas.height = canvas.offsetHeight * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

        // Create audio context and analyser
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaStreamSource(stream);

        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.8;
        source.connect(analyser);

        audioContextRef.current = audioContext;
        analyserRef.current = analyser;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        // Draw visualization
        const draw = () => {
            if (!isRecording) return;

            animationRef.current = requestAnimationFrame(draw);

            analyser.getByteFrequencyData(dataArray);

            // Clear canvas
            ctx.fillStyle = 'rgb(250, 250, 250)';
            ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

            // Calculate bar width
            const barWidth = (canvas.offsetWidth / bufferLength) * 2.5;
            let barHeight;
            let x = 0;

            // Draw bars
            for (let i = 0; i < bufferLength; i++) {
                barHeight = (dataArray[i] / 255) * (canvas.offsetHeight * 0.8);

                // Gradient color based on frequency
                const hue = (i / bufferLength) * 120 + 200; // Blue to purple gradient
                ctx.fillStyle = `hsl(${hue}, 70%, 60%)`;

                // Draw bar from bottom
                const y = canvas.offsetHeight - barHeight;
                ctx.fillRect(x, y, barWidth, barHeight);

                x += barWidth + 1;
            }
        };

        draw();

        // Cleanup
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, [stream, isRecording]);

    return (
        <div className="w-full h-32 bg-neutral-50 rounded-xl border border-neutral-200 overflow-hidden">
            <canvas
                ref={canvasRef}
                className="w-full h-full"
                style={{ display: isRecording ? 'block' : 'none' }}
            />
            {!isRecording && (
                <div className="w-full h-full flex items-center justify-center">
                    <p className="text-sm text-neutral-400">Audio visualization will appear here</p>
                </div>
            )}
        </div>
    );
}
