import asyncio
import os
import sys
import boto3
from botocore.exceptions import ClientError

# Add backend to path
sys.path.append(os.getcwd())

from app.core.config import settings

async def verify_s3():
    print("--- S3 Verification Script ---")
    print(f"Configuration:")
    print(f"  Bucket: {settings.S3_BUCKET}")
    print(f"  Region: {settings.S3_REGION}")
    print(f"  Endpoint: {settings.S3_ENDPOINT}")
    print(f"  Access Key: {settings.S3_ACCESS_KEY[:4]}...{settings.S3_ACCESS_KEY[-4:] if settings.S3_ACCESS_KEY else ''}")
    
    # Initialize Client
    try:
        s3 = boto3.client(
            "s3",
            aws_access_key_id=settings.S3_ACCESS_KEY,
            aws_secret_access_key=settings.S3_SECRET_KEY,
            endpoint_url=settings.S3_ENDPOINT or None,
            region_name=settings.S3_REGION or None
        )
        print("\n[OK] Boto3 Client initialized")
    except Exception as e:
        print(f"\n[FAIL] Could not initialize client: {e}")
        return

    # Check Bucket Existence
    try:
        s3.head_bucket(Bucket=settings.S3_BUCKET)
        print(f"[OK] Bucket '{settings.S3_BUCKET}' exists and is accessible")
    except ClientError as e:
        error_code = int(e.response['Error']['Code'])
        if error_code == 404:
            print(f"[FAIL] Bucket '{settings.S3_BUCKET}' does not exist")
            # Try to create it if using MinIO (dev only)
            if settings.S3_ENDPOINT and "localhost" in settings.S3_ENDPOINT:
                print("  -> Attempting to create bucket (local/MinIO)...")
                try:
                    s3.create_bucket(Bucket=settings.S3_BUCKET)
                    print("  -> [OK] Bucket created")
                except Exception as create_err:
                     print(f"  -> [FAIL] Could not create bucket: {create_err}")
                     return
            else:
                return
        elif error_code == 403:
            print(f"[FAIL] Access Forbidden to bucket '{settings.S3_BUCKET}' (403)")
            return
        else:
            print(f"[FAIL] Error checking bucket: {e}")
            return

    # Test Upload
    test_key = "test_connectivity_check.txt"
    try:
        s3.put_object(Bucket=settings.S3_BUCKET, Key=test_key, Body=b"Hello S3")
        print(f"[OK] Uploaded test file: {test_key}")
    except Exception as e:
        print(f"[FAIL] Upload failed: {e}")
        return

    # Test Download
    try:
        response = s3.get_object(Bucket=settings.S3_BUCKET, Key=test_key)
        data = response['Body'].read()
        if data == b"Hello S3":
            print(f"[OK] Downloaded and verified content")
        else:
            print(f"[FAIL] Downloaded content mismatch: {data}")
    except Exception as e:
        print(f"[FAIL] Download failed: {e}")

    # Test Delete
    try:
        s3.delete_object(Bucket=settings.S3_BUCKET, Key=test_key)
        print(f"[OK] Deleted test file")
    except Exception as e:
         print(f"[FAIL] Delete failed: {e}")

    print("\n--- Verification Passed ---")
    print("S3 storage is ready for use.")

if __name__ == "__main__":
    asyncio.run(verify_s3())
