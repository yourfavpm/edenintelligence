from celery import Celery
from app.core.config import settings


# When CELERY_TASK_ALWAYS_EAGER is True, tasks run synchronously in-process.
# Use an in-memory broker so Celery never tries to open a Redis connection.
_eager = settings.CELERY_TASK_ALWAYS_EAGER
_default_broker = "memory://" if _eager else (settings.CELERY_BROKER_URL or settings.REDIS_URL)
broker = settings.CELERY_BROKER_URL if (settings.CELERY_BROKER_URL and not _eager) else _default_broker

celery_app = Celery("praxiomnotes", broker=broker)
celery_app.conf.task_always_eager = _eager
celery_app.conf.task_eager_propagates = _eager  # propagate exceptions in eager mode
celery_app.conf.task_routes = {"app.tasks.*": {"queue": "celery"}}


# Import tasks module to register all @celery_app.task decorators
import app.tasks  # noqa
