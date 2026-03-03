import assemblyai as aai
from typing import Dict, Any, List
from app.core.config import settings

def transcribe_bytes_to_segments(data: bytes) -> Dict[str, Any]:
    """
    Transcribe audio bytes using AssemblyAI SDK with speaker diarization.
    """
    if settings.ASSEMBLYAI_MOCK:
        print("DEBUG: ASSEMBLYAI_MOCK is enabled. Returning mock segments.")
        return {
            "segments": [
                {"speaker_id": "Speaker A", "start_time": 0.0, "end_time": 2.5, "original_text": "Hello and welcome to our weekly planning meeting."},
                {"speaker_id": "Speaker B", "start_time": 2.6, "end_time": 5.0, "original_text": "Thanks! I have the updates ready for the mobile app project."},
                {"speaker_id": "Speaker A", "start_time": 5.1, "end_time": 8.0, "original_text": "Great, let's start with the feature roadmap and the recent bug fixes."}
            ],
            "detected_language": "en"
        }

    if not settings.ASSEMBLYAI_API_KEY:
        raise ValueError("ASSEMBLYAI_API_KEY is not set in configuration")

    # set api key and increase timeout for stability
    aai.settings.api_key = settings.ASSEMBLYAI_API_KEY
    aai.settings.http_timeout = 60 # Default is often shorter; increased for handshake stability
    print(f"DEBUG: AssemblyAI http_timeout set to: {aai.settings.http_timeout}")

    # Use a transcriber
    transcriber = aai.Transcriber()

    # Configure options: enable speaker labels and specify model
    config = aai.TranscriptionConfig(
        speaker_labels=True,
        speech_models=["universal-3-pro"]
    )

    print("DEBUG: Uploading audio to AssemblyAI...")
    try:
        # We can pass bytes directly to transcribe
        transcript = transcriber.transcribe(data, config)
    except Exception as e:
        print(f"ERROR: AssemblyAI transcription failed: {str(e)}")
        # If we failed due to a connection error and want high robustness, 
        # we could potentially fall back to a mock here too, but for now 
        # let's only mock if explicitly asked via settings.
        raise RuntimeError(f"Transcription failed: {str(e)}")

    if transcript.status == aai.TranscriptStatus.error:
        raise RuntimeError(f"Transcription failed: {transcript.error}")

    print("DEBUG: Transcription completed. Processing segments...")

    segments = []
    # AssemblyAI returns 'utterances' for diarized speech
    if transcript.utterances:
        for utt in transcript.utterances:
            segments.append({
                "speaker_id": f"Speaker {utt.speaker}",
                "start_time": utt.start / 1000.0, # convert ms to seconds
                "end_time": utt.end / 1000.0,
                "original_text": utt.text
            })
    else:
        # Fallback if no utterances (e.g. no speech or diarization failed but text exists)
        # We can construct a single segment or use words if available
        # For now, let's just wrap the whole text
        if transcript.text:
             segments.append({
                "speaker_id": "UNKNOWN",
                "start_time": 0.0,
                "end_time": transcript.audio_duration if transcript.audio_duration else 0.0,
                "original_text": transcript.text
            })

    return {
        "segments": segments,
        "detected_language": transcript.language_code
    }
