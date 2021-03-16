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

def pre_process_configuration_file(content: dict):
    for item in content.get('items'):
        item_type = item.get('itemType')
        if  item_type == "yle-video" or item_type == "yle-audio":
            url = item.get('url')
            item['url'] = map_yle_content(url)


def load_s3_conf_file(file):
        conf_dict = load_s3_file_content(file)
        pre_process_configuration_file(conf_dict)
        return conf_dict

def load_configuration(event, context):
    try:
        schedule_id = event.get('pathParameters').get('id')
        conf_name = 'configuration/' + schedule_id + '.json'
        conf_dict = load_s3_conf_file(conf_name)
        
        return {
            "statusCode": 200,
            "headers": {
                'Access-Control-Allow-Origin': '*', 
            },
            "body": json.dumps(conf_dict)
        }
    except Exception as e:
        logger.error(e)
        raise FileProcessingError("Error reading configuration file: {}".format(conf_name))


def load_all_configurations(event, context):
    try:
        list_of_conf_files = s3_client.list_objects_v2(
            Bucket=content_bucket, 
            Prefix=f'configuration/',
            MaxKeys=1000
        )

        def map_conf_list(content):
            key = content.get('Key')
            filename = key.replace('configuration/','')
            
            # Filter the parent "directory"
            if filename == '':
                 return None

            return {
                "id": filename.replace('.json', '').strip(),
                "content": load_s3_conf_file(key)
            }


        mapped_contents = list(filter(lambda x: x is not None, map(map_conf_list, list_of_conf_files.get('Contents'))))
        mapped_contents.sort(key = lambda x: x.get('id'))
        
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

