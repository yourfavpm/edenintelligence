
import unittest
from unittest.mock import MagicMock, patch
import sys
import os

# add app to path
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

# Mock dependencies that are not needed for this unit test
import sys
from unittest.mock import MagicMock

sys.modules["celery"] = MagicMock()
sys.modules["celery.utils.log"] = MagicMock()
sys.modules["celery_app"] = MagicMock()
sys.modules["app.db"] = MagicMock()
sys.modules["app.storage"] = MagicMock()
sys.modules["app.core.crypto"] = MagicMock()
sys.modules["sqlalchemy"] = MagicMock()
sys.modules["sqlalchemy.ext.asyncio"] = MagicMock()
sys.modules["sqlalchemy.orm"] = MagicMock()
sys.modules["app.models"] = MagicMock()
sys.modules["app.models.models"] = MagicMock()

# Now imports can proceed safely
from app.ai import transcribe
from app.core.config import settings

class TestAssemblyAITranscription(unittest.TestCase):

    @patch("app.ai.transcribe.aai.Transcriber")
    @patch("app.ai.transcribe.settings")
    def test_transcription_success(self, mock_settings, mock_transcriber_class):
        # Setup mock settings
        mock_settings.ASSEMBLYAI_API_KEY = "dummy_key"

        # Setup mock transcriber instance
        mock_instance = MagicMock()
        mock_transcriber_class.return_value = mock_instance

        # Setup mock transcript response
        mock_transcript = MagicMock()
        mock_transcript.status = "completed"
        mock_transcript.text = "Hello world"
        
        # Mock utterances
        utt1 = MagicMock()
        utt1.speaker = "A"
        utt1.start = 0
        utt1.end = 1000
        utt1.text = "Hello"
        
        utt2 = MagicMock()
        utt2.speaker = "B"
        utt2.start = 1000
        utt2.end = 2000
        utt2.text = "World"

        mock_transcript.utterances = [utt1, utt2]
        mock_instance.transcribe.return_value = mock_transcript

        # Run function
        data = b"fake_audio_bytes"
        result = transcribe.transcribe_bytes_to_segments(data)

        # Assertions
        self.assertEqual(len(result["segments"]), 2)
        self.assertEqual(result["segments"][0]["speaker"], "A")
        self.assertEqual(result["segments"][0]["text"], "Hello")
        self.assertEqual(result["segments"][0]["start_time"], 0.0)
        self.assertEqual(result["segments"][0]["end_time"], 1.0)
        
        self.assertEqual(result["segments"][1]["speaker"], "B")
        self.assertEqual(result["segments"][1]["start_time"], 1.0)

    @patch("app.ai.transcribe.settings")
    def test_missing_api_key(self, mock_settings):
        # Ensure it raises ValueError if key is missing
        mock_settings.ASSEMBLYAI_API_KEY = None
        with self.assertRaises(ValueError):
            transcribe.transcribe_bytes_to_segments(b"data")

if __name__ == "__main__":
    unittest.main()
