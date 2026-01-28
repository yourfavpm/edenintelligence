import os

# Use an isolated sqlite file for tests
os.environ.setdefault("DATABASE_URL", "sqlite+aiosqlite:///./test_auth.db")
# Disable global API token middleware for tests
os.environ.setdefault("API_TOKEN", "")

from fastapi.testclient import TestClient
from app.main import app


def test_auth_flow():
    # ensure clean DB
    try:
        os.remove("test_auth.db")
    except Exception:
        pass

    with TestClient(app) as client:
        # register
        r = client.post("/auth/register", json={"email": "alice@test.com", "password": "s3cret", "display_name": "Alice"})
        assert r.status_code == 200

        # login (form)
        r = client.post("/auth/token", data={"username": "alice@test.com", "password": "s3cret"})
        assert r.status_code == 200
        data = r.json()
        assert "access_token" in data and "refresh_token" in data
        access = data["access_token"]

        # create organization (creator becomes admin)
        r = client.post("/orgs/", json={"name": "TestOrg"}, headers={"Authorization": f"Bearer {access}"})
        assert r.status_code == 200
        org = r.json()

        # list my orgs
        r = client.get("/orgs/me", headers={"Authorization": f"Bearer {access}"})
        assert r.status_code == 200
        orgs = r.json()
        assert any(o.get("name") == "TestOrg" for o in orgs)

        # list members (should include admin membership)
        org_id = org.get("id")
        r = client.get(f"/orgs/{org_id}/members", headers={"Authorization": f"Bearer {access}"})
        assert r.status_code == 200
        members = r.json()
        assert any(m.get("role") == "admin" for m in members)
