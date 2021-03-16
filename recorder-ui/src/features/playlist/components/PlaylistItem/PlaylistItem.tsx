import React, { useState } from "react";
import { useAudioRecorderContext } from "../../../../utils/AudioRecorderContext";
import VideoItem from "../VideoElement/VideoElement";
import AudioItem from "../AudioElement/AudioElement";
import ItemTitle from "../ItemTitle/ItemTitle";
import ItemDescription from "../ItemDescription/ItemDescription";
import { DisplayedElement, ItemStatus } from "../../types";
import ItemStatusLabel from "../ItemStatusLabel/ItemStatusLable";
import { selectRecordingItemProgress } from "../../playlistSlice";
import { useSelector } from "react-redux";
import PromptElement from "../PromptElement/PromptElement";

import "./PlaylistItem.css";
import ArrowButton from "../ArrowButton/ArrowButton";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import TextElement from "../TextElement/TextElement";

type PlaylistItemProps = {
  element: DisplayedElement;
  itemStatus: ItemStatus;
  showPreviousButton: boolean;
  showNextButton: boolean;
  onNext: () => void;
  onPrevious: () => void;
};

const PlaylistItem: React.FunctionComponent<PlaylistItemProps> = ({
  element,
  showNextButton,
  showPreviousButton,
  onNext,
  onPrevious,
}) => {
  const recorder = useAudioRecorderContext();
  const recorderStatus = recorder?.status || "NotInitialized";
  const recordingItemProgress = useSelector(selectRecordingItemProgress);
  const [imageLoaded, setImageLoaded] = useState(false);

  const renderImage = () => {
    if (!element.url) return null;
    return (
      <img
        className={imageLoaded ? "playlist-item-image--loaded" : ""}
        src={element.url}
        alt={element.title}
        onLoad={() => setImageLoaded(true)}
      />
    );
  };

  const renderMediaElement = () => {
    if (!element.url) return null;

    switch (element.mediaType) {
      case "video":
        return (
          <VideoItem
            url={element.url}
            recorderStatus={recorderStatus}
            startTime={element.item?.startTime}
            endTime={element.item?.endTime}
            isRecordingItem={Boolean(element.item?.isRecording)}
          />
        );
      case "audio":
        return <AudioItem url={element.url} recorderStatus={recorderStatus} />;
      case "image":
        return renderImage();
      case "text":
        if (element.item?.kind === "prompt") {
          return renderImage();
        }
        return <TextElement text={element.url} />;
      default:
        return null;
    }
  };

  const useSmallDescription = element.item?.kind === "prompt";

  return (
    <Row className="playlist-item h-100 ">
      <Col className="h-100">
        <Row className="playlist-item-media align-items-center">
          {renderMediaElement()}
        </Row>
        <Row className={`playlist-item-text align-items-start`}>
          <Col className="playlist-item-text--content h-100">
            <Row className="playlist-item-label justify-content-center">
              <Col className="playlist-arrow-button" xs={3} md={2}>
                {showPreviousButton && (
                  <ArrowButton direction="backward" onClick={onPrevious} />
                )}
              </Col>
              <Col className="my-auto" xs={6} md={8}>
                <ItemStatusLabel
                  displayedElement={element}
                  recordingItemProgress={recordingItemProgress}
                />
              </Col>
              <Col className="playlist-arrow-button" xs={3} md={2}>
                {showNextButton && (
                  <ArrowButton direction="forward" onClick={onNext} />
                )}
              </Col>
            </Row>
            <Row className="playlist-item-content mb-1">
              <Col>
                {element.item?.kind === "prompt" ? (
                  <PromptElement element={element} />
                ) : (
                  <ItemTitle title={element.title} />
                )}
              </Col>
            </Row>
            <Row>
              <ItemDescription
                isSmall={useSmallDescription}
                description={element.body1}
              />
            </Row>
            <Row>
              <ItemDescription
                isSmall={useSmallDescription}
                description={element.body2}
              />
            </Row>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default PlaylistItem;
