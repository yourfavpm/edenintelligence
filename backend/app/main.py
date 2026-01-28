from fastapi import FastAPI, Request, HTTPException, status
from app.api.routers import meetings, auth, organizations, listeners, audio, translations, summaries, extractions, transcripts, dashboard, consents, privacy
from app.core.config import settings
from app.db import init_db
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Request
from app.core.audit import record_audit

app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def on_startup():
    await init_db()

@app.middleware("http")
async def require_api_token(request: Request, call_next):
    if request.method == "OPTIONS":
        return await call_next(request)
        
    # Open paths
    if request.url.path.startswith("/auth/") or request.url.path.startswith("/docs") or request.url.path.startswith("/openapi.json"):
        return await call_next(request)

    # User-facing paths (secured by get_current_user)
    user_paths = ["/meetings", "/audio", "/transcripts", "/summaries", "/extractions", "/organizations", "/listeners", "/dashboard", "/consents", "/privacy"]
    for path in user_paths:
        if request.url.path.startswith(path):
            return await call_next(request)
        
    token = request.headers.get("Authorization")
    if settings.API_TOKEN:
        if not token or token.replace("Bearer ", "") != settings.API_TOKEN:
            # Check if path is open (e.g. docs, openapi) - optional but good practice
            # for now, we enforce strict auth except for OPTIONS
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid API token")
    return await call_next(request)


@app.middleware("http")
async def audit_middleware(request: Request, call_next):
    response = await call_next(request)
    # best-effort audit entry (non-blocking)
    try:
        await record_audit(user_id=None, action=f"{request.method} {request.url.path}", object_type=None, object_id=None, details=str(response.status_code), ip=request.client.host if request.client else None, user_agent=request.headers.get("user-agent"))
    except Exception:
        pass
    return response

app.include_router(auth)
app.include_router(meetings)
app.include_router(organizations)
app.include_router(listeners)
app.include_router(audio)
app.include_router(translations)
app.include_router(summaries)
app.include_router(extractions)
app.include_router(transcripts)
app.include_router(dashboard)
app.include_router(consents)
app.include_router(privacy)
