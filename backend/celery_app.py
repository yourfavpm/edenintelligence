from celery import Celery
from app.core.config import settings

broker = settings.CELERY_BROKER_URL or settings.REDIS_URL
celery_app = Celery("edensummariser", broker=broker)
celery_app.conf.task_routes = {"app.tasks.*": {"queue": "celery"}}

# Import tasks module to register all @celery_app.task decorators
import app.tasks  # noqa
