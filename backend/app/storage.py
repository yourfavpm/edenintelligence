import asyncio
import io
import os
from typing import BinaryIO, Optional

import boto3

from app.core.config import settings

class S3Storage:
    def __init__(self, bucket: Optional[str] = None):
        self.bucket = bucket or settings.S3_BUCKET
        endpoint = settings.S3_ENDPOINT
        
        # Guard against placeholder brackets [ID] which cause "Invalid IPv6 URL"
        if endpoint and "[" in endpoint and "]" in endpoint:
            print(f"WARNING: S3_ENDPOINT contains placeholder brackets: {endpoint}. This will cause a crash.")
            endpoint = None

        print(f"DEBUG: Initializing S3Storage with bucket={self.bucket}, endpoint={endpoint}")
        
        try:
            self.client = boto3.client(
                "s3",
                aws_access_key_id=settings.S3_ACCESS_KEY,
                aws_secret_access_key=settings.S3_SECRET_KEY,
                endpoint_url=endpoint or None,
                region_name=settings.S3_REGION or None,
            )
        except Exception as e:
            print(f"CRITICAL ERROR: Failed to initialize Boto3 client: {str(e)}")
            raise

    async def upload_fileobj(self, file_obj: BinaryIO, key: str, content_type: Optional[str] = None) -> str:
        """Upload file-like object to S3 under `key`. Returns the key."""
        # boto3 is blocking; run in thread
        def _upload():
            extra_args = {}
            if content_type:
                extra_args["ContentType"] = content_type
            self.client.upload_fileobj(file_obj, self.bucket, key, ExtraArgs=extra_args or None)
            return key

        return await asyncio.to_thread(_upload)

    async def download_to_bytes(self, key: str) -> bytes:
        def _download():
            buf = io.BytesIO()
            self.client.download_fileobj(self.bucket, key, buf)
            return buf.getvalue()

        return await asyncio.to_thread(_download)

    async def exists(self, key: str) -> bool:
        def _head():
            try:
                self.client.head_object(Bucket=self.bucket, Key=key)
                return True
            except Exception:
                return False
        return await asyncio.to_thread(_head)

    async def delete(self, key: str) -> bool:
        def _delete():
            try:
                self.client.delete_object(Bucket=self.bucket, Key=key)
                return True
            except Exception:
                return False
        return await asyncio.to_thread(_delete)

    async def generate_presigned_upload_url(self, key: str, content_type: str = "application/octet-stream", expires_in: int = 900) -> str:
        """Generate a presigned PUT URL for direct browser-to-S3 upload.

        Args:
            key: The S3 object key (path) for the upload.
            content_type: MIME type of the file being uploaded.
            expires_in: URL expiration in seconds (default 15 minutes).

        Returns:
            A presigned URL string that allows a PUT request to upload directly.
        """
        def _generate():
            return self.client.generate_presigned_url(
                ClientMethod="put_object",
                Params={
                    "Bucket": self.bucket,
                    "Key": key,
                    "ContentType": content_type,
                },
                ExpiresIn=expires_in,
            )
        return await asyncio.to_thread(_generate)


class LocalStorage:
    def __init__(self, root_dir: str = "storage_data"):
        self.root = os.path.abspath(root_dir)
        os.makedirs(self.root, exist_ok=True)
        print(f"Initialized LocalStorage at {self.root}")

    async def upload_fileobj(self, file_obj: BinaryIO, key: str, content_type: Optional[str] = None) -> str:
        # key might contain slashes, ensure structure
        full_path = os.path.join(self.root, key)
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        
        def _write():
            with open(full_path, "wb") as f:
                # file_obj might be async or sync? usually BytesIO in our usage
                # If it's a spooled temp file from upload, it works like a file
                # If it's pure bytes, we need to handle that
                f.write(file_obj.read())
            return key
            
        return await asyncio.to_thread(_write)

    async def download_to_bytes(self, key: str) -> bytes:
        full_path = os.path.join(self.root, key)
        def _read():
            with open(full_path, "rb") as f:
                return f.read()
        return await asyncio.to_thread(_read)

    async def exists(self, key: str) -> bool:
        full_path = os.path.join(self.root, key)
        return os.path.exists(full_path)

    async def delete(self, key: str) -> bool:
        full_path = os.path.join(self.root, key)
        def _remove():
            try:
                os.remove(full_path)
                return True
            except FileNotFoundError:
                return False
        return await asyncio.to_thread(_remove)


# Factory
def get_storage():
    # Check settings loaded from .env
    if settings.USE_LOCAL_STORAGE:
        return LocalStorage()
    return S3Storage()

storage = get_storage()
