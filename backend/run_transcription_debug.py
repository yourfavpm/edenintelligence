import sys
import os
import logging
import asyncio

# Add backend to path
sys.path.append(os.getcwd())

from app.tasks import process_transcription

# Configure logging to show info
logging.basicConfig(level=logging.INFO)

if __name__ == "__main__":
    # We use the AudioFile ID 22 from the previous successful upload test
    audio_id = 22
    print(f"--- Running process_transcription for Audio ID {audio_id} ---")
    
    # process_transcription is a Celery task, but we can call the underlying function
    # It takes (self, audio_id), but since we are calling it as a function not bound to a request
    # we might need to be careful. Celery tasks are also callable objects.
    # Calling .apply() executes it locally.
    
    try:
        # process_transcription calls async code internally using asyncio.run
        # We can just call it directly if it wasn't a bound task relying on 'self' for anything critical
        # except 'self.retry'.
        # Let's try calling it.
        process_transcription(audio_id)
        print("--- Execution Finished ---")
    except Exception as e:
        print(f"--- Execution Failed: {e} ---")
