import custom_fleep
import logging
import boto3
import json
from urllib.parse import unquote_plus
from common import *

audio_prefix = "uploads/audio_and_metadata/"
metadata_prefix = "uploads/audio_and_metadata/metadata/"

def check_audio_file(event, context):
    event_str = json.dumps(event)
    logger.info(f"Event received ${event_str}")

    for record in event['Records']:
        bucket = record['s3']['bucket']['name']
        key = unquote_plus(record['s3']['object']['key'])
        logger.info(f"Analyzing {key}")

        try:
            res = s3_client.get_object(Bucket=bucket, Key=key)
        except Exception as e:
            logger.error(f"Couldn't read file from s3 with key {key}")
            continue

        content_length = res.get('ContentLength')

        if key.endswith('.json'):
            if content_length > 100000:
                logger.warning(f"Too large json file {key}")
                s3_client.delete_object(
                    Bucket= bucket, 
                    Key= key)
            continue

        if content_length < 10000 or content_length > 500000000:
            logger.warning(f"Invalid size file {key} with size {content_length}")
            delete_audio_and_metadata(key, bucket)
            continue

        body = res.get('Body')
        if body is None:
            continue
    
        try:
            (valid, info) = is_valid_audio_file(body.read(128))
            if valid:
                logger.info(f"Valid audio {info.mime} file: {key}")
            else:
                logger.warning(f"NOT_VALID: file {key} is not a valid audio file")
                delete_audio_and_metadata(key, bucket)
                
        except Exception as e:
            logger.error(f"Error determining file type {e}")
        finally:
            body.close()


def is_valid_audio_file(body_start):
    info = custom_fleep.get(body_start)
    return (info.type_matches("audio"), info)


def delete_audio_and_metadata(key: str, bucket: str):
    try:
        s3_client.delete_object(
                Bucket= bucket, 
                Key= key)
        
        (_, suffix) = key.rsplit(".", 1)

        meta_key = rreplace(key.replace(audio_prefix, metadata_prefix), suffix, "json", 1)

        s3_client.delete_object(
                Bucket= bucket, 
                Key= meta_key)

    except Exception as e:
            logger.error(f"Error deleting files {e}")