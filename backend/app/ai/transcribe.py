import io
from typing import List, Dict, Any
import assemblyai as aai
from app.core.config import settings

def transcribe_bytes_to_segments(data: bytes) -> Dict[str, Any]:
    """
    Transcribe audio bytes using AssemblyAI with speaker diarization.
    """
    if not settings.ASSEMBLYAI_API_KEY:
        raise ValueError("ASSEMBLYAI_API_KEY is not set in configuration")

    # Configure the API key
    aai.settings.api_key = settings.ASSEMBLYAI_API_KEY

    transcriber = aai.Transcriber()
    
    # Enable speaker labels (diarization)
    config = aai.TranscriptionConfig(
        speaker_labels=True,
        # We can enable auto language detection if desired, 
        # but for now we stick to default (usually English) or add generic support.
        # language_detection=True 
    )

    # Transcribe the buffer
    print(f"DEBUG: Sending {len(data)} bytes to AssemblyAI...")
    transcript = transcriber.transcribe(io.BytesIO(data), config=config)

    if transcript.status == aai.TranscriptStatus.error:
        print(f"ERROR: AssemblyAI error: {transcript.error}")
        raise RuntimeError(f"Transcription failed: {transcript.error}")

    print(f"DEBUG: AssemblyAI status: {transcript.status}, Text length: {len(transcript.text) if transcript.text else 0}")
    segments = []
    
    # Map utterances to our internal segment format
    if transcript.utterances:
        print(f"DEBUG: Found {len(transcript.utterances)} utterances")
        for utt in transcript.utterances:
            segments.append({
                "speaker": utt.speaker,
                "start_time": utt.start / 1000.0,
                "end_time": utt.end / 1000.0,
                "text": utt.text,
                "detected_language": "en"
            })
    elif transcript.text:
        print("DEBUG: No utterances found, using full text fallback")
        segments.append({
            "speaker": "unknown",
            "start_time": 0.0,
            "end_time": getattr(transcript, 'audio_duration', 0.0) or 0.0,
            "text": transcript.text,
            "detected_language": "en"
        })
    else:
        print("WARNING: Transcription returned no text or utterances")

    return {
        "segments": segments,
        "detected_language": "en"
    }
