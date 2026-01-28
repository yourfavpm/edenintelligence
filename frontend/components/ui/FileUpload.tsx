'use client';

import React, { useRef, useState, useCallback } from 'react';

// =============================================================================
// File Upload Component with Drag & Drop
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
        // Check file type
        const acceptedTypes = accept.flatMap((t) => {
            if (t.includes('*')) return []; // Can't validate wildcard precisely
            return [t];
        });

        // For now, allow if it starts with audio/ or video/
        const isAudio = file.type.startsWith('audio/');
        const isVideo = file.type.startsWith('video/');

        if (!isAudio && !isVideo) {
            return 'Please select an audio or video file';
        }

        // Check file size
        const sizeMB = file.size / (1024 * 1024);
        if (sizeMB > maxSizeMB) {
            return `File size must be less than ${maxSizeMB}MB`;
        }

        return null;
    };

    const handleFile = useCallback(
        (file: File) => {
            const error = validateFile(file);
            if (error) {
                setValidationError(error);
                setSelectedFile(null);
                return;
            }

            setValidationError(null);
            setSelectedFile(file);
            onFileSelect(file);
        },
        [maxSizeMB, onFileSelect]
    );

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);

            if (disabled || uploading) return;

            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
        },
        [disabled, uploading, handleFile]
    );

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    };

    const handleClick = () => {
        if (!disabled && !uploading) {
            inputRef.current?.click();
        }
    };

    const displayError = error || validationError;

    return (
        <div className="w-full">
            {/* Drop zone */}
            <button
                type="button"
                onClick={handleClick}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                disabled={disabled || uploading}
                className={`
          w-full p-8 border-2 border-dashed rounded-lg transition-colors text-center
          ${isDragging ? 'border-primary-400 bg-primary-50' : 'border-neutral-300'}
          ${disabled || uploading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:border-primary-400 hover:bg-neutral-50'}
          ${displayError ? 'border-error-300 bg-error-50' : ''}
        `}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept={accept.join(',')}
                    onChange={handleInputChange}
                    className="hidden"
                    disabled={disabled || uploading}
                />

                {uploading ? (
                    <div className="space-y-3">
                        <div className="w-12 h-12 mx-auto text-primary-500">
                            <svg className="animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                        </div>
                        <p className="text-sm font-medium text-neutral-700">Uploading...</p>
                        <div className="w-full max-w-xs mx-auto bg-neutral-200 rounded-full h-2">
                            <div
                                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <p className="text-xs text-neutral-500">{progress}% complete</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <div className="w-12 h-12 mx-auto text-neutral-400">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                />
                            </svg>
                        </div>
                        {selectedFile ? (
                            <>
                                <p className="text-sm font-medium text-neutral-900">
                                    {selectedFile.name}
                                </p>
                                <p className="text-xs text-neutral-500">
                                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                                </p>
                            </>
                        ) : (
                            <>
                                <p className="text-sm font-medium text-neutral-700">
                                    Drop your file here, or{' '}
                                    <span className="text-primary-600">browse</span>
                                </p>
                                <p className="text-xs text-neutral-500">
                                    Audio or video files up to {maxSizeMB}MB
                                </p>
                            </>
                        )}
                    </div>
                )}
            </button>

            {/* Error message */}
            {displayError && (
                <p className="mt-2 text-sm text-error-600">{displayError}</p>
            )}
        </div>
    );
}

export default FileUpload;
