import json
import logging
import boto3
import os
from botocore.exceptions import ClientError
from json import JSONDecodeError
from yle_utils import *
from common import *

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def load_theme(event, context):
    try:
        theme_id = event.get('pathParameters').get('id')
        theme_dict = load_s3_file_content('theme/' + theme_id + '.json')
        
        return {
            "statusCode": 200,
            "headers": {
                'Access-Control-Allow-Origin': '*', 
            },
            "body": json.dumps(theme_dict)
        }
    except Exception as e:
        logger.error(e)
        raise FileProcessingError("Error reading theme")

def load_all_themes(event, context):
    try:
        list_of_theme_files = s3_client.list_objects_v2(
            Bucket=content_bucket, 
            Prefix=f'theme/',
            MaxKeys=1000
        )

        def map_theme_list(content):
            key = content.get('Key')
            filename = key.replace('theme/','')
            
            # Filter the parent "directory"
            if filename == '':
                 return None

            return {
                "id": filename.replace('.json', '').strip(),
                "content": load_s3_file_content(key)
            }

        mapped_contents = list(filter(lambda x: x is not None, map(map_theme_list, list_of_theme_files.get('Contents'))))
        
        return {
                "statusCode": 200,
                "headers": {
                    'Access-Control-Allow-Origin': '*', 
                },
                "body": json.dumps(mapped_contents)
            }
    except Exception as e:
        logger.error(e)
        raise FileProcessingError("Error reading configuration")
