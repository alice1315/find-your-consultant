import boto3

import os
from dotenv import load_dotenv

load_dotenv()

class S3():
    def __init__(self):
        self.client = self.get_client()

    def get_client(self):
        client = boto3.client(
            service_name = 's3',
            region_name = os.getenv("s3_regoion_name"),
            aws_access_key_id = os.getenv("s3_access_key_id"),
            aws_secret_access_key = os.getenv("s3_secret_access_key")
        )
        return client

    def upload_file(self, file, filename):
        response = self.client.put_object(
            Body = file,
            Bucket = 'alice1315',
            Key = 'find_your_consultant/' + filename,
        )

        return response