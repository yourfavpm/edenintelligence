import modal
import os
from typing import Dict, Any

# Define the Modal image with all AI dependencies
image = (
    modal.Image.debian_slim()
    .apt_install("ffmpeg", "git")
    .pip_install(
        "whisperx",
        "pyannote.audio",
        "torch",
        "torchaudio",
        "openai",
        "pydantic-settings",
        "sqlalchemy",
        "asyncpg",
        "psycopg2-binary"
    )
)

app = modal.App("eden-ai-worker")

# Define a persistent volume for model caching
volume = modal.Volume.from_name("eden-models", create_if_missing=True)

@app.function(
    image=image,
    gpu="any",  # Request any available GPU (T4, A10G, etc.)
    volumes={"/root/.cache": volume},
    secrets=[modal.Secret.from_name("eden-secrets")],  # HF_TOKEN, OPENAI_API_KEY, DATABASE_URL
    timeout=600,
)
def transcribe_audio(audio_bytes: bytes) -> Dict[str, Any]:
    """Transcribe audio using WhisperX on a serverless GPU."""
    from app.ai.transcribe import transcribe_bytes_to_segments
    return transcribe_bytes_to_segments(audio_bytes)

@app.function(
    image=image,
    secrets=[modal.Secret.from_name("eden-secrets")],
)
def process_reasoning(transcript_id: int) -> Dict[str, Any]:
    """Run intent classification and extraction layers."""
    from app.ai.extract import extract_from_segments
    from app.ai.summarize import summarize_from_facts
    # Load transcript from DB and process...
    # (Implementation details will be finalized during deployment)
    return {"status": "success"}
