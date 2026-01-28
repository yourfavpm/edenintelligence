import re
import json
from typing import List, Dict, Any
from datetime import datetime

# Mock intelligence extractor: action items, owners, due dates, decisions, confidence

def _find_due_date(text: str) -> str | None:
    # naive: look for patterns like 'by YYYY-MM-DD' or 'by <date word>'
    m = re.search(r"by\s+(\d{4}-\d{2}-\d{2})", text)
    if m:
        return m.group(1)
    # look for 'by Friday', 'by next week' (leave as text)
    m2 = re.search(r"by\s+([A-Za-z0-9\s]+)", text)
    if m2:
        return m2.group(1).strip()
    return None


def _find_owner(text: str) -> str | None:
    # naive: look for 'to Alice', 'assign to Bob', '@alice'
    m = re.search(r"assign to\s+([A-Za-z0-9_\-]+)", text, re.IGNORECASE)
    if m:
        return m.group(1)
    m2 = re.search(r"to\s+([A-Za-z0-9_\-]+)", text)
    if m2:
        # ignore 'to discuss' etc by simple heuristic length
        candidate = m2.group(1)
        if len(candidate) < 40:
            return candidate
    m3 = re.search(r"@([A-Za-z0-9_\-]+)", text)
    if m3:
        return m3.group(1)
    return None


def _is_decision(text: str) -> bool:
    return bool(re.search(r"\b(decide|decision|decided|we will|approved|approved)\b", text, re.IGNORECASE))


def _extract_candidates(segments: List[Dict[str, Any]]) -> List[str]:
    # collect sentences across segments
    candidates = []
    for s in segments:
        t = s.get("text", "")
        # split into sentences
        parts = re.split(r"(?<=[.!?])\s+", t)
        for p in parts:
            p = p.strip()
            if p:
                candidates.append(p)
    return candidates


def extract_from_segments(segments: List[Dict[str, Any]]) -> Dict[str, Any]:
    candidates = _extract_candidates(segments)
    items = []
    for c in candidates:
        # heuristics: look for action verbs or 'action:' markers
        if re.search(r"\b(assign|action|todo|follow up|follow-up|we will|should|will)\b", c, re.IGNORECASE):
            owner = _find_owner(c)
            due = _find_due_date(c)
            decision = _is_decision(c)
            # confidence heuristic: higher if explicit owner or 'action' keyword
            confidence = 0.6
            if owner:
                confidence += 0.2
            if 'action' in c.lower() or 'todo' in c.lower():
                confidence += 0.1
            confidence = min(1.0, confidence)
            items.append({
                "text": c,
                "owner": owner,
                "due_date": due,
                "decision": decision,
                "confidence": round(confidence, 2),
            })
    # aggregate confidence as mean
    overall_conf = None
    if items:
        overall_conf = round(sum(i["confidence"] for i in items) / len(items), 3)
    return {"items": items, "confidence": overall_conf}
