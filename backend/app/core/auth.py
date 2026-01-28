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
    try:
        payload = decode_token(token)
        if payload.get("type") != "access":
            raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid token type")
        user_id = int(payload.get("sub"))
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication credentials")
    q = await db.execute(select(User).filter_by(id=user_id))
    user = q.scalars().first()
    if not user or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Inactive user")
    return user


def require_org_role(org_id_arg: str, role: str) -> Callable:
    async def _checker(org_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
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
