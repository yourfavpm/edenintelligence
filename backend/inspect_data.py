import sys
import os
import logging
from sqlalchemy import text, select

# Ensure we can import from app
sys.path.append(os.getcwd())

from app.db import SyncSessionLocal
from app.models.models import AudioFile, Recording, Transcript, MeetingSummary, Extraction

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def inspect_recent_data():
    db = SyncSessionLocal()
    try:
        logger.info("--- Recent Recordings ---")
        recs = db.query(Recording).order_by(Recording.id.desc()).limit(5).all()
        for r in recs:
            logger.info(f"REC ID: {r.id}, Meeting: {r.meeting_id}, Status: {r.processing_status}, S3: {r.s3_key}")
            
            # Check AudioFile
            af = db.query(AudioFile).filter_by(s3_key=r.s3_key).first()
            if af:
                logger.info(f"  -> AudioFile ID: {af.id}, Size: {af.size_bytes}, Type: {af.content_type}, Processed: {af.processed}")
                
                # Check Transcript
                tr = db.query(Transcript).filter_by(audio_file_id=af.id).first()
                if tr:
                    logger.info(f"  -> Transcript ID: {tr.id}, Lang: {tr.detected_language}")
                    
                    # Check Summary
                    ms = db.query(MeetingSummary).filter_by(transcript_id=tr.id).first()
                    if ms:
                         logger.info(f"  -> Summary ID: {ms.id}, Length: {len(ms.executive_summary) if ms.executive_summary else 0} chars")
                    else:
                        logger.info("  -> NO Summary found")
                        
                    # Check Extraction
                    ex = db.query(Extraction).filter_by(transcript_id=tr.id).first()
                    if ex:
                         logger.info(f"  -> Extraction ID: {ex.id}")
                    else:
                        logger.info("  -> NO Extraction found")
                else:
                    logger.info("  -> NO Transcript found")
            else:
                logger.info("  -> NO AudioFile found")

    finally:
        db.close()

if __name__ == "__main__":
    inspect_recent_data()
