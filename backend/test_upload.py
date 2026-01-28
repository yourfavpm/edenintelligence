import sys
import os
import asyncio
import httpx
from datetime import timedelta

sys.path.append(os.getcwd())

from app.db import SyncSessionLocal
from app.models.models import User
from app.core.config import settings
from app.core import security

async def test_upload():
    # 1. Get a valid token
    db = SyncSessionLocal()
    try:
        user = db.query(User).filter_by(email="benita@example.com").first()
        if not user:
            # Create dummy user if needed, or pick first available
            user = db.query(User).first()
            if not user:
                print("No users found!")
                return
        
        access_token = security.create_access_token(
            subject=str(user.id),
            expires_delta=timedelta(minutes=5)
        )
        print(f"Got token for user {user.email}")
    finally:
        db.close()

    # 2. Prepare file
    # Create a dummy small text file to upload as "audio" just to test the transport
    offset_file = "test_audio.txt"
    with open(offset_file, "wb") as f:
        f.write(b"fake audio content")

    # 3. Upload
    async with httpx.AsyncClient() as client:
        files = {'file': (offset_file, open(offset_file, 'rb'), 'text/plain')}
        headers = {'Authorization': f'Bearer {access_token}'}
        
        try:
            print("Uploading...")
            response = await client.post(
                "http://localhost:8001/audio/ingest",
                headers=headers,
                files=files,
                data={"title": "Python Upload Test"}
            )
            print(f"Status: {response.status_code}")
            print(f"Response: {response.text}")
        except Exception as e:
            print(f"Upload failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_upload())
