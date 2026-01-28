AI adapters should implement interfaces used by `app.ai.pipeline` and be production-ready:
- Handle rate limits
- Support streaming where possible
- Return structured outputs (speaker-attributed transcript, timestamps, confidences)

Start by implementing a Whisper local adapter or OpenAI/Whisper API integration.
