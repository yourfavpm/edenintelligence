# AI Backends

Place concrete adapters for Speech-to-Text, Translation, and LLM summarization here.

Suggested layout:

- `app/ai/backends/stt.py` - implements `transcribe(audio_path) -> Transcript` using Whisper or cloud STT.
- `app/ai/backends/translate.py` - implements `translate(text, target_lang) -> translated_text`.
- `app/ai/backends/llm.py` - implements `summarize(transcript, language) -> {summary, action_items, decisions}`.

Adapters should be idempotent and handle retries gracefully.
