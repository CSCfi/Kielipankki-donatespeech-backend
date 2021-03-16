import { useState, useEffect, useRef, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import AudioRecorder from "audio-recorder-polyfill";
import moment, { Moment } from "moment";

export type AudioType = "opus" | "wav";

export type AudioInfo = {
  recordingId: string;
  startTimestamp: string;
  durationSeconds: number;
  audioType: AudioType;
  mimeType: string;
  settings?: MediaTrackSettings;
};

export type RecorderAudio = AudioInfo & {
  blob: Blob;
};

const AUDIO_MIME_TYPES: { [key in AudioType]: string } = {
  opus: "audio/webm;codecs=opus",
  wav: "audio/wave",
};

let AUDIO_TYPE: AudioType = "opus";
let IS_SUPPORTED: boolean = Boolean(navigator.mediaDevices);
const USE_WAV_ONLY = true;

if (!window.MediaRecorder || USE_WAV_ONLY) {
  window.MediaRecorder = AudioRecorder;
  IS_SUPPORTED = IS_SUPPORTED && !AudioRecorder.notSupported;
  AUDIO_TYPE = "wav";
}

type AudioRecorderProps = {
  onStart?: () => void;
  onStop?: (blob: Blob) => void;
};

export type AudioRecorder = {
  status: RecorderStatus;
  durationSeconds: number | null;
  isInitialized: boolean;
  initialize: () => void;
  startOrResume: () => boolean;
  pause: () => boolean;
  stop: () => boolean;
  getAudio: () => RecorderAudio | undefined;
  clearAudio: () => void;
};

type AudioRecorderHook = (props?: AudioRecorderProps) => AudioRecorder;

export type RecorderStatus =
  | "NotInitialized"
  | "NotSupported"
  | "WaitingForAccess"
  | "AccessDenied"
  | "Ready"
  | "Recording"
  | "Paused";

export const isStartOrResumeAllowed = (status: RecorderStatus) => {
  return status === "Ready" || status === "Paused";
};

export const isRecording = (status: RecorderStatus) => {
  return status === "Recording";
};

export const isStopAllowed = (status: RecorderStatus) => {
  return status === "Recording" || status === "Paused";
};

export const isInitializeAllowed = (status: RecorderStatus) => {
  return status === "NotInitialized";
};

const getBlob = (chunks: Blob[]) => {
  let type = chunks.length > 0 ? chunks[0].type : undefined;
  if (!type) {
    return;
  }

  // NOTE: Polyfill sets blob type to audio/wav which
  // causes blob upload to fail. Force type to
  // audio/wave.
  if (type.startsWith("audio/wav")) {
    type = "audio/wave";
  }

  return new Blob(chunks, { type });
};

const getMimeType = () => AUDIO_MIME_TYPES[AUDIO_TYPE];

export const useAudioRecorder: AudioRecorderHook = props => {
  const onStart = props?.onStart;
  const onStop = props?.onStop;

  const mediaRecorderRef = useRef<MediaRecorder | null>();
  const chunksRef = useRef<Blob[]>([]);
  const [status, setStatus] = useState<RecorderStatus>("NotInitialized");
  const [isInitializeRequested, setIsInitializedRequested] = useState(false);
  const initialServices = useRef({
    onStart,
    onStop,
  });
  const [startTime, setStartTime] = useState<Moment | null>(null);
  const [startTimestamp, setStartTimestamp] = useState<string>();
  const [tick, setTick] = useState<Moment | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [recordingId, setRecordingId] = useState<string>();

  const createAudioStreamAndUpdateStatus = useCallback(async () => {
    if (!isInitializeRequested) {
      setStatus("NotInitialized");
      return null;
    }

    if (!IS_SUPPORTED) {
      setStatus("NotSupported");
      return null;
    }

    setStatus("WaitingForAccess");

    let audioStream: MediaStream;
    try {
      audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
    } catch (error) {
      setStatus("AccessDenied");
      return null;
    }

    return audioStream;
  }, [isInitializeRequested]);

  const onstart = () => {
    setStatus("Recording");
    setRecordingId(undefined);
    chunksRef.current = [];
    if (initialServices.current.onStart) {
      initialServices.current.onStart();
    }
  };
  const onpause = () => setStatus("Paused");
  const onresume = () => setStatus("Recording");
  const ondataavailable = (event: BlobEvent) =>
    chunksRef.current.push(event.data);
  const onstop = () => {
    setStatus("Ready");
    setRecordingId(uuidv4());

    if (initialServices.current.onStop) {
      const blob = getBlob(chunksRef.current);
      if (!blob) {
        return;
      }

      initialServices.current.onStop(blob);
    }
  };

  useEffect(() => {
    const initAudioRecorder = async () => {
      const audio = await createAudioStreamAndUpdateStatus();
      if (!audio) {
        return;
      }

      const recorder = new MediaRecorder(audio, {
        mimeType: getMimeType(),
      });
      recorder.addEventListener("dataavailable", ondataavailable);
      recorder.addEventListener("start", onstart);
      recorder.addEventListener("pause", onpause);
      recorder.addEventListener("resume", onresume);
      recorder.addEventListener("stop", onstop);

      mediaRecorderRef.current = recorder;
      setStatus("Ready");
    };

    initAudioRecorder();

    return () => {
      const recorder = mediaRecorderRef.current;
      if (recorder) {
        recorder.removeEventListener("dataavailable", ondataavailable);
        recorder.removeEventListener("start", onstart);
        recorder.removeEventListener("pause", onpause);
        recorder.removeEventListener("resume", onresume);
        recorder.removeEventListener("stop", onstop);
      }
    };
  }, [initialServices, createAudioStreamAndUpdateStatus]);

  // Rec duration timer
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    if (status !== "Recording") {
      timerRef.current = null;
      return;
    }

    timerRef.current = setInterval(() => setTick(moment()), 1000);
    setStartTime(moment());
    setTick(moment());
  }, [status]);

  useEffect(() => {
    if (startTime) setStartTimestamp(startTime.utc().toISOString());
  }, [startTime, tick]);

  const startOrResume = () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state === "recording") {
      return false;
    }

    if (recorder.state === "inactive") {
      recorder.start();
    } else {
      recorder.resume();
    }

    return true;
  };

  const pause = () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state !== "recording") {
      return false;
    }

    recorder.pause();
    return true;
  };

  const stop = () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state === "inactive") {
      return false;
    }

    recorder.stop();
    return true;
  };

  const getTrackSettings = () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder) {
      return undefined;
    }

    const tracks = recorder.stream.getAudioTracks();
    const track = tracks.length > 0 ? tracks[0] : undefined;
    return track ? { ...track.getSettings() } : undefined;
  };

  const durationSeconds =
    startTime && tick ? tick.diff(startTime, "seconds", true) : null;

  const getAudio = () => {
    const chunks = chunksRef.current;
    const blob = getBlob(chunks);
    if (!blob || !recordingId) {
      return undefined;
    }

    const settings = getTrackSettings();

    return {
      recordingId,
      blob,
      startTimestamp: startTimestamp || "",
      durationSeconds: durationSeconds || 0,
      audioType: AUDIO_TYPE,
      mimeType: getMimeType(),
      settings,
    };
  };

  const clearAudio = () => {
    setRecordingId(undefined);
    chunksRef.current = [];
  };

  return {
    status,
    startTimestamp,
    durationSeconds,
    isSupported: IS_SUPPORTED,
    isInitialized:
      status === "Ready" || status === "Recording" || status === "Paused",
    initialize: () => setIsInitializedRequested(true),
    startOrResume,
    pause,
    stop,
    getAudio,
    clearAudio,
  };
};
