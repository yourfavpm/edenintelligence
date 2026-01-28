import boto3
from botocore.exceptions import ClientError
import sys
import os

# Add backend directory to path
sys.path.append(os.getcwd())

from app.core.config import settings

def create_bucket():
    print(f"Connecting to S3 at {settings.S3_ENDPOINT}...")
    s3 = boto3.client(
        "s3",
        aws_access_key_id=settings.S3_ACCESS_KEY,
        aws_secret_access_key=settings.S3_SECRET_KEY,
        endpoint_url=settings.S3_ENDPOINT,
        region_name=settings.S3_REGION
    )
    bucket_name = settings.S3_BUCKET
    try:
        s3.create_bucket(Bucket=bucket_name)
        print(f"Bucket '{bucket_name}' created successfully.")
    except ClientError as e:
        error_code = e.response.get('Error', {}).get('Code')
        if error_code == 'BucketAlreadyOwnedByYou' or error_code == 'BucketAlreadyExists':
            print(f"Bucket '{bucket_name}' already exists.")
        else:
            print(f"Error creating bucket: {e}")
            sys.exit(1)
    except Exception as e:
        print(f"Unexpected error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    create_bucket()
