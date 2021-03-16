import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import PlaylistItem from "../PlaylistItem/PlaylistItem";
import "./Playlist.css";
import PlaylistButton from "../PlaylistButton/PlaylistButton";
import RecordButton from "../RecordButton/RecordButton";
import { useAudioRecorderContext } from "../../../../utils/AudioRecorderContext";
import {
  scheduleIdChange,
  selectCurrentItem,
  itemIdChange,
  selectPrevioiusItemId,
  selectNextItemId,
  selectIsItemCompleted,
  selectCurrentItemAnswer,
  selectCurrentScheduleId,
  recordingChange,
  selectScheduleStatus,
  selectCurrentSchedule,
  scheduleStatusChange,
  selectIsScheduleItemAnswerDirty,
  selectSessionId,
} from "../../playlistSlice";
import { uploadAnswers } from "../../../upload/uploadSlice";
import {
  getItemState,
  getDisplayedScheduleElement,
  getDisplayedElement,
} from "../../PlaylistUtil";
import { DisplayedItemProps } from "../../types";
import {
  fetchConfiguration,
  selectIsLoadingConfiguration,
  selectConfigurationError,
} from "../../../configuration/configurationSlice";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {
  onScheduleSelected,
  onScheduleCompleted,
  onScheduleItemCompleted,
  onScheduleItemSelected,
} from "../../../../utils/firebase";
import InviteFriend from "./InviteFriend.tsx/InviteFriend";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";

type PlaylistProps = {
  onRecorderResetRequested: () => void;
  onQuit: () => void;
};

