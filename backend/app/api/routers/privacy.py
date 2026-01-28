from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db import get_db
from app.models.models import User
from app.core.auth import get_current_user
from celery_app import celery_app

router = APIRouter(prefix="/privacy", tags=["privacy"])


@router.post("/delete_me/user/{user_id}")
def request_user_deletion(user_id: int, current_user: User = Depends(get_current_user)):
    # allow users to request deletion of their own account or admins
    if current_user.id != user_id:
        # TODO: check admin role; for now deny
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Can only request deletion for your own account")
    # enqueue deletion task
    celery_app.send_task("app.tasks.process_delete_user", args=(user_id,))
    return {"status": "deletion_scheduled", "user_id": user_id}
