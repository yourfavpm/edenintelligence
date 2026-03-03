
import unittest
from unittest.mock import MagicMock, patch
import sys
import os

# add app to path
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

# Mock dependencies that are not needed for this unit test
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
import assemblyai as aai

class TestAssemblyAITranscription(unittest.TestCase):

    @patch("app.ai.transcribe.aai.Transcriber")
    @patch("app.ai.transcribe.settings")
    def test_transcription_success(self, mock_settings, mock_transcriber_class):
        # Setup mock settings
        mock_settings.ASSEMBLYAI_API_KEY = "dummy_key"
        mock_settings.ASSEMBLYAI_MOCK = False

        # Setup mock transcriber instance
        mock_instance = MagicMock()
        mock_transcriber_class.return_value = mock_instance

        # Setup mock transcript response
        mock_transcript = MagicMock()
        mock_transcript.status = aai.TranscriptStatus.completed
        mock_transcript.text = "Hello world"
        mock_transcript.language_code = "en"
        
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
        # Check that api key was set on aai.settings
        self.assertEqual(aai.settings.api_key, "dummy_key")

        self.assertEqual(len(result["segments"]), 2)
        self.assertEqual(result["segments"][0]["speaker_id"], "Speaker A")
        self.assertEqual(result["segments"][0]["original_text"], "Hello")
        self.assertEqual(result["segments"][0]["start_time"], 0.0)
        self.assertEqual(result["segments"][0]["end_time"], 1.0)
        
        self.assertEqual(result["segments"][1]["speaker_id"], "Speaker B")
        self.assertEqual(result["segments"][1]["start_time"], 1.0)
        self.assertEqual(result["detected_language"], "en")

    @patch("app.ai.transcribe.settings")
    def test_missing_api_key(self, mock_settings):
        # Ensure it raises ValueError if key is missing
        mock_settings.ASSEMBLYAI_API_KEY = None
        mock_settings.ASSEMBLYAI_MOCK = False
        with self.assertRaises(ValueError):
            transcribe.transcribe_bytes_to_segments(b"data")

    @patch("app.ai.transcribe.aai.Transcriber")
    @patch("app.ai.transcribe.settings")
    def test_transcription_error(self, mock_settings, mock_transcriber_class):
        mock_settings.ASSEMBLYAI_API_KEY = "dummy_key"
        mock_settings.ASSEMBLYAI_MOCK = False
        mock_instance = MagicMock()
        mock_transcriber_class.return_value = mock_instance
        
        mock_transcript = MagicMock()
        mock_transcript.status = aai.TranscriptStatus.error
        mock_transcript.error = "Some error"
        mock_instance.transcribe.return_value = mock_transcript
        
        with self.assertRaises(RuntimeError):
            transcribe.transcribe_bytes_to_segments(b"data")

if __name__ == "__main__":
    unittest.main()
