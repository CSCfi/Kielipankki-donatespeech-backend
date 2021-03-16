import React from "react";
import Button from "react-bootstrap/Button";
import { useAudioRecorderContext } from "../../../../utils/AudioRecorderContext";
import { ItemStatus } from "../../types";
import { getFormattedDuration } from "../../PlaylistUtil";
import recordIcon from "./aanitys-ikoni.svg";

import "./RecordButton.css";

type RecordButtonProps = {
  itemState: ItemStatus;
};

const RecordButton: React.FC<RecordButtonProps> = ({ itemState }) => {
  const recorder = useAudioRecorderContext();
  if (!recorder) return null;

  const status = recorder.status;

  const handleClick = () => {
    if (!recorder) return;

    if (status === "Recording") {
      recorder.stop();
    } else {
      recorder.startOrResume();
    }
  };

  const getText = () => {
    if (itemState === "finish") {
      return "Äänitys valmis";
    }
    if (itemState === "recording") {
      return "Lopeta äänitys";
    }
    return "Äänitä";
  };

  const buttonDisabled = !recorder.isInitialized;
  const isRecording = recorder.status === "Recording";
  const recordingClass = isRecording ? "record-button--recording" : "";

  const durationSeconds =
    recorder.status === "Recording" ? recorder.durationSeconds || 0 : 0;
  const recDuration = getFormattedDuration(durationSeconds);

  return (
    <>
      <div className={`record-button ${recordingClass} d-flex`}>
        <div>
          <Button
            disabled={buttonDisabled}
            variant="dark"
            onClick={handleClick}
          >
            {getText()}
          </Button>
          <div className="record-button-duration mx-auto">{recDuration}</div>
        </div>
        {isRecording && <img src={recordIcon} alt="Äänitys" />}
      </div>
    </>
  );
};

export default RecordButton;
