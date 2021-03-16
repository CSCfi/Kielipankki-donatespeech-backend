export type Answer = {
  itemId: string;
  values: string[];
  timestamp?: number;
};

export type AnswerMap = { [key: string]: Answer };

export type UserMetadata = {
  answers: Answer[];
};

export type Metadata = {
  itemId: string;
  clientId: string;
  sessionId: string;
  recordingId?: string | null;
  recordingDuration?: number | null;
  recordingTimestamp?: string | null;
  recordingBitDepth?: number | null;
  recordingSampleRate?: number | null;
  recordingNumberOfChannels?: number | null;
  contentType?: string | null;
  user?: UserMetadata;
  clientPlatformName?: string;
  clientPlatformVersion?: string;
};

export type InitUploadDto = {
  filename: string;
  metadata: Metadata;
};

export type RecordingIdMap = { [key: string]: boolean };
