# Recorder backend

This repository contains the code and configuration for Recorder backend and ui applications. 
The deployment URLs are (replace with your own, but maintain the pattern):


| URL | Meaning |
|-----|---------|
| example.com | The main production site |
| endpoint.example.com | APIs for the production environment |
| dev.example.com | The development site |
| endpoint.dev.example.com | The development APIs |

Each directory contains its own README file with detailed information.

## [CDK](cdk/README.MD)

This folder contains CDK files that build the AWS environment from scratch.

## [recorder-backend](recorder-backend/README.MD)

The serverless backend for the project implemented in Python. 

## [recorder-ui](recorder-ui/README.MD)

The web UI files for the project.

## Other files worth a mention

| File | Purpose |
|------|---------|
| [serverless_build_spec.yml](serverless_build_spec.yml)| contains the CI commands to build 
the necessary infrastructure and backend resources, including the UI static files. |

## Metadata

Clients should collect the metadata specified here, and send it to the backend 
when initiating the upload. The metadata gets saved into a JSON file in Amazon S3 
and can later be used to get information about the recording.

### Technical metadata

Technical metadata is collected automatically by the client, and concerns the recording
and the client hardware and operating environment. The following metadata keys and
values should be present:

| Key | Value | Purpose |
|-----|-------|---------|
| `clientId` | UUID v4 | Installation ID of the client. Clients should maintain an ID as persistent as possible. With mobile applications, the installation ID is generated when the app is started up, if it does not already exist. Since removing the app from the device deletes all saved user data, this identifier is also destroyed when the app is uninstalled, so it will be recreated when the app is reinstalled and started. |
| `recordingId` | UUID v4 | The unique identifier of the recording, also used as the filename part of the recording and the metadata file. |
| `clientPlatformName` | string | Client platform. For mobile applications, this should be "Android" or "iOS". For web clients, use appropriate information from the `User-Agent` string. |
| `clientPlatformVersion` | string | Client platform version. For example, "13.3.1". For web clients, use appropriate information from the `User-Agent` string. |
| `recordingTimestamp` | string, ISO 8601 | The timestamp of the recording. Indicates the time when the recording was started. This value must be expressed as an ISO 8601 format, and in Universal Coordinated Time (UTC). Pay attention to the offsets between UTC and local time. Do not set timestamps in local time! Convert to UTC first. |
| `recordingDuration` | double | The duration of the recording in seconds and milliseonds. |
| `recordingBitDepth` | integer | The bit depth of the recording, for example, 8, 16, or 24. |
| `recordingSampleRate` | integer | The sample rate of the recording in Hz. For example, `22050` or `44100`. For variable bitrate (VBR) recordings, use the original sample rate before transcoding to VBR. |
| `recordingNumberOfChannels` | integer | The number of channels in the recording. For example, should be `1` for a mono recording, and `2` for stereo. | 
| `contentType` | string | The media type of the recording, for example `audio/mp4`. |

### User metadata

The user may be asked some questions during the recording, or some metadata may be automatically generated from the user profile.

User metadata should be collected in a dedicated object named `user`. See exmple below.

Metadata questions and their data types are indicated by the schedules. Each question must have a unique identifier, typically a string representing UUID v4. Typically
user metadata only needs to contain the identifiers and values of the metadata items:

| Key | Value | Purpose |
|-----|-------|---------|
| itemId | string (UUID v4) | Identified by the key. Value contains an answer to the metadata question. See example below. |
| timestamp | double | The time into the recording when the metadata question was presented to the user. Any timestamps that indicate past the duration of the recording should be considered invalid. |

All answers to metadata questions should be put inside the `user` object, inside an array with the key `answers`.

If user-related metadata is collected from other sources besides the schedule, it should follow the formats listed here.

At the time of this writing there are no automatically collected user metadata items
specified, but an example could be the user's location, which could be expressed like
this:

| Key | Value | Purpose |
|-----|-------|---------|
| `location` | JSON object with `latitude` and `longitude` keys | The user's geographical location in WGS84 coordinates |

### Example of metadata

```
{
    "clientId": "431217d9-d1b9-4f75-8479-90f1013f21b4",
    "recordingId": "661b32d1-4e13-4a89-804e-9aa50bf2b783",
    "recordingTimestamp": "2020-03-20T08:00:00.531547Z",
    "recordingDuration": 48.225,
    "recordingBitDepth": 16,
    "recordingSampleRate": 44100,
    "recordingNumberOfChannels": 1,
    "contentType": "audio/mp4",
    "clientPlatformName": "iOS",
    "clientPlatformVersion": "13.3.1",
    "user": {
        "answers": [
            {
                "itemId": "718a6814-c97f-4e5e-88f1-e22039487cc8",
                "value": "Lohja",
                "timestamp": "28.450"
            },
            {
                "itemId": "f6267df5-ed1c-4ebf-870d-fcb823f66664",
                "value": "31-40"
                "timestamp": "63.220"
            }
        ]
    }
}
```

