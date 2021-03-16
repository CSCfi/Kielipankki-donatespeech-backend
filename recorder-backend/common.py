import os
import boto3
import json
from uuid import UUID
import logging

content_bucket = os.environ.get("CONTENT_BUCKET_NAME")
s3_client = boto3.client('s3')

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def load_s3_file_content(file):
        loaded_file = s3_client.get_object(Bucket=content_bucket, Key=file)
        body = loaded_file.get('Body').read()
        conf_dict = json.loads(body)
        return conf_dict

def get_bad_request_params(info):
    return {
            "statusCode": 400,
            "body": json.dumps({
                'error' : "Bad request parameters",
                'additionalInfo': info
            })
        }

def rreplace(s, old, new, occurrence):
    li = s.rsplit(old, occurrence)
    return new.join(li)

def validate_uuid_v4(uuid):
    try:
        UUID(uuid, version=4)
        return True
    except Exception as e:
        logger.error(e)
        return False

class Error(Exception):
    """Base class for exceptions in this module."""
    pass

class FileProcessingError(Error):
    """Exception raised for errors in the s3 filehandling.

    Attributes:
        expression -- input expression in which the error occurred
        message -- explanation of the error
    """

    def __init__(self, message):
        self.message = message