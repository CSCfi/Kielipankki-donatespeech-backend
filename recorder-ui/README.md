# This is the UI for the Recorder application

### Development
1. Install packages
`npm install`

2. Run the app in the development mode, [http://localhost:3000](http://localhost:3000) in the browser
`npm start`

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Tech stack
* TypeScript
* React
* Redux (Redux Toolkit)
* Firebase for analytics

### Features
#### Audio Recording
* useAudioRecorder custom hook [AudioRecorder.ts](https://github.com/solita/recorder-backend/blob/dev/recorder-ui/src/utils/AudioRecorder.ts)
  - Manages MediaRecorder Web API and/or polyfill
  - Currently polyfill used always in order to produce WAV audio format
* AudioRecorderContext [AudioRecorderContext.ts](https://github.com/solita/recorder-backend/blob/dev/recorder-ui/src/utils/AudioRecorderContext.ts)
  - React Context for providing the audio recorder hook API
* useRecordingManager custom hook [useRecordingManager.ts](https://github.com/solita/recorder-backend/blob/dev/recorder-ui/src/utils/useRecordingManager.ts)
  - Triggers recording audio file upload when there is recording available
  - Automatically stops recording max duration has been exceeded
 
 #### Schedule View
 * Renders playlist and recorder status views
 * Recorder status view is displayed e.g. when microphone access is prompted
  
 #### Playlist
 * Playlist slice [playlistSlice.ts](https://github.com/solita/recorder-backend/blob/dev/recorder-ui/src/features/playlist/playlistSlice.ts)
   - Previous, current, next item logic
   - Donated recording durations
   - Playlist state stored in local storage / IndexedDB
 * Playlist.tsx
   - Main component
 * PlaylistItem.tsx
   - Renders both schedule item and schedule state ("start", "finish") items
  
#### User info
* User slice [userSlice.ts](https://github.com/solita/recorder-backend/blob/dev/recorder-ui/src/features/user/userSlice.ts)
   - Manages: client ID, analytics enabled/disabled and metadata answer values
   - User state stored in local storage / IndexedDB
  
#### Local storage / IndexedDB
* [localForage](https://localforage.github.io/localForage/) is used for storing playlist and user slice states
* [localStorageUtil.ts](https://github.com/solita/recorder-backend/blob/dev/recorder-ui/src/utils/localStorageUtil.ts)  

#### Unit tests
* Only the main playlist functionality is currently unit tested (ScheduleView.test.tsx)
  - Playlist walked through as expected
  - Metadata answers and recordings are uploaded as expected
* Integration test approach
* REST APIs and useAudioRecoder (MediaRecorder Web API) mocked
* TODO: run tests in AWS build phase (incompatible node.js versions?)
