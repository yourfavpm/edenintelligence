from fastapi import APIRouter, Depends, HTTPException, status, Body, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi.security import OAuth2PasswordRequestForm
from app.db import get_db
from app.schemas import (
    UserCreate, AuthResponse, TokenRefresh, UserRead, 
    EmailVerificationRequest, VerifyEmail, ForgotPasswordRequest, ResetPassword, GoogleAuthRequest
)
from app.models.models import User
from app.core.security import get_password_hash, verify_password, create_access_token, create_refresh_token, decode_token
from app.notifications.email import sender
import uuid

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserRead)
async def register(payload: UserCreate, db: AsyncSession = Depends(get_db)):
    # check existing
    q = await db.execute(select(User).filter_by(email=payload.email))
    if q.scalars().first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    
    user = User(
        email=payload.email, 
        display_name=payload.display_name,
        hashed_password=get_password_hash(payload.password),
        is_verified=False # New users must verify email
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    
    # In a real app, we would trigger the verification email here
    # await send_verification_email(user.email, db)
    
    return user


@router.post("/token", response_model=AuthResponse)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    q = await db.execute(select(User).filter_by(email=form_data.username))
    user = q.scalars().first()
    if not user or not user.hashed_password:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password")
    if not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password")
    
    # Optional: block login if not verified (commented out for dev flexibility)
    # if not user.is_verified:
    #     raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Email not verified")

    access = create_access_token(subject=user.id)
    refresh = create_refresh_token(subject=user.id)
    return {"access_token": access, "token_type": "bearer", "refresh_token": refresh}


@router.post("/refresh", response_model=dict)
async def refresh_token(payload: TokenRefresh):
    try:
        data = decode_token(payload.refresh_token)
        if data.get("type") != "refresh":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token type")
        user_id = data.get("sub")
        access = create_access_token(subject=user_id)
        return {"access_token": access, "token_type": "bearer"}
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")


@router.post("/request-verification")
async def request_verification(payload: EmailVerificationRequest, db: AsyncSession = Depends(get_db)):
    q = await db.execute(select(User).filter_by(email=payload.email))
    user = q.scalars().first()
    if not user:
        # Don't reveal account existence
        return {"message": "If the account exists, a verification email has been sent."}
    
    # Mock token generation (in production use JWT with short expiry)
    token = str(uuid.uuid4())
    await sender.send(
        user.email, 
        "Verify your email", 
        f"Click here to verify: /auth/verify?token={token}"
    )
    return {"message": "Verification email sent."}


@router.post("/verify-email")
async def verify_email(payload: VerifyEmail, db: AsyncSession = Depends(get_db)):
    # In a real app, decode the JWT token and find the user
    # For now, we'll mock this with a dummy token check if it starts with 'test-token-'
    if not payload.token:
        raise HTTPException(status_code=400, detail="Invalid token")
    
    # Mock behavior: Any token is "valid" for now to allow UI testing
    # Find active but unverified users? Just mock for now.
    return {"status": "success", "message": "Email verified successfully."}


@router.post("/forgot-password")
async def forgot_password(payload: ForgotPasswordRequest, db: AsyncSession = Depends(get_db)):
    q = await db.execute(select(User).filter_by(email=payload.email))
    user = q.scalars().first()
    if not user:
        return {"message": "If the email is registered, a reset link will be sent."}
    
    token = str(uuid.uuid4())
    await sender.send(
        user.email,
        "Reset your password",
        f"Click here to reset: /auth/reset-password?token={token}"
    )
    return {"message": "Reset email sent."}


@router.post("/reset-password")
async def reset_password(payload: ResetPassword, db: AsyncSession = Depends(get_db)):
    # Mocking password reset
    if not payload.token or len(payload.new_password) < 8:
        raise HTTPException(status_code=400, detail="Invalid request")
    
    return {"status": "success", "message": "Password reset successful."}


@router.get("/me", response_model=UserRead)
async def get_current_user(request: Request, db: AsyncSession = Depends(get_db)):
    """Get the current authenticated user's profile"""
    
    # Extract token from Authorization header
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = auth_header.split(" ")[1]
    try:
        payload = decode_token(token)
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        
        # Fetch user from database
        try:
            uid = int(user_id)
        except ValueError:
             raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token subject")

        q = await db.execute(select(User).filter_by(id=uid))
        user = q.scalars().first()
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        
        return user
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


@router.post("/google-auth")
async def google_auth(payload: GoogleAuthRequest, db: AsyncSession = Depends(get_db)):
    # Mocking Google Auth login/signup
    # In a real app, verify the ID token with Google's library
    email = "google-user@example.com" # Mocked
    google_id = "mock-google-id" # Mocked
    
    q = await db.execute(select(User).filter_by(email=email))
    user = q.scalars().first()
    
    if not user:
        user = User(email=email, display_name="Google User", google_id=google_id, is_verified=True)
        db.add(user)
        await db.commit()
        await db.refresh(user)
    
    access = create_access_token(subject=user.id)
    refresh = create_refresh_token(subject=user.id)
    return {"access_token": access, "token_type": "bearer", "refresh_token": refresh}
