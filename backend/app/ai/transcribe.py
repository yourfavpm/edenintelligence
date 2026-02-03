import io
import os
import tempfile
from typing import List, Dict, Any
import torch
import whisperx
from app.core.config import settings

def transcribe_bytes_to_segments(data: bytes) -> Dict[str, Any]:
    """
    Transcribe audio bytes using WhisperX and pyannote.audio for diarization.
    """
    device = "cuda" if settings.USE_GPU and torch.cuda.is_available() else "cpu"
    batch_size = 16 # adjust as needed
    compute_type = "float16" if device == "cuda" else "int8"

    # Save bytes to a temporary file since whisperx/ffmpeg usually needs a file path
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
        tmp.write(data)
        tmp_path = tmp.name

    try:
        # 1. Transcribe with WhisperX
        print(f"DEBUG: Transcribing with WhisperX ({settings.WHISPER_MODEL}) on {device}...")
        model = whisperx.load_model(settings.WHISPER_MODEL, device, compute_type=compute_type)
        audio = whisperx.load_audio(tmp_path)
        result = model.transcribe(audio, batch_size=batch_size)
        
        # 2. Align whisper output
        print("DEBUG: Aligning transcription...")
        model_a, metadata = whisperx.load_align_model(language_code=result["language"], device=device)
        result = whisperx.align(result["segments"], model_a, metadata, audio, device, return_char_alignments=False)
        
        # 3. Diarization with pyannote.audio
        print("DEBUG: Running speaker diarization...")
        if not settings.HF_TOKEN:
            print("WARNING: HF_TOKEN is missing. Diarization might fail if using gated models.")
        
        diarize_model = whisperx.DiarizationPipeline(use_auth_token=settings.HF_TOKEN, device=device)
        diarize_segments = diarize_model(audio)
        
        # 4. Assign speaker labels to transcription segments
        print("DEBUG: Assigning speaker labels...")
        result = whisperx.assign_word_speakers(diarize_segments, result)

        segments = []
        for seg in result["segments"]:
            segments.append({
                "speaker_id": seg.get("speaker", "UNKNOWN"),
                "start_time": seg["start"],
                "end_time": seg["end"],
                "original_text": seg["text"].strip()
            })

        print(f"DEBUG: Pipeline completed. Found {len(segments)} segments.")
        return {
            "segments": segments,
            "detected_language": result["language"]
        }

    except Exception as e:
        print(f"ERROR: Transcription pipeline failed: {str(e)}")
        raise RuntimeError(f"Transcription failed: {str(e)}")
    finally:
        # Cleanup temp file
        if os.path.exists(tmp_path):
            os.remove(tmp_path)
