import boto3
import json
import datetime

session = boto3.Session(profile_name='recorder-prod')
client = session.client('s3')

# Adapted from https://alexwlchan.net/2019/07/listing-s3-keys/

def get_matching_s3_objects(bucket, prefix="", suffix=""):
    """
    Generate objects in an S3 bucket.

    :param bucket: Name of the S3 bucket.
    :param prefix: Only fetch objects whose key starts with
        this prefix (optional).
    :param suffix: Only fetch objects whose keys end with
        this suffix (optional).
    """
    paginator = client.get_paginator("list_objects_v2")

    kwargs = {'Bucket': bucket}

    # We can pass the prefix directly to the S3 API.  If the user has passed
    # a tuple or list of prefixes, we go through them one by one.
    if isinstance(prefix, str):
        prefixes = (prefix, )
    else:
        prefixes = prefix

    for key_prefix in prefixes:
        kwargs["Prefix"] = key_prefix

        for page in paginator.paginate(**kwargs):
            try:
                contents = page["Contents"]
            except KeyError:
                break

            for obj in contents:
                key = obj["Key"]
                if key.endswith(suffix):
                    yield obj


def get_matching_s3_keys(bucket, prefix="", suffix=""):
    """
    Generate the keys in an S3 bucket.

    :param bucket: Name of the S3 bucket.
    :param prefix: Only fetch keys that start with this prefix (optional).
    :param suffix: Only fetch keys that end with this suffix (optional).
    """
    for obj in get_matching_s3_objects(bucket, prefix, suffix):
        yield obj["Key"]

# Determine if this piece of JSON describes a recording or a user answer
def is_valid_recording(md):
    result = False
    #recording_keys = ['recordingDuration', 'recordingBitDepth', 'recordingSampleRate', 'recordingNumberOfChannels', 'contentType']
    if ('recordingBitDepth' in md) and ('recordingSampleRate' in md) and ('recordingNumberOfChannels' in md) and ('contentType' in md):
        # OK, all the keys exist, but are they zeroed out?
        #print(f"recordingBitDepth = {md['recordingBitDepth']}, recordingSampleRate = {md['recordingSampleRate']}, recordingNumberOfChannels = {md['recordingNumberOfChannels']}, contentType = {md['contentType']}")
        if md['recordingBitDepth'] != 0 and md['recordingSampleRate'] != 0 and md['recordingNumberOfChannels'] != 0 and md['contentType'] != None:
            result = True
    return result

total_minutes = 0
total_seconds = 0
bucket_name = 'recorder-content-prod'
metadata_prefix = 'uploads/audio_and_metadata/metadata'
total_bytes = 0
answer_count = 0
recording_count = 0
min_recording_duration = 0
max_recording_duration = 0
average_recording_duration = 0
object_count = 0
flac_type_count = 0
wav_type_count = 0
unknown_type_count = 0
client_android_count = 0
client_ios_count = 0
client_web_count = 0
stereo_count = 0
mono_count = 0
android_versions = {} # base on answers, not recordings
ios_versions = {} # base on answers, not recordings

# Save the metadata of the longest recording so that we can
# easily find it and remove it if necessary.
longest_recording_metadata = None

schedule_recording_items = {
    '3a73d87a-8856-4ca0-9af2-da66c99a95f9': [
        '3e9baccc-5691-4df3-a454-43fcdeefaf61',
        'a32c156d-aaa6-492d-bd9a-730cae6fc559',
        '75a509cc-e481-4d47-87d4-23c3f0693234',
        'eae563dd-2116-4026-b4ef-c0c874bbda1e',
        'd29502f0-6358-4e98-acd9-7ac3393b7b42',
        '4b5d4244-1ca6-471e-a3ec-3331f431e5b3',
        'f46d435f-5c62-448b-9492-ab11e6758d00',
        '9c62e99e-556c-497d-b186-fe2655178d83',
        '46466e4d-2984-4cad-b217-50ee6dbf74a9'
    ],
    '8aaf82be-de16-4449-9fd2-677291a0e804': [
        '8fec866e-eb78-4404-a068-3dff257c57c8',
        '82720f84-1c34-4017-a506-24aba8bca736',
        '0d87b6f2-9136-4f5a-97ea-89b638bbabf9',
        '86364bea-a6ab-4fdc-ae27-a415c076fccf',
        '1316a875-371a-460b-9f1b-b81fc4711ff5',
        'af88b3fd-1700-491e-902c-cf412e768ab1',
        '652c6896-ea25-4df1-993e-bc0f46177125'
    ],
    '0598bf14-ab48-4ccb-a50c-0bd779f77933': [
        '4a4d2c26-68c9-414a-9c2f-53f1b6831d9b',
        '860a2e67-1480-4943-b8df-aef477f7895d',
        '0d592ff8-2c06-4d7b-9517-a876b0fc6d6c',
        '3f9c88b6-f690-44ae-9af1-a9c18426a6ea',
        '31862f24-2047-473e-8bf6-d36f377b245d',
        'f589f9e2-3fef-45d5-8286-b701a1fb0bbd'
    ],
    '664bc028-a92f-435f-8e33-9ab4921476c1': [
        'a4b700d3-2001-4ba4-839d-da721d4e63ed',
        '74838f03-9193-483c-b27c-66586b35c2d6',
        'd94432f8-8b01-430a-9289-6a941e5e89e8',
        '4ce0a50a-613c-4ada-b473-9400f833aa42',
        'dc954c13-8483-4c78-ba0c-d117269141e1',
        'b7b2ddad-2b77-421e-a125-65339dbd3d23',
        '285eac4e-d937-40a8-afb2-0844ea6a2a81',
        '13bac87d-c97f-4433-ae08-574ed478b51c',
        'ad5abbcc-0864-4971-8273-2b2720371ede',
        'd803657f-7e0e-43b4-9a0f-26e3b7c87165',
        'b8caf667-d19d-432c-a82f-707b7e6fbc03'
    ],
    'f5c5fd20-34f9-4ff8-bdba-666bbf1740ce': [
        '245bc03d-a5b4-4cab-8c42-05df42fdb499',
        'a3c758d7-6fc5-4f71-9fce-4c8684ebb8a0',
        '8871f112-5c8f-4083-89f5-c42b4525d55b',
        '1a139b75-8ca7-4283-b2e4-15ca53de0b26',
        '1587885a7-1e6f-421e-8f2d-b4f93bbf8239', # note: this accidentally has an extra character!
        '37311b27-086d-4cfa-91c8-6cc174af5560'
    ]
}

schedule_recording_keys = {
    '3a73d87a-8856-4ca0-9af2-da66c99a95f9': [],
    '8aaf82be-de16-4449-9fd2-677291a0e804': [],
    '0598bf14-ab48-4ccb-a50c-0bd779f77933': [],
    '664bc028-a92f-435f-8e33-9ab4921476c1': [],
    'f5c5fd20-34f9-4ff8-bdba-666bbf1740ce': []
}

