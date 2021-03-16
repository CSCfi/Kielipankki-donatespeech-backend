import React, { useRef, useEffect } from "react";
import { RecorderStatus } from "../../../../utils/AudioRecorder";

type AudioElementProps = {
  url: string;
  recorderStatus: RecorderStatus;
};

const AudioElement: React.FC<AudioElementProps> = ({ url, recorderStatus }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    const isRecording = recorderStatus === "Recording";
    if (isRecording) {
      audioRef.current.pause();
    }
  }, [recorderStatus]);

  return (
    <div className="audio-item embed-responsive">
      <audio ref={audioRef} controls src={url} />
    </div>
  );
};

export default AudioElement;
