import { Metadata, InitUploadDto, Answer } from "./types";
import { AudioInfo } from "../../utils/AudioRecorder";
import { v4 as uuidv4 } from "uuid";
import { PlaylistAnswer } from "../playlist/types";

// Each browser provides varying values for MediaTrackSettings which do not match the actual
// values in the resulting WAV file. These hardcoded values were taken from the actual WAV files.
const SAMPLE_RATE = 48000;
const CHANNEL_COUNT = 1;
const BIT_DEPTH = 16;

export const getRecordingMetadata = (props: {
  clientId: string;
  sessionId: string;
  itemId: string;
  recordingId: string;
  audioInfo: AudioInfo;
}) => {
  const { clientId, sessionId, itemId, recordingId, audioInfo } = props;
  const metadata: Metadata = {
    clientId,
    sessionId,
    itemId,
    recordingId,
    recordingTimestamp: audioInfo?.startTimestamp,
    recordingDuration: audioInfo?.durationSeconds,
    recordingSampleRate: SAMPLE_RATE,
    recordingBitDepth: BIT_DEPTH,
    recordingNumberOfChannels: CHANNEL_COUNT,
    contentType: audioInfo ? audioInfo.mimeType : null,
    clientPlatformName: navigator.userAgent,
    clientPlatformVersion: navigator.userAgent,
  };

  const filenameSuffix = audioInfo?.audioType || "wav";
  return {
    filename: `${recordingId}.${filenameSuffix}`,
    metadata,
  } as InitUploadDto;
};

const getAnswerValues = (answer: PlaylistAnswer | null): string[] => {
  if (!answer) return [];

  let answers: string[] = [];

  const { value } = answer;
  if (!Array.isArray(value)) {
    const trimmed = value.trim();
    if (trimmed) {
      answers = [trimmed];
    }
  } else {
    answers = [...value];
  }

  if (answer.extraValue) {
    const otherValueIndex = answer.otherValueInConfiguration
      ? answers.findIndex(a => a === answer.otherValueInConfiguration)
      : -1;
    if (otherValueIndex !== -1) {
      // If "other" value was found in the answer values,
      // replace it with the extra value
      answers.splice(otherValueIndex, 1, answer.extraValue);
    } else {
      answers = [...answers, answer.extraValue];
    }
  }

  // Remove "other selection from the actual answer values"
  // in case it wasn't replaced by extra value
  if (answer.otherValueInConfiguration) {
    answers = answers.filter(a => a !== answer.otherValueInConfiguration);
  }

  return answers;
};

export const getAnswersMetadata = (props: {
  clientId: string;
  sessionId: string;
  itemId: string;
  answers: PlaylistAnswer[];
}) => {
  const { clientId, sessionId, itemId, answers } = props;
  const recordingId = uuidv4();
  const metadataAnswers = answers.map(a => {
    const values = getAnswerValues(a);
    return {
      itemId,
      values,
    } as Answer;
  });
  return {
    filename: `${recordingId}.wav`,
    metadata: {
      clientId,
      sessionId,
      itemId,
      recordingId,
      user: {
        answers: metadataAnswers,
      },
      clientPlatformName: navigator.userAgent,
      clientPlatformVersion: navigator.userAgent,
    },
  } as InitUploadDto;
};
