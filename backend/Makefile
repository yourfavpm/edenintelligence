run:
	uvicorn app.main:app --reload --port 8000

worker:
	celery -A celery_app.celery_app worker --loglevel=info
