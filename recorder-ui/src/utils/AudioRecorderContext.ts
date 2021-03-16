import React, { useContext } from "react";
import { AudioRecorder } from "./AudioRecorder";

export const AudioRecorderContext = React.createContext<AudioRecorder | null>(
  null
);

export const AudioRecorderProvider = AudioRecorderContext.Provider;
export const useAudioRecorderContext = () => useContext(AudioRecorderContext);
