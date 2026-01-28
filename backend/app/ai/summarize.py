import json
from typing import List, Dict, Any

# Prompt templates
PROMPTS = {
    "short": "Provide a concise executive summary (1-2 sentences), key points (3 bullets), decisions (if any), and risks/blocks.",
    "medium": "Provide an executive summary (3-4 sentences), key points (5 bullets), decisions (list), and risks/blocks with brief context.",
    "long": "Provide a detailed executive summary, key points, decisions, and risks with rationale and recommended next steps.",
}


def _extract_candidates_from_segments(segments: List[Dict[str, Any]]) -> List[str]:
    # simple heuristic: return sentences from segment texts
    texts = [s.get("text", "") for s in segments]
    candidates = []
    for t in texts:
        # split on period, exclamation, question
        parts = [p.strip() for p in t.replace("!", ".").replace("?", ".").split(".") if p.strip()]
        candidates.extend(parts)
    return candidates


def _mock_llm_summarize(segments: List[Dict[str, Any]], length: str, tone: str) -> Dict[str, Any]:
    # Very lightweight mock: pick candidates and format output according to prompt
    candidates = _extract_candidates_from_segments(segments)
    if not candidates:
        exec_summary = "No transcribed content to summarize."
        key_points = []
        decisions = []
        risks = []
    else:
        # executive summary: join first N candidates
        n_exec = {"short": 1, "medium": 3, "long": 5}.get(length, 1)
        exec_summary = " ".join(candidates[:n_exec])
        # key points: pick up to 5 distinct candidates
        kp = []
        seen = set()
        for c in candidates:
            if c not in seen:
                kp.append(c)
                seen.add(c)
            if len(kp) >= 5:
                break
        # decisions: heuristic extract lines containing decision words
        decisions = [c for c in candidates if any(w in c.lower() for w in ("decide", "decision", "we will", "action:"))]
        # risks: heuristic extract lines containing risk words
        risks = [c for c in candidates if any(w in c.lower() for w in ("risk", "blocker", "blocked", "issue"))]
        key_points = kp
        # embellish based on tone
        if tone == "formal":
            exec_summary = exec_summary
        else:
            exec_summary = exec_summary

    return {
        "executive_summary": exec_summary,
        "key_points": key_points,
        "decisions": decisions,
        "risks": risks,
    }


def summarize_from_segments(segments: List[Dict[str, Any]], length: str = "short", tone: str = "formal") -> Dict[str, Any]:
    """Return structured summary dict given transcript segments.
    Output keys: executive_summary, key_points (list), decisions (list), risks (list), length, tone
    """
    out = _mock_llm_summarize(segments, length, tone)
    out.update({"length": length, "tone": tone})
    return out
