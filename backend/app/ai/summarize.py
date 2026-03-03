import json
from typing import List, Dict, Any
from app.ai import extract
from app.core.config import settings

def summarize_from_segments(segments: List[Dict[str, Any]], length: str = "short", tone: str = "formal") -> Dict[str, Any]:
    """
    Return structured summary dict by first extracting validated facts and then 
    using an LLM to generate a natural language summary.
    """
    # 1. Run the 5-Layer Accuracy Extraction
    extraction_res = extract.extract_from_segments(segments)
    
    # 2. Derive summary specifically from these facts
    actions = extraction_res.get("actions", [])
    decisions = extraction_res.get("decisions", [])
    risks = extraction_res.get("risks", [])
    
    fact_context = f"""
    Actions: {json.dumps(actions)}
    Decisions: {json.dumps(decisions)}
    Risks: {json.dumps(risks)}
    """

    if not settings.OPENAI_API_KEY:
        print("WARNING: OPENAI_API_KEY is missing. Using structured fallback.")
        summary_text = f"Meeting insights derived from validated segments. Summary of validated facts: {len(actions)} actions, {len(decisions)} decisions, {len(risks)} risks."
    else:
        # Prompt for LLM to generate a natural language summary
        prompt = f"""
        Generate a {length} natural language executive summary for a meeting with a {tone} tone.
        Base the summary exclusively on the following extracted facts:
        
        {fact_context}
        
        Provide additional context if available in the raw segments:
        {json.dumps([s.get("original_text", "") for s in segments[:10]])} ...
        
        Return a JSON object with key 'executive_summary'.
        """
        system_prompt = "You are a professional secretary. Write a concise, high-impact executive summary."
        
        response_text = extract._call_llm(prompt, system_prompt)
        try:
            summary_data = json.loads(response_text)
            summary_text = summary_data.get("executive_summary", "Meeting insights derived from validated segments.")
        except:
            summary_text = "Meeting insights derived from validated segments."

    return {
        "executive_summary": summary_text,
        "key_points": [a["task"] for a in actions[:3]] + [d["decision"] for d in decisions[:2]],
        "decisions": [d.get("decision", "") for d in decisions],
        "risks": [r.get("risk", "") for r in risks],
        "length": length,
        "tone": tone
    }
