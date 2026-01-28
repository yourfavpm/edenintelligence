from typing import Optional
from app.models.models import AuditLog
from app.db import AsyncSessionLocal

async def record_audit(user_id: Optional[int], action: str, object_type: Optional[str] = None, object_id: Optional[str] = None, details: Optional[str] = None, ip: Optional[str] = None, user_agent: Optional[str] = None):
    async with AsyncSessionLocal() as db:
        al = AuditLog(user_id=user_id, action=action, object_type=object_type, object_id=object_id, details=details, ip_address=ip, user_agent=user_agent)
        db.add(al)
        await db.commit()