#print(f'getting keys from {bucket_name}/{metadata_prefix}')
for key in get_matching_s3_keys(bucket_name, prefix=metadata_prefix, suffix='.json'):
    #print(key[len(metadata_prefix) + 1:])
    content_object = client.get_object(Bucket=bucket_name, Key=key)
    object_count += 1
    file_content = content_object["Body"].read().decode()
    json_content = json.loads(file_content)
    total_bytes += len(json_content)

    if is_valid_recording(json_content):
        seconds = int(json_content['recordingDuration'])
        #print(f'found a recording of {seconds} seconds')
        total_seconds += seconds
        recording_count += 1
        if seconds < min_recording_duration:
            min_recording_duration = seconds
        if seconds > max_recording_duration:
            max_recording_duration = seconds
            longest_recording_metadata = json_content
        if json_content['contentType'] == 'audio/flac':
            flac_type_count += 1
        elif json_content['contentType'] == 'audio/wave':
            wav_type_count += 1
        else:
            unknown_type_count += 1
        if json_content['clientPlatformName'] == 'Android':
            client_android_count += 1
        elif json_content['clientPlatformName'] == 'iOS':
            client_ios_count += 1
        else:
            client_web_count += 1
        if json_content['recordingNumberOfChannels'] == 2:
            stereo_count += 1
        elif json_content['recordingNumberOfChannels'] == 1:
            mono_count += 1

        current_item_id = json_content['itemId']
        # Find the item ID in the recording items of a schedule
        for schedule_id in schedule_recording_items:
            for item_id in schedule_recording_items[schedule_id]:
                if current_item_id == item_id:
                    file_extension = '.wav'
                    if json_content['contentType'] == 'audio/flac':
                        file_extension = '.flac'
                    file_path = key.replace('uploads/audio_and_metadata/metadata/', 'uploads/audio_and_metadata/')
                    file_path = file_path.replace('.json', file_extension)
                    #print(f'found recording for schedule {schedule_id} / item {item_id}, path = {file_path}')                    
                    schedule_recording_keys[schedule_id].append(file_path)

    else: # this is a user answer
        #print('skipping answer')
        answer_count += 1
        if json_content['clientPlatformName'] == 'Android':
            client_android_count += 1
            android_version = json_content['clientPlatformVersion']
            #print(f'Android {android_version}')
            if android_version in android_versions:
                android_versions[android_version] += 1
            else:
                android_versions[android_version] = 1
        elif json_content['clientPlatformName'] == 'iOS':
            client_ios_count += 1
            ios_version = json_content['clientPlatformVersion']
            #print(f'iOS {ios_version}')
            if ios_version in ios_versions:
                ios_versions[ios_version] += 1
            else:
                ios_versions[ios_version] = 1

total_minutes = total_seconds / 60
average_seconds = 0
if recording_count > 0:
    average_seconds = total_seconds / recording_count

target_hours = 10000
completed_hours = total_minutes / 60
completed_percentage = completed_hours / target_hours * 100

print(f'total time recorded: ~{round(total_minutes)} minutes')
print(f'average recording length: ~{round(average_seconds)} seconds')
print(f'longest recording: {max_recording_duration} seconds')
if min_recording_duration > 0:
    print(f'shortest recording: {min_recording_duration} seconds')
print(f'total size of metadata: {total_bytes} bytes')
print(f'number of objects: {object_count} ({recording_count} recordings / {answer_count} answers)')
print(f'file types: FLAC={flac_type_count} WAV={wav_type_count} unknown={unknown_type_count}')
print(f'channels: stereo={stereo_count} mono={mono_count}')
print(f'recordings from: Android={client_android_count} iOS={client_ios_count} web={client_web_count}')
print(f'recorded {completed_hours:.2f} / {target_hours} hours ({completed_percentage:.2f} %) of target')

print(f'{android_versions}')
print(f'{ios_versions}')

print('Recordings grouped by schedule:')
print(schedule_recording_keys)

print('Recording counts by schedule:')
for schedule_id in schedule_recording_keys.keys():
    count = len(schedule_recording_keys[schedule_id])
    print(f'{schedule_id}: {count}')

print('Metadata of longest recording:')
print(longest_recording_metadata)

now = datetime.datetime.utcnow()
timestamp = now.strftime('%Y-%m-%dT%H:%M:%SZ') # + ('-%02d' % (now.microsecond / 10000))

print('timestamp,total_minutes,average_seconds,min_recording_duration,max_recording_duration,total_bytes,recording_count,answer_count,flac_type_count,wav_type_count,unknown_type_count,client_android_count,client_ios_count,client_web_count')
print(f'{timestamp},{round(total_minutes)},{round(average_seconds)},{min_recording_duration},{max_recording_duration},{total_bytes},{recording_count},{answer_count},{flac_type_count},{wav_type_count},{unknown_type_count},{client_android_count},{client_ios_count},{client_web_count}')
