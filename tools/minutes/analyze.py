import json
import datetime
import os
import sys

def get_file_names(path):
    all_file_names = []
    for root_dir, dir_names, file_names in os.walk(path):
        for f in file_names:
            if not f.endswith('.json'):
                continue
            if f.endswith('MetadataWithoutRecording.json'):
                continue
            all_file_names.append(os.path.join(root_dir, f))
    return all_file_names

def get_duration(recording):
    return recording['recordingDuration']

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

def main(path):
    all_file_names = get_file_names(path)
    #print(all_file_names)

    all_recordings = []
    zero_count = 0

    total_minutes = 0
    total_seconds = 0
    total_bytes = 0

    counts = {'answer': 0, 'recording': 0, 
              'flac_type': 0, 'wav_type': 0, 'unknown_type': 0, 
              'client_android': 0, 'client_ios': 0, 'client_web': 0, 
              'stereo': 0, 'mono': 0}

    min_recording_duration = 0
    max_recording_duration = 0
    average_recording_duration = 0

    # Save the metadata of the longest recording so that we can
    # easily find it and remove it if necessary.
    longest_recording_metadata = None

    for file_name in all_file_names:
        json_data = None
        #print(f'reading "{file_name}"')
        with open(file_name, 'r') as json_file:
            json_data = json_file.read()
        data = json.loads(json_data)

        total_bytes += len(data)

        if is_valid_recording(data):
            seconds = int(data['recordingDuration'])
            if seconds == 0:
                print(f'recording has zero duration: {data}')
                zero_count += 1
                continue

            #print(f'found a recording of {seconds} seconds')
            total_seconds += seconds
            counts['recording'] += 1
            if seconds < min_recording_duration:
                min_recording_duration = seconds
            if seconds > max_recording_duration:
                max_recording_duration = seconds
                longest_recording_metadata = data
            if data['contentType'] == 'audio/flac':
                counts['flac_type'] += 1
            elif data['contentType'] == 'audio/wave':
                counts['wav_type'] += 1
            else:
                counts['unknown_type'] += 1
            if data['clientPlatformName'] == 'Android':
                counts['client_android'] += 1
            elif data['clientPlatformName'] == 'iOS':
                counts['client_ios'] += 1
            else:
                counts['client_web'] += 1
            if data['recordingNumberOfChannels'] == 2:
                counts['stereo'] += 1
            elif data['recordingNumberOfChannels'] == 1:
                counts['mono'] += 1
            duration = data['recordingDuration']

            d = {'recordingDuration': seconds}
            d['clientId'] = data['clientId']
            d['recordingId'] = data['recordingId']
            if 'sessionId' in data:
                d['sessionId'] = data['sessionId']

            all_recordings.append(d)

        else: # this is a user answer
            counts['answer'] += 1

    print(f'Have {len(all_file_names)} files')

    print(sorted(all_recordings, key=get_duration))

    total_minutes = total_seconds / 60
    average_seconds = 0
    recording_count = counts['recording']
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
    print(f'recordings: {counts["recording"]} / answers: {counts["answer"]}')
    print(f'file types: FLAC={counts["flac_type"]} WAV={counts["wav_type"]} unknown={counts["unknown_type"]}')
    print(f'channels: stereo={counts["stereo"]} mono={counts["mono"]}')
    print(f'recordings from: Android={counts["client_android"]} iOS={counts["client_ios"]} web={counts["client_web"]}')
    print(f'recorded {completed_hours:.2f} / {target_hours} hours ({completed_percentage:.2f} %) of target')

    now = datetime.datetime.utcnow()
    timestamp = now.strftime('%Y-%m-%dT%H:%M:%SZ') # + ('-%02d' % (now.microsecond / 10000))
    print(f'{timestamp},{round(total_minutes)},{round(average_seconds)},{min_recording_duration},{max_recording_duration},{total_bytes},{counts["recording"]},{counts["answer"]},{counts["flac_type"]},{counts["wav_type"]},{counts["unknown_type"]},{counts["client_android"]},{counts["client_ios"]},{counts["client_web"]}')

if __name__ == "__main__":
    main(sys.argv[1])
