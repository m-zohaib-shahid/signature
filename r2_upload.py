import os
import boto3
from dotenv import load_dotenv

load_dotenv()

R2_ENDPOINT = os.getenv("R2_ENDPOINT_URL", "")
R2_ACCESS_KEY = os.getenv("R2_ACCESS_KEY_ID", "")
R2_SECRET_KEY = os.getenv("R2_SECRET_ACCESS_KEY", "")

# Initialize client safely only if valid endpoint exists
s3 = None
if R2_ENDPOINT and not R2_ENDPOINT.startswith("https://<account_id>"):
    try:
        s3 = boto3.client(
            's3',
            endpoint_url=R2_ENDPOINT,
            aws_access_key_id=R2_ACCESS_KEY,
            aws_secret_access_key=R2_SECRET_KEY,
            region_name="auto"
        )
    except Exception as e:
        print(f"Warning: R2 S3 Client setup failed: {e}")

def upload_to_r2(file_path, object_name=None):
    if not s3:
        # Fallback for local testing without active R2 credentials
        print("R2 credentials not set. Returning local preview path.")
        return file_path
    
    if object_name is None:
        object_name = os.path.basename(file_path)

    bucket_name = os.getenv("R2_BUCKET_NAME", "signatures")
    try:
        s3.upload_file(file_path, bucket_name, object_name)
        return f"{R2_ENDPOINT}/{bucket_name}/{object_name}"
    except Exception as e:
        print(f"Upload Error: {e}")
        return file_path