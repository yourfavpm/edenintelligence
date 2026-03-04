'use client';

import React, { useRef, useState, useCallback } from 'react';

// =============================================================================
// File Upload Component - High-Density Enterprise Redesign
// =============================================================================

interface FileUploadProps {
    onFileSelect: (file: File) => void;
    accept?: string[];
    maxSizeMB?: number;
    disabled?: boolean;
    uploading?: boolean;
    progress?: number;
    error?: string | null;
}

export function FileUpload({
    onFileSelect,
    accept = ['audio/*', 'video/*'],
    maxSizeMB = 500,
    disabled = false,
    uploading = false,
    progress = 0,
    error = null,
}: FileUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [validationError, setValidationError] = useState<string | null>(null);

    const validateFile = (file: File): string | null => {
        const isAudio = file.type.startsWith('audio/') || file.name.endsWith('.mp3') || file.name.endsWith('.wav') || file.name.endsWith('.m4a');
        const isVideo = file.type.startsWith('video/') || file.name.endsWith('.mp4');

        if (!isAudio && !isVideo) {
            return 'Unsupported format. Please use MP3, WAV, M4A, or MP4.';
        }

        const sizeMB = file.size / (1024 * 1024);
        if (sizeMB > maxSizeMB) {
            return `File exceeds ${maxSizeMB}MB limit.`;
        }
        return null;
    };

    const handleFile = useCallback((file: File) => {
        const err = validateFile(file);
        if (err) {
            setValidationError(err);
            setSelectedFile(null);
            return;
        }
        setValidationError(null);
        setSelectedFile(file);
        onFileSelect(file);
    }, [maxSizeMB, onFileSelect]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (disabled || uploading) return;
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    }, [disabled, uploading, handleFile]);

    const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    };

    const displayError = error || validationError;

    return (
        <div className="w-full">
            <button
                type="button"
                onClick={() => !disabled && !uploading && inputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                disabled={disabled || uploading}
                className={`
                    w-full min-h-[180px] border-2 border-dashed rounded-xl transition-all flex flex-col items-center justify-center p-6
                    ${isDragging ? 'border-[#4F46E5] bg-indigo-50/30' : 'border-[#E5E7EB] bg-[#F8FAFC]'}
                    ${disabled || uploading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:border-[#4F46E5]/40 hover:bg-white active:scale-[0.99]'}
                    ${displayError ? 'border-red-200 bg-red-50/30' : ''}
                `}
            >
                <input ref={inputRef} type="file" accept={accept.join(',')} onChange={handleInputChange} className="hidden" disabled={disabled || uploading} />

                {uploading ? (
                    <div className="w-full max-w-xs space-y-4">
                        <div className="flex justify-between items-center text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                            <span>Ingesting Pipeline</span>
                            <span>{progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                            <div className="h-full bg-[#4F46E5] transition-all duration-300" style={{ width: `${progress}%` }} />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div className="w-10 h-10 bg-white border border-[#E5E7EB] rounded-lg shadow-sm flex items-center justify-center mx-auto text-neutral-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                        </div>
                        {selectedFile ? (
                            <div className="text-center">
                                <p className="text-[13px] font-bold text-neutral-900 truncate max-w-[200px]">{selectedFile.name}</p>
                                <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">{(selectedFile.size / (1024 * 1024)).toFixed(1)} MB • Ready</p>
                            </div>
                        ) : (
                            <div className="text-center">
                                <p className="text-[13px] font-bold text-neutral-800">Drag recording here or <span className="text-[#4F46E5]">browse</span></p>
                                <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1">MP3, WAV, M4A, MP4 (Max 500MB)</p>
                            </div>
                        )}
                    </div>
                )}
            </button>
            {displayError && (
                <div className="mt-3 flex items-center gap-2 text-red-600 text-[11px] font-bold px-1">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                    {displayError}
                </div>
            )}
        </div>
    );
}

export default FileUpload;
