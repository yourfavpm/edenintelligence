from fastapi.testclient import TestClient
from app.main import app


def test_root():
    with TestClient(app) as client:
        r = client.get("/docs")
        assert r.status_code in (200, 307)