## Schedules

The clients are driven by schedules described in JSON files and downloaded from the
server. This section describes the schedules in detail.

All elements of the schedule are intended to be presented to the user in a linear
back-to-back fashion with no overlap. For example, the user may be first shown a video
clip, and recording may start when the clip starts, or it may be started after the
user advances to the next schedule item.

The schedule items can be video or audio clips, or metadata questions.

### Description

The schedule contains a description that can be shown to the user by the client. for example in a list of schedules:

| Key | Value | Purpose |
|-----|-------|---------|
| `description` | string | The description of the schedule. |

### Metadata items

All metadata items are described using the same format:

| Key | Value | Purpose |
|-----|-------|---------|
| `itemId` | string (UUID v4) | The globally unique identifier of the question. Used to link the answers in the recording metadata to the original questions. |
| `kind` | string | `media` or `prompt` |
| `itemType` | string | For kind = `media`: `audio`, `video`, `yle-audio`, `yle-video`, `text` or `image`. For kind = `prompt`: `choice`, `multi-choice`, `super-choice` or `text` |
| `typeId` | string (MIME type) | The media type of the item, or `null` if not applicable. For example, `video/mp4` for MPEG-4 video, or `image/jpeg` for JPEG images, but `null` for prompts since they have no media type. |
| `url` | string (URL) | The URL of the item, if applicable. If the type is `yle-video` or `yle-audio`, use the YLE Areena program identifier as the URL (for example, `1-50000093`); the back-end will decrypt the media URL and return it in the place of the program identifier. |
| `description` | string | The description of the item. For kind = `prompt` is shown to the user when the metadata question item is presented. For media, may be displayed as a caption. |
| `options` | array of string | The options presented to the user when the kind = `prompt` and `itemType` = `choice`. Use an empty array for anything else. |
| `isRecording` | Boolean | If `true`, client should be recording while this item is presented. If `false`, recording is paused during this item. |

### Example of a schedule with items

```
{
    "scheduleId": "0b5cf885-5049-4e7a-83e0-05a63be53639",
    "description": "Kerro euroviisumuistosi",
    "items": [
        {
            "itemId": "ce3c6012-25f0-4c69-a0ad-c5dc8e41b795",
            "kind": "media",
            "itemType": "audio",
            "typeId": "audio/m4a",
            "url": "arvi-euroviisut.m4a",
            "description": "Arvi Lind esittelee",
            "options": [],
            "isRecording": false
        },
        {
            "itemId": "f6267df5-ed1c-4ebf-870d-fcb823f66664",
            "kind": "prompt",
            "itemType": "choice",
            "typeId": null,
            "url": null,
            "description": "Minkä ikäinen olet?",
            "options": ["1-10", "11-20", "21-30", "31-40", "41-50", "51-60", "61-70", "71-80", "81-90", "91-100", "Yli 100"],
            "isRecording": false
        },
        { 
            "itemId": "f3c991c0-e2f2-4d4d-980d-0883230d84a1",
            "kind": "media", 
            "itemType": "video",
            "typeId": "video/mp4",
            "url": "lordi-euroviisut.mp4",
            "description": "Videopätkä Lordin euroviisuvoitosta 2006",
            "options": [],
            "isRecording": true
        },
        {
            "itemId": "718a6814-c97f-4e5e-88f1-e22039487cc8",
            "kind": "prompt",
            "itemType": "text",
            "typeId": null,
            "url": null,
            "description": "Mikä on kotipaikkasi?",
            "options": [],
            "isRecording": true
        }
    ]
}
```

## Themes

A theme is a collection of one or more schedules. They are referred to 
by their unique identifiers (see Schedules above).

```
{
    "description": "Koronavirus 2020",
    "image": "https://example.com/something.jpg",
    "scheduleIds": [
        "0b5cf885-5049-4e7a-83e0-05a63be53639",
        "143a9f19-edda-40c5-9213-3c0615c7dcf0"
    ]
}
```

## Metadata item types

A metadata item is expressed as an item with `kind` = `prompt` and `itemType` as one of the following:

| itemType | Usage | Notes |
|-----|-------|---------|
| `text` | Simple text entry field |  |
| `choice` | List of options, user can choose one. | |
| `multi-choice` | List of options, possibly augmented by a text entry field. User can choose more than one, or enter text. | See `otherEntryLabel` note below. |
| `super-choice` | List of options augmented by a text entry field. User can choose one, or enter text. | If text is entered, it overrides any list selection. See `otherEntryLabel` note below. |

Note that the `super-choice` and `multi-choice` item types must have an `otherEntryLabel` field 
in the description. This indicates that the text entry field is desired, and also serves as the 
label of the text entry field. If this value is not present, the text field will not be created 
in the layout.
