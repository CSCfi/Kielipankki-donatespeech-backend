import json
import logging
import boto3
import os
from botocore.exceptions import ClientError
from json import JSONDecodeError
from common import *
from uuid import UUID

file_key_prefix = 'uploads/audio_and_metadata/'
metadata_prefix = 'metadata/'

def init_upload(event, context):
    
    body = event.get('body')

    if body is None:
        return get_bad_request_params('No body found on request.')

    try:
        post_content = json.loads(body)
        filename = post_content.get('filename')
    except JSONDecodeError as e:
        logger.error(e)
        return get_bad_request_params("Error decoding body content.")


    if filename is None or "." not in filename or "/" in filename:
        return get_bad_request_params('No filename or illegal filename attribute.')

    (file_prefix, file_suffix) = filename.rsplit(".", 1)

    if file_suffix.lower() not in ".m4a, .flac, .amr, .wav, .opus, .caf":
        return get_bad_request_params(f'Filename suffix: {file_suffix} is not valid.')

    metadata = post_content.get('metadata')

    if metadata is None:
        return get_bad_request_params('Metadata information is missing.')

    client_id = metadata.get("clientId")

    if client_id is None or not validate_uuid_v4(client_id):
        return get_bad_request_params('clientId is missing or invalid.')

    storage_prefix = client_id + "/"

    session_id = metadata.get("sessionId")

    if session_id is not None:
        if not validate_uuid_v4(session_id):
            return get_bad_request_params('sessionId is invalid.')
        
        storage_prefix = storage_prefix + session_id + "/"
    
    try:
        logger.info(f"Storing metadata: ${metadata}")
        s3_client.put_object(
            Body=json.dumps(metadata),
            Bucket=content_bucket,
            Key=file_key_prefix + metadata_prefix + storage_prefix + file_prefix + '.json'
        )

    except Exception as e:
        logger.error(e)
        raise FileProcessingError("Error storing metadata")

    try:
        params = {
            'Bucket': content_bucket,
            'Key': file_key_prefix + storage_prefix + filename,
        }

        contentType = metadata.get('contentType')
        if(contentType is not None):
            params['ContentType'] = contentType

        response = s3_client.generate_presigned_url('put_object', Params=params, ExpiresIn=360)
        return {
            "statusCode": 200,
            "headers": {
                'Access-Control-Allow-Origin': '*', 
            },
            "body": json.dumps({
                "presignedUrl" : response
            })
        }
    except ClientError as e:
        logger.error(e)
        raise FileProcessingError("Error generating presigned url for upload")


def delete_with_prefix(prefix: str):
    
    list_of_uploaded_files = s3_client.list_objects_v2(
        Bucket=content_bucket, 
        Prefix=file_key_prefix + prefix,
        MaxKeys=1000
    )

    list_of_uploaded_metadata = s3_client.list_objects_v2(
        Bucket=content_bucket, 
        Prefix=file_key_prefix + metadata_prefix + prefix,
        MaxKeys=1000
    )

    all_files = []
    all_files.extend(list_of_uploaded_files.get('Contents', []))
    all_files.extend(list_of_uploaded_metadata.get('Contents', []))

    for key in list(map(lambda x: x.get('Key'), all_files)):
        s3_client.delete_object(
            Bucket= content_bucket,
            Key= key
        )

    return {
        "statusCode": 200,
        "headers": {
            'Access-Control-Allow-Origin': '*', 
        },
        "body": json.dumps({"delete": "ok"})
    }

def delete_stored_client_data(event, context):
    logger.info("delete_stored_client_data called")

    client_id = event.get('pathParameters').get('id')
    logger.info(f"Client id {client_id}")

    query_string = event.get('queryStringParameters')
    logger.info(f"Query string {query_string}")
    
    if not validate_uuid_v4(client_id):
        return get_bad_request_params('clientId is invalid.')

    delete_prefix = client_id

    if query_string is not None:
        session_id = query_string.get('session_id')
        recording_id = query_string.get('recording_id')

        if session_id is not None:
            if not validate_uuid_v4(session_id):
                return get_bad_request_params('SessionId is invalid.')

            delete_prefix = delete_prefix + "/" + session_id

        if recording_id is not None:
            if not validate_uuid_v4(recording_id):
                return get_bad_request_params('RecordingId is invalid.')

            delete_prefix = delete_prefix + "/" + recording_id

    try:
        return delete_with_prefix(delete_prefix)
    except Exception as e:
        logger.error(e)
        raise FileProcessingError("Error deleting uploaded files")

