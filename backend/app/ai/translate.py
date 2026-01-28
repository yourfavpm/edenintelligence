import json
from typing import List, Dict, Any

# Mock translation: preserve speaker, timestamps; replace text with pseudo-translation

def _mock_translate_text(text: str, target: str) -> str:
    # naive mock: append language tag
    return f"{text} [{target}]"


def translate_segments(segments: List[Dict[str, Any]], target_language: str) -> Dict[str, Any]:
    translated = []
    for s in segments:
        translated.append({
            "speaker": s.get("speaker"),
            "start_time": s.get("start_time"),
            "end_time": s.get("end_time"),
            "text": _mock_translate_text(s.get("text", ""), target_language),
            "detected_language": target_language,
        })
    return {"segments": translated, "target_language": target_language}
