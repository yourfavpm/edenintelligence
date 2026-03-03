import json
import re
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from app.core.config import settings

# --- Data Models ---

class NormalizedStatement(BaseModel):
    original_segment_id: str
    normalized_text: str
    confidence: float

class IntentClassification(BaseModel):
    segment_id: str
    intent: str  # INFORMATION, QUESTION, PROPOSAL, DECISION, ACTION_ASSIGNMENT, RISK, MITIGATION, CLARIFICATION, OFF_TOPIC
    confidence: float

class ActionItem(BaseModel):
    owner: str
    task: str
    deadline: Optional[str] = None
    source_segments: List[str]

class Decision(BaseModel):
    decision: str
    approved_by: List[str]
    evidence_segments: List[str]

class Risk(BaseModel):
    risk: str
    impact: str
    evidence_segment: str

class ExtractionResult(BaseModel):
    actions: List[ActionItem] = []
    decisions: List[Decision] = []
    risks: List[Risk] = []
    summary: str = ""
    status: str = "complete"
    reason: Optional[str] = None

# --- Helper Functions (LLM-based layers) ---

def _call_llm(prompt: str, system_prompt: str = "You are a helpful meeting assistant.") -> str:
    """
    Helper to call OpenAI (or other LLM) for reasoning layers.
    """
    if not settings.OPENAI_API_KEY:
        print("WARNING: OPENAI_API_KEY is missing. Using mock LLM response.")
        return "{}" # Fallback for mocks if needed
    
    try:
        from openai import OpenAI
        client = OpenAI(api_key=settings.OPENAI_API_KEY)
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"}
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"ERROR: LLM call failed: {str(e)}")
        return "{}"

# --- Layer 2: Statement Normalization ---

def normalize_statements(segments: List[Dict[str, Any]]) -> List[NormalizedStatement]:
    """
    Normalize speech into atomic statements (remove fillers, reduce ambiguity).
    """
    normalized = []
    for seg in segments:
        text = seg.get("original_text", seg.get("text", ""))
        # Simple cleanup as a baseline, but ideally uses LLM
        clean_text = text.replace("um,", "").replace("uh,", "").replace("like,", "").strip()
        normalized.append(NormalizedStatement(
            original_segment_id=str(seg.get("start_time", 0)), # Using start_time as ID if missing
            normalized_text=clean_text,
            confidence=1.0
        ))
    return normalized

# --- Layer 3: Intent Classification ---

def classify_intents(statements: List[NormalizedStatement]) -> List[IntentClassification]:
    """
    Classify each statement into a strict intent using GPT-4o.
    """
    if not settings.OPENAI_API_KEY:
        print("WARNING: OPENAI_API_KEY is missing. Using mock classifications.")
        return [IntentClassification(segment_id=s.original_segment_id, intent="INFORMATION", confidence=0.5) for s in statements]

    prompt = f"""
    Classify the following meeting statements into exactly one of these intents:
    INFORMATION, QUESTION, PROPOSAL, DECISION, ACTION_ASSIGNMENT, RISK, MITIGATION, CLARIFICATION, OFF_TOPIC.
    
    Statements:
    {[{"id": s.original_segment_id, "text": s.normalized_text} for s in statements]}
    
    Return a JSON object with key 'classifications' containing a list of objects with 'id' and 'intent'.
    """
    system_prompt = "You are a meeting analyst. Classify intents strictly. If unsure, mark as OFF_TOPIC."
    
    response_text = _call_llm(prompt, system_prompt)
    try:
        data = json.loads(response_text)
        class_list = data.get("classifications", [])
        class_map = {c["id"]: c["intent"] for c in class_list}
        
        return [
            IntentClassification(
                segment_id=s.original_segment_id,
                intent=class_map.get(s.original_segment_id, "INFORMATION"),
                confidence=0.9
            ) for s in statements
        ]
    except Exception as e:
        print(f"ERROR: Failed to parse intent classifications: {e}")
        return [IntentClassification(segment_id=s.original_segment_id, intent="INFORMATION", confidence=0.5) for s in statements]

# --- Layer 4 & 5: Evidence-Based Extraction & Validation ---

def extract_from_segments(segments: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Main entry point for the 5-Layer Accuracy Architecture.
    Uses LLM for structured extraction of actions, decisions, and risks.
    """
    # Layer 2: Normalization
    normalized = normalize_statements(segments)
    
    # Layer 3: Intent Classification
    intents = classify_intents(normalized)
    
    # Filter statements that are likely interesting
    interesting_statements = []
    intent_map = {ic.segment_id: ic.intent for ic in intents}
    for s in normalized:
        intent = intent_map.get(s.original_segment_id)
        if intent in ["ACTION_ASSIGNMENT", "DECISION", "RISK", "PROPOSAL", "MITIGATION"]:
            interesting_statements.append({"id": s.original_segment_id, "text": s.normalized_text, "intent": intent})

    if not interesting_statements:
        return ExtractionResult(summary="No significant items found.", status="complete").model_dump()

    # Layer 4: Extraction based on Intents
    prompt = f"""
    Extract Action Items, Decisions, and Risks from the following classified segments.
    
    Segments:
    {json.dumps(interesting_statements)}
    
    For each Action Item, identify the 'owner' (person), 'task', and 'source_segments' (list of IDs).
    For each Decision, identify the 'decision' text, 'approved_by' (list of names), and 'evidence_segments' (list of IDs).
    For each Risk, identify the 'risk' text, 'impact', and 'evidence_segment' (ID).
    
    Return a JSON object matching the ExtractionResult schema.
    """
    system_prompt = "You are an expert meeting minute taker. Extract structured data with high precision."
    
    response_text = _call_llm(prompt, system_prompt)
    try:
        data = json.loads(response_text)
        
        # Validation Layer 5: Pydantic handles basic type validation
        result = ExtractionResult(**data)
        
        # Additional custom validation Rule: No action without owner
        result.actions = [a for a in result.actions if a.owner and a.owner.lower() != "unknown" and a.owner.lower() != "none"]
        
        return result.model_dump()
    except Exception as e:
        print(f"ERROR: LLM Extraction failed: {e}")
        return ExtractionResult(summary="Error during LLM extraction.", status="failed", reason=str(e)).model_dump()
