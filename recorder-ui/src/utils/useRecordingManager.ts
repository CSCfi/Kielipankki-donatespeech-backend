import { useEffect, useState, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AudioRecorder } from "./AudioRecorder";
import {
  selectCurrentItemId,
  recordingChange,
  selectCurrentScheduleId,
  selectSessionId,
} from "../features/playlist/playlistSlice";
import { uploadRecording } from "../features/upload/uploadSlice";

const MAX_RECORDING_DURATION_SECONDS = 600; // 10 min

const useRecordingManager = (recorder: AudioRecorder | null) => {
  const dispatch = useDispatch();
  const currentItemId = useSelector(selectCurrentItemId);
  const currentScheduleId = useSelector(selectCurrentScheduleId);
  const sessionId = useSelector(selectSessionId);
  const [recordedItemId, setRecordedItemId] = useState<string | null>(null);
  const [previousRecorderStatus, setPreviousRecorderStatus] = useState(
    recorder?.status || "NotInitialized"
  );

  // Clean up when hook is destroyed
  const initRecorderRef = useRef(recorder);
  useEffect(() => {
    const initRecorder = initRecorderRef.current;
    return () => {
      if (initRecorder) initRecorder.stop();
    };
  }, []);

  // Manage states when recorded is started/stopped/paused
  const recorderStatus = recorder?.status || "NotInitialized";
  useEffect(() => {
    if (recorderStatus === previousRecorderStatus) return;

    if (recorderStatus === "Recording") {
      setRecordedItemId(currentItemId);
    } else if (previousRecorderStatus === "Recording" && recordedItemId) {
      dispatch(recordingChange({ itemId: recordedItemId, completed: true }));
    }

    setPreviousRecorderStatus(recorderStatus);
  }, [
    previousRecorderStatus,
    recorderStatus,
    currentItemId,
    recordedItemId,
    dispatch,
  ]);

  // Upload recording when recorder audio is available
  useEffect(() => {
    const audio = recorder?.getAudio();
    if (
      !recorder ||
      !audio ||
      !recordedItemId ||
      !currentScheduleId ||
      !sessionId
    )
      return;

    dispatch(
      uploadRecording({
        sessionId,
        scheduleId: currentScheduleId,
        itemId: recordedItemId,
        audio,
      })
    );
    recorder.clearAudio();
    setRecordedItemId(null);
  }, [recorder, recordedItemId, currentScheduleId, sessionId, dispatch]);

  const recordingDurationSeconds = recorder?.durationSeconds || 0;
  useEffect(() => {
    if (recordingDurationSeconds > MAX_RECORDING_DURATION_SECONDS) {
      recorder?.stop();
    }
  }, [recordingDurationSeconds, recorder]);

  return useCallback(() => recorder?.stop(), [recorder]);
};

export default useRecordingManager;