const Playlist: React.FC<PlaylistProps> = ({
  onQuit,
  onRecorderResetRequested,
}) => {
  const recorder = useAudioRecorderContext();
  const item = useSelector(selectCurrentItem);
  const previousItemId = useSelector(selectPrevioiusItemId);
  const nextItemId = useSelector(selectNextItemId);
  const isItemCompleted = useSelector(selectIsItemCompleted);
  const currentScheduleId = useSelector(selectCurrentScheduleId);
  const answer = useSelector(selectCurrentItemAnswer);
  const scheduleStatus = useSelector(selectScheduleStatus);
  const currentSchedule = useSelector(selectCurrentSchedule);
  const sessionId = useSelector(selectSessionId);
  const isScheduleItemAnswerDirty = useSelector(
    selectIsScheduleItemAnswerDirty
  );
  const isLoadingConfiguration = useSelector(selectIsLoadingConfiguration);
  const configurationError = useSelector(selectConfigurationError);
  const { scheduleId } = useParams();
  const dispatch = useDispatch();

  const isRecording = recorder?.status === "Recording";
  const itemState = getItemState({ item, isRecording, isItemCompleted });

  // Call reset callback when unmounted
  const initResetReqRef = useRef(onRecorderResetRequested);
  const itemId = item?.itemId;
  const itemTitle = item?.title || item?.start?.title || "";
  useEffect(() => {
    const initOnResetReq = initResetReqRef.current;
    return () => {
      if (!initOnResetReq) return;
      initOnResetReq();
    };
  }, [itemId, scheduleId]);

  // Load schedule configuration
  useEffect(() => {
    if (!currentScheduleId) return;
    dispatch(fetchConfiguration(currentScheduleId));
  }, [currentScheduleId, dispatch]);

  // Initialize recorder
  useEffect(() => {
    recorder?.initialize();
  }, [recorder]);

  // Sync location parameter schedule ID to the store
  useEffect(() => {
    if (scheduleId !== currentScheduleId) {
      dispatch(scheduleIdChange(scheduleId || null));
    }
  }, [dispatch, scheduleId, currentScheduleId, currentSchedule]);

  // Trigger item change if none is currently active
  useEffect(() => {
    if (scheduleStatus === "playlist" && !item && nextItemId) {
      dispatch(itemIdChange(nextItemId));
    }
  }, [dispatch, item, nextItemId, scheduleStatus]);

  // Send analytics event when item is changed
  useEffect(() => {
    if (itemId) {
      onScheduleItemSelected({ itemId, title: itemTitle });
    }
  }, [itemId, itemTitle]);

  // Send analytics event when schedule is changed
  const scheduleTitle =
    currentSchedule?.title || currentSchedule?.start?.title || "";
  useEffect(() => {
    if (currentScheduleId) {
      onScheduleSelected({
        scheduleId: currentScheduleId,
        title: scheduleTitle,
      });
    }
  }, [currentScheduleId, scheduleTitle]);

  if (!recorder) {
    return null;
  }

  if (configurationError) {
    return <h3>Teeman haku epäonnistui</h3>;
  }

  const handlePrevious = () => {
    if (!previousItemId) return;
    dispatch(itemIdChange(previousItemId));
  };

  const handleNextScheduleState = () => {
    if (scheduleStatus === "start") {
      dispatch(scheduleStatusChange("playlist"));
      return;
    }

    if (scheduleStatus === "finish") {
      onQuit();
      return;
    }
  };

  const isConsideredCompleted = () => {
    if (!item) return false;
    if (item.kind === "prompt") return hasAnswer();
    if (item.isRecording) return itemState === "finish";
    return true;
  };

  const handleNext = () => {
    if (!nextItemId && scheduleStatus === "playlist") {
      dispatch(scheduleStatusChange("finish"));
      if (currentSchedule) onScheduleCompleted(currentSchedule);
      return;
    }

    dispatch(itemIdChange(nextItemId));

    if (isConsideredCompleted()) {
      onScheduleItemCompleted(item, answer);
    }

    if (item.isRecording) {
      dispatch(recordingChange({ itemId: item.itemId, completed: false }));
    }

    if (answer && isScheduleItemAnswerDirty && currentScheduleId && sessionId) {
      const props = {
        sessionId,
        scheduleId: currentScheduleId,
        itemId: item.itemId,
        answers: [answer],
      };
      dispatch(uploadAnswers(props));
    }
  };

  const handleRetake = () => {
    dispatch(recordingChange({ itemId: item.itemId, completed: false }));
  };

  const renderContent = () => {
    switch (scheduleStatus) {
      case "start":
      case "finish":
        return renderScheduleStatusElement();
      case "playlist":
        return renderElement();
    }
  };

  const showPreviousButton =
    Boolean(previousItemId) &&
    recorder.isInitialized &&
    recorder.status !== "Recording" &&
    scheduleStatus === "playlist" &&
    (!item?.isRecording || itemState !== "finish");
  const showNextButton =
    Boolean(currentSchedule) &&
    recorder.isInitialized &&
    (itemState === "start" || !item?.isRecording) &&
    scheduleStatus === "playlist";

  const renderScheduleStatusElement = () => {
    if (!currentSchedule) return null;
    const element = getDisplayedScheduleElement(
      scheduleStatus,
      currentSchedule
    );
    return element ? (
      <PlaylistItem
        itemStatus={itemState}
        element={element}
        showNextButton={showNextButton}
        showPreviousButton={showPreviousButton}
        onNext={handleNextScheduleState}
        onPrevious={handlePrevious}
      />
    ) : null;
  };

  const hasAnswer = () => Boolean(answer?.value || answer?.extraValue);

  const renderElement = () => {
    if (!item) return null;

    const props: DisplayedItemProps = {
      item,
      itemState,
    };
    const element = getDisplayedElement(props);

    return (
      <PlaylistItem
        itemStatus={itemState}
        key={element.item?.itemId || element.title}
        element={element}
        showNextButton={showNextButton}
        showPreviousButton={showPreviousButton}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    );
  };

  const renderFooterControl = () => {
    if (scheduleStatus === "start") {
      return <PlaylistButton text="Aloita" onClick={handleNextScheduleState} />;
    }
    if (scheduleStatus === "finish") {
      return (
        <>
          <InviteFriend className="mb-1" />
          <PlaylistButton
            buttonType="outline"
            text="Lahjoita lisää"
            onClick={onQuit}
          />
        </>
      );
    }

    const isRecordingItem = item && item.isRecording;
    if (isRecordingItem) {
      return itemState === "finish" ? (
        <>
          <PlaylistButton className="mb-1" text="Jatka" onClick={handleNext} />
          <PlaylistButton
            text="Kokeile uudelleen"
            buttonType="outline"
            onClick={handleRetake}
          />
        </>
      ) : (
        <RecordButton itemState={itemState} />
      );
    }

    const isPromptItem = item && item.kind === "prompt";
    if (isPromptItem) {
      return (
        <PlaylistButton
          text={`${hasAnswer() ? "Jatka" : "Ohita kysymys"}`}
          buttonType={hasAnswer() ? "normal" : "text"}
          onClick={handleNext}
        />
      );
    }

    return isLoadingConfiguration ? null : (
      <PlaylistButton text="Jatka" buttonType="normal" onClick={handleNext} />
    );
  };

  const isLargeFooter = itemState === "finish" || scheduleStatus === "finish";
  const smallFooterClass = isLargeFooter ? "" : "playlist--small-footer";

  return (
    <Row className={`playlist ${smallFooterClass}`}>
      <Col className="h-100 d-flex flex-column" xs={12}>
        <Row className="playlist-content align-items-center">
          <Col xs={12} className="h-100">
            {isLoadingConfiguration ? <LoadingSpinner /> : renderContent()}
          </Col>
        </Row>
        <Row className="playlist-footer align-items-center">
          <Col className="mx-auto h-100">{renderFooterControl()}</Col>
        </Row>
      </Col>
    </Row>
  );
};

export default Playlist;
