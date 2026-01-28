# Meeting Translator & Intelligence — Backend

This folder contains a FastAPI backend scaffold for the Meeting Translator & Intelligence SaaS.

Quick start (development):

1. Create a virtualenv and install dependencies:

```bash
python3.11 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

2. Set environment variables (example `.env`):

```env
DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/meetings
REDIS_URL=redis://localhost:6379/0
API_TOKEN=devtoken123
S3_BUCKET=mybucket
S3_ENDPOINT=https://s3.example.com
```

3. Run the app (development):

```bash
uvicorn app.main:app --reload --port 8000
```

4. Run a Celery worker:

```bash
celery -A celery_app.celery_app worker --loglevel=info
```

Notes:
- The scaffold includes DB models, Pydantic schemas, a meetings router, Celery task wiring, and interfaces for AI processors.
- Integrations with speech-to-text / translation / LLM should be implemented in `app/ai` as concrete adapters.
