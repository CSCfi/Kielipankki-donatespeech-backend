import React from "react";
import "./TotalRecordingDuration.css";
import { useSelector } from "react-redux";
import { selectTotalRecordingDuration } from "../../playlistSlice";
import { getFromattedTotalDuration } from "../../PlaylistUtil";

type TotalRecordingDurationProps = {
  label: string;
};

const TotalRecordingDuration: React.FC<TotalRecordingDurationProps> = ({
  label,
}) => {
  const totalRecDurationSeconds = useSelector(selectTotalRecordingDuration);
  return (
    <div className="total-recording-duration">
      <div className="total-recording-duration--label">{label}</div>
      <div className="total-recording-duration--value float-right">
        {getFromattedTotalDuration(totalRecDurationSeconds)}
      </div>
    </div>
  );
};

export default TotalRecordingDuration;
