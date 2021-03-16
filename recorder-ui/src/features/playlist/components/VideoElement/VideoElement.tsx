import React, { useCallback, useRef, useState, useEffect } from "react";
import ReactPlayer from "react-player";
import { v4 as uuidv4 } from "uuid";
import { RecorderStatus } from "../../../../utils/AudioRecorder";

import playIcon from "./playButton.svg";
import "./VideoElement.css";

type VideoElementProps = {
  url: string;
  recorderStatus: RecorderStatus;
  isRecordingItem: boolean;
  startTime?: number;
  endTime?: number;
};

const VideoElement: React.FC<VideoElementProps> = ({
  url,
  recorderStatus,
  isRecordingItem,
  startTime,
  endTime,
}) => {
  const [endTimeExceeded, setEndTimeExceeded] = useState(false);
  const recorderRef = useRef<ReactPlayer | null>(null);
  const [playerId, setPlayerId] = useState(uuidv4());
  const [isVideoReady, setIsVideoReady] = useState<boolean>(false);
  const isAutoplay = isRecordingItem;
  const [isWaitingForUserPlay, setIsWaitingForUserPlay] = useState<boolean>(
    !isAutoplay
  );
  const [isPlay, setIsPlay] = useState(false);

  const seekToStart = useCallback(() => {
    if (startTime != null) {
      recorderRef.current?.seekTo(startTime);
    }
  }, [startTime]);

  const refCb = useCallback(
    (instance: ReactPlayer | null) => {
      recorderRef.current = instance;
      if (startTime != null) {
        instance?.seekTo(startTime);
      }
    },
    [startTime]
  );

  useEffect(() => {
    seekToStart();
  }, [seekToStart]);

  useEffect(() => {
    // ReactPlayer does not seem to respect `playing` prop when
    // video playback has been started by the user.
    // As a workaround, force remount ReactPlayer when endTime
    // has been exceeded.
    if (endTimeExceeded && !isAutoplay) {
      setPlayerId(uuidv4());
    }
  }, [endTimeExceeded, isAutoplay]);

  useEffect(() => {
    if (isPlay) {
      const doSeek = isAutoplay || isWaitingForUserPlay || endTimeExceeded;
      if (doSeek) {
        seekToStart();
      }

      setIsWaitingForUserPlay(false);
      setEndTimeExceeded(false);
    }
  }, [isPlay, isAutoplay, isWaitingForUserPlay, endTimeExceeded, seekToStart]);

  const handlePlay = () => {
    setIsPlay(true);
  };

  const handleReady = () => {
    setIsVideoReady(true);
  };

  const handlePause = () => {
    setIsPlay(false);
  };

  const handleProgress = ({ playedSeconds }: { playedSeconds: number }) => {
    if (!endTime || !recorderRef.current) return;

    if (playedSeconds > endTime) {
      setEndTimeExceeded(true);
    }
  };

  const isPlaying = recorderStatus === "Recording" && !endTimeExceeded;
  const isMuted = isRecordingItem;
  const autoPlayClass = isAutoplay ? "video-element--autoplay" : "";
  // For triggering icon positioning on Safari
  const iconDisplayClass = isVideoReady ? "video-element-icon--display" : "";
  return (
    <>
      <div
        className={`video-element h-100 embed-responsive  embed-responsive-16by9 ${autoPlayClass}`}
      >
        <ReactPlayer
          key={playerId}
          ref={refCb}
          controls={!isRecordingItem}
          muted={isMuted}
          url={url}
          playing={isPlaying}
          progressInterval={1000}
          onProgress={handleProgress}
          onPlay={handlePlay}
          onReady={handleReady}
          onPause={handlePause}
          playsinline
          config={{ file: { attributes: { disablePictureInPicture: true } } }}
        />
      </div>
      {isWaitingForUserPlay && (
        <div className={`video-element-icon ${iconDisplayClass}`}>
          <img
            className="video-element-icon-img"
            alt="Käynnistä video"
            src={playIcon}
          />
        </div>
      )}
    </>
  );
};

export default VideoElement;
