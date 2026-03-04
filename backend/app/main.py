from fastapi import FastAPI, Request, HTTPException, status
from fastapi.responses import JSONResponse
from app.api.routers import meetings, auth, organizations, listeners, audio, translations, summaries, extractions, transcripts, dashboard, consents, privacy
from app.core.config import settings
from app.db import init_db
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Request
from app.core.audit import record_audit
import traceback

app = FastAPI(title=settings.PROJECT_NAME)

# Middleware registration moved to bottom of file to ensure CORSMiddleware is the outermost layer

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": settings.PROJECT_NAME}

@app.on_event("startup")
async def on_startup():
    # Always attempt to initialize tables (Base.metadata.create_all is idempodent)
    # This prevents 'relation users does not exist' if migrations weren't run.
    await init_db()


# ---------- Global exception handler ----------
# Catches ANY unhandled exception so the response is always valid JSON.
# This ensures CORS headers are attached by the CORS middleware (which wraps everything).
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    # Log the full traceback to Render logs for debugging
    traceback.print_exc()
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"},
    )


@app.middleware("http")
async def require_api_token(request: Request, call_next):
    if request.method == "OPTIONS":
        return await call_next(request)
        
    # Open paths
    if request.url.path.startswith("/auth/") or request.url.path.startswith("/docs") or request.url.path.startswith("/openapi.json") or request.url.path == "/health":
        return await call_next(request)

    # User-facing paths (secured by get_current_user)
    user_paths = ["/meetings", "/audio", "/transcripts", "/summaries", "/extractions", "/organizations", "/listeners", "/dashboard", "/consents", "/privacy"]
    for path in user_paths:
        if request.url.path.startswith(path):
            return await call_next(request)
        
    token = request.headers.get("Authorization")
    if settings.API_TOKEN:
        if not token or token.replace("Bearer ", "") != settings.API_TOKEN:
            # Return JSONResponse instead of raising HTTPException inside middleware
            return JSONResponse(status_code=401, content={"detail": "Invalid API token"})
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

# Register CORSMiddleware LAST so it wraps everything else and adds headers even for failed requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
