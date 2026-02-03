# Meeting Intelligence: AI Pipeline Documentation

This document describes the modular, self-hosted speech processing pipeline that replaces AssemblyAI.

## Stack Overview
- **Transcription**: [WhisperX](https://github.com/m-bain/whisperx) (OpenAI Whisper + Voice Activity Detection).
- **Diarization**: [pyannote.audio](https://github.com/pyannote/pyannote-audio).
- **Reasoning**: 5-Layer Accuracy Architecture (Normalization -> Intent Classification -> Evidence-Based Extraction -> Validation -> Fact-Based Summarization).

## 5-Layer Accuracy Architecture

### Layer 1: Speaker-Aware Transcript
The output of the transcription + diarization alignment.
```json
{
  "speaker_id": "SPEAKER_01",
  "start_time": 12.4,
  "end_time": 18.9,
  "original_text": "Let's move to the next agenda item."
}
```

### Layer 2: Statement Normalization
Cleans raw transcript segments by removing fillers and reducing ambiguity.

### Layer 3: Intent Classification
Every statement is classified into exactly one intent:
- `INFORMATION`, `QUESTION`, `PROPOSAL`, `DECISION`, `ACTION_ASSIGNMENT`, `RISK`, `MITIGATION`, `CLARIFICATION`, `OFF_TOPIC`.

### Layer 4: Evidence-Based Extraction
Insights are extracted *only* if they map to specific intents and meet mandatory field requirements (e.g., an owner for an action item).

### Layer 5: Validation & Consistency
Automated checks ensure no "hallucinated" or standalone items (e.g., no mitigation without a risk).

---

## Configuration & Setup

### Environment Variables (.env)
```env
WHISPER_MODEL=large-v3        # or large-v2, medium, etc.
HF_TOKEN=your_token           # Required for pyannote models
USE_GPU=False                 # Local GPU toggle
USE_MODAL_AI=False            # Production Hybrid Toggle
OPENAI_API_KEY=your_key        # Required for extraction layers
NEXT_PUBLIC_API_URL=http://... # Frontend API Base
CORS_ORIGINS=["https://..."]   # Allowed Frontend Domains
```

### Hybrid Cloud Strategy
For production, we use a hybrid approach to handle high-compute AI tasks:
1. **Frontend**: Deployed to **Vercel**.
2. **API Backend**: Deployed to a standard instance (Render, AWS App Runner, or Docker).
3. **AI Worker**: Deployed to **Modal.com** for serverless GPUs.

#### Setting up Modal.com
1. Install Modal: `pip install modal`
2. Configure Secrets in Modal Dashboard: `HF_TOKEN`, `OPENAI_API_KEY`, `DATABASE_URL`.
3. Deploy the worker: `modal deploy modal_worker.py`.
4. Enable `USE_MODAL_AI=True` in your backend environment variables to route tasks to Modal.

### System Dependencies
- **ffmpeg**: Required for audio processing. Install via `brew install ffmpeg`.

## Deployment Notes
The pipeline is designed to be environment-agnostic:
1. **Local/Standard**: Set `USE_MODAL_AI=False`. Tasks are processed by your local Celery worker.
2. **High-Performance**: Set `USE_MODAL_AI=True`. Tasks are routed to serverless GPUs on Modal.com.

---

## Accuracy Metrics
- **Timestamp Drift**: Guaranteed < 300ms by WhisperX forced alignment.
- **Diarization**: High accuracy using `pyannote/speaker-diarization-3.1`.
- **Summarization**: Hallucination-free by deriving summaries exclusively from Layer 4 extraction results.
