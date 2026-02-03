from typing import List, Optional

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "Meeting Intelligence"
    API_TOKEN: Optional[str] = None
    DATABASE_URL: Optional[str] = None
    REDIS_URL: str = "redis://localhost:6379/0"
    S3_BUCKET: Optional[str] = None
    S3_ENDPOINT: Optional[str] = None
    S3_ACCESS_KEY: Optional[str] = None
    S3_SECRET_KEY: Optional[str] = None
    S3_REGION: Optional[str] = None
    CELERY_BROKER_URL: Optional[str] = None
    # Email / SMTP
    SMTP_HOST: Optional[str] = None
    SMTP_PORT: Optional[int] = None
    SMTP_USER: Optional[str] = None
    SMTP_PASS: Optional[str] = None
    EMAIL_FROM: Optional[str] = None
    # Analysis API Keys
    ASSEMBLYAI_API_KEY: Optional[str] = None

    # Optional symmetric encryption key (Fernet) for encrypting sensitive fields at rest
    ENCRYPTION_KEY: Optional[str] = None

    # Storage
    USE_LOCAL_STORAGE: bool = False
    STORAGE_PATH: str = "storage_data"

    # AI Configuration
    WHISPER_MODEL: str = "large-v3"
    HF_TOKEN: Optional[str] = None
    USE_GPU: bool = False
    USE_MODAL_AI: bool = False
    OPENAI_API_KEY: Optional[str] = None # For LLM-based layers

    # Production Configs
    DOMAIN: str = "localhost"
    CORS_ORIGINS: List[str] = ["http://localhost:3000"]

    class Config:
        case_sensitive = True
        env_file = ".env"
        extra = "ignore"


settings = Settings()
