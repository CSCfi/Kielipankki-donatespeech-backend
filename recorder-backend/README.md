# Recorder backend lambda functions

## REST APIs

### Initialize audio file upload and store related metadata call

```
POST v1/init-upload 
{
    "filename": "audio.m4a",
    "metadata": {
        "key" : "value"
    }
}

>>>

{
    "presignedUrl" : "https://s3/presigned-upload.com"
}
```

### Delete all uploaded metadata and audio for client with the given id or specific session or recording if those parameters are provided

```
DELETE v1/upload/[clientID]?session_id=<>&recording_id=<>
>>>

{
    "delete" : "ok"
}
```

### Load single playlist configuration from s3

```
GET v1/configuration/[ID]

>>>

#Whatever is stored in the configuration file in the s3 bucket configuration/[id].json

    "items": [
        {
            "itemId": "ce3c6012-25f0-4c69-a0ad-c5dc8e41b795",
            "kind": "media",
            "itemType": "audio",
            "typeId": "audio/m4a",
            "url": "arvi-euroviisut.m4a",
            "description": "Arvi Lind esittelee",
            "options": []
        },
        ...
    ]

```

### Load all playlist configurations

```
GET v1/configuration

>>>

# Returns all the configuration files in s3 with "configuration/" prefix. The data has the file id and content.
    [
        {"id": "27103f9e-2b03-48d0-b442-f38a6052cfe1",
         "content": {
            "items": [
                {
                    "itemId": "ce3c6012-25f0-4c69-a0ad-c5dc8e41b795",
                    "kind": "media",
                    "itemType": "audio",
                    "typeId": "audio/m4a",
                    "url": "arvi-euroviisut.m4a",
                    "description": "Arvi Lind esittelee",
                    "options": []
                },
                ...
            ]
        ...
    ]


```

### Load single theme from s3

```
GET v1/theme/[ID]

>>>>

#What ever is stored in the theme file in the s3 bucket theme/[id].json
{
    "description": "Koronavirus 2020",
    "image": "https://jdjalassljkdda/something.jpg",
    "scheduleIds": [
        "0b5cf885-5049-4e7a-83e0-05a63be53639",
        "143a9f19-edda-40c5-9213-3c0615c7dcf0"
    ]
}

```

### Load all themes

```
GET v1/theme/

>>>

# Returns all the theme files in s3 with "theme/" prefix. The data has the file id and content.
    [
        {"id": "27103f9e-2b03-48d0-b442-f38a6052cfe1",
         "content": {
            "items": [
                {
                    "description": "Koronavirus 2020",
                    "image": "https://jdjalassljkdda/something.jpg",
                    "scheduleIds": [
                        "0b5cf885-5049-4e7a-83e0-05a63be53639",
                        "143a9f19-edda-40c5-9213-3c0615c7dcf0"
                    ]
                },
                ...
            ]
        ...
    ]

```

### To test locally setup AWS-credentials and use ipython

```python
%load_ext autoreload
%autoreload 2
import os  
os.environ['CONTENT_BUCKET_NAME'] = 'recorder-test'
os.environ['YLE_CLIENT_ID'] ="XXX"
os.environ['YLE_CLIENT_KEY'] = "XXX"
os.environ['YLE_DECRYPT'] = "XXX"

from handler import *
init_upload({'body': '{"filename":"jee", "metadata": {"kukkuu": "jee"}}'}, {})

```
