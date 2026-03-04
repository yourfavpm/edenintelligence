from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Callable
from app.db import get_db
from app.core.security import decode_token
from app.models.models import User, UserOrganization

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")


async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)) -> User:
    from uuid import UUID
    try:
        payload = decode_token(token)
        user_id_str = payload.get("sub")
        if not user_id_str:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token: missing subject")
        
        # In this app, we primarily use 'access' tokens, but we'll accept 'refresh' 
        # for /auth/me or similar if they are valid for the user.
        # However, for security, we usually check type:
        if payload.get("type") not in ["access", "refresh"]:
             raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token type")

        uid = UUID(user_id_str)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Authentication failed: {str(e)}")
    
    q = await db.execute(select(User).filter_by(id=uid))
    user = q.scalars().first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Inactive user")
    return user


def require_org_role(org_id_arg: str, role: str) -> Callable:
    async def _checker(org_id: str, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
        q = await db.execute(select(UserOrganization).filter_by(user_id=current_user.id, organization_id=org_id))
        membership = q.scalars().first()
        if not membership:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not a member of the organization")
        # simple role hierarchy: admin > organizer > participant
        roles = {"admin": 3, "organizer": 2, "participant": 1}
        if roles.get(membership.role, 0) < roles.get(role, 0):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient role")
        return membership

    return _checker
