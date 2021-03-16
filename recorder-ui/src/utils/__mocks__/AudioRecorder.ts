import { useState } from "react";
import { RecorderStatus, RecorderAudio } from "../AudioRecorder";

export const RECORDER_AUDIO_MOCK: RecorderAudio = {
  blob: new Blob(),
  recordingId: "recording-id",
  startTimestamp: "",
  durationSeconds: 0,
  audioType: "wav",
  mimeType: "mimetype",
};

export const useAudioRecorderMock = () => {
  const [status, setStatus] = useState<RecorderStatus>("Ready");
  const [audio, setAudio] = useState<RecorderAudio>();
  return {
    status,
    durationSeconds: null,
    isInitialized: status !== "NotInitialized",
    initialize: () => {
      if (status === "NotInitialized") setStatus("Ready");
    },
    startOrResume: () => {
      setStatus("Recording");
      return true;
    },
    pause: () => {
      setStatus("Ready");
      return true;
    },
    stop: () => {
      setStatus("Ready");
      setAudio(RECORDER_AUDIO_MOCK);
      return true;
    },
    getAudio: () => audio,
    clearAudio: () => {
      setAudio(undefined);
    },
  };
};
