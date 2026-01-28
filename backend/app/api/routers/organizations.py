from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from app.db import get_db
from app.schemas import OrganizationCreate, OrganizationRead, MembershipRead, UserRead
from app.models.models import Organization, UserOrganization, User
from app.core.auth import get_current_user, require_org_role

router = APIRouter(prefix="/orgs", tags=["organizations"])
@router.post("/", response_model=OrganizationRead)
async def create_org(payload: OrganizationCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    q = await db.execute(select(Organization).filter_by(name=payload.name))
    if q.scalars().first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Organization already exists")
    org = Organization(name=payload.name)
    db.add(org)
    await db.commit()
    await db.refresh(org)
    # add creator as admin
    membership = UserOrganization(user_id=current_user.id, organization_id=org.id, role="admin")
    db.add(membership)
    await db.commit()
    return org


@router.get("/me", response_model=List[OrganizationRead])
async def my_orgs(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    q = await db.execute(select(Organization).join(UserOrganization).filter(UserOrganization.user_id == current_user.id))
    orgs = q.scalars().all()
    return orgs


@router.get("/{org_id}/members", response_model=List[MembershipRead])
async def list_members(org_id: int, db: AsyncSession = Depends(get_db), membership: UserOrganization = Depends(require_org_role("org_id", "organizer"))):
    q = await db.execute(select(UserOrganization).filter_by(organization_id=org_id))
    members = q.scalars().all()
    return members
