import { createSlice, createSelector, PayloadAction } from "@reduxjs/toolkit";
import { RootState, AppThunk } from "../../app/store";
import { RecorderAudio } from "../../utils/AudioRecorder";
import { initUpload, uploadAudioFile, deleteUpload } from "./UploadService";
import { getRecordingMetadata, getAnswersMetadata } from "./uploadUtil";
import { Metadata } from "./types";
import { onItemFinalized } from "../../utils/firebase";
import { PlaylistAnswer } from "../playlist/types";

type ItemUploadState = {
  isLoading: boolean;
  filePresignedUrl: string | null;
  metadataUploadSuccess: boolean | null;
  fileUploadSuccess: boolean | null;
  fileDeleteSuccess: boolean | null;
  recordingId: string | null;
};

type ItemUploadStateMap = { [key: string]: ItemUploadState };

type UploadState = {
  items: ItemUploadStateMap;
};

const initialItemUploadState: ItemUploadState = {
  isLoading: false,
  metadataUploadSuccess: null,
  fileUploadSuccess: null,
  fileDeleteSuccess: null,
  filePresignedUrl: null,
  recordingId: null,
};

const initialState: UploadState = { items: {} };

export const slice = createSlice({
  name: "upload",
  initialState,
  reducers: {
    metadataUploadStart: (
      state,
      action: PayloadAction<{ itemId: string; recordingId?: string }>
    ) => {
      const { itemId, recordingId } = action.payload;
      const item = {
        ...initialItemUploadState,
        isLoading: true,
        recordingId: recordingId || null,
      };
      item.isLoading = true;
      state.items[itemId] = item;
    },
    metadataUploadSuccess: (
      state,
      action: PayloadAction<{
        scheduleId: string;
        itemId: string;
        presignedUrl?: string;
      }>
    ) => {
      const { itemId, presignedUrl } = action.payload;
      if (!state.items[itemId]) return;
      state.items[itemId].isLoading = false;
      state.items[itemId].metadataUploadSuccess = true;
      state.items[itemId].filePresignedUrl = presignedUrl || null;
    },
    metadataUploadFail: (state, action: PayloadAction<{ itemId: string }>) => {
      const { itemId } = action.payload;
      if (!state.items[itemId]) return;
      state.items[itemId].isLoading = false;
      state.items[itemId].metadataUploadSuccess = false;
      state.items[itemId].filePresignedUrl = null;
    },
    fileUploadStart: (
      state,
      action: PayloadAction<{
        scheduleId: string;
        itemId: string;
        durationSeconds: number;
      }>
    ) => {
      const { itemId } = action.payload;
      if (!state.items[itemId]) return;
      state.items[itemId].isLoading = true;
    },
    fileUploadSuccess: (
      state,
      action: PayloadAction<{
        scheduleId: string;
        itemId: string;
        durationSeconds: number;
      }>
    ) => {
      const { itemId } = action.payload;
      if (!state.items[itemId]) return;
      state.items[itemId].isLoading = false;
      state.items[itemId].fileUploadSuccess = true;
    },
    fileUploadFail: (
      state,
      action: PayloadAction<{
        scheduleId: string;
        itemId: string;
        durationSeconds: number;
      }>
    ) => {
      const { itemId } = action.payload;
      if (!state.items[itemId]) return;
      state.items[itemId].isLoading = false;
      state.items[itemId].fileUploadSuccess = false;
    },
    fileDeleteStart: (state, action: PayloadAction<{ itemId: string }>) => {
      const { itemId } = action.payload;
      if (!state.items[itemId]) return;
      state.items[itemId].isLoading = true;
    },
    fileDeleteSuccess: (state, action: PayloadAction<{ itemId: string }>) => {
      const { itemId } = action.payload;
      if (!state.items[itemId]) return;
      state.items[itemId].isLoading = false;
      state.items[itemId].fileDeleteSuccess = true;
    },
    fileDeleteFail: (state, action: PayloadAction<{ itemId: string }>) => {
      const { itemId } = action.payload;
      if (!state.items[itemId]) return;
      state.items[itemId].isLoading = false;
      state.items[itemId].fileUploadSuccess = false;
    },
  },
});

export const {
  metadataUploadStart,
  metadataUploadFail,
  metadataUploadSuccess,
  fileUploadStart,
  fileUploadFail,
  fileUploadSuccess,
  fileDeleteStart,
  fileDeleteFail,
  fileDeleteSuccess,
} = slice.actions;

export const uploadAnswers = (props: {
  sessionId: string;
  scheduleId: string;
  itemId: string;
  answers: PlaylistAnswer[];
}): AppThunk => async (dispatch, getState) => {
  const { sessionId, scheduleId, itemId, answers } = props;
  const clientId = getState().user.clientId;
  try {
    dispatch(metadataUploadStart({ itemId }));
    const payload = getAnswersMetadata({
      clientId,
      sessionId,
      itemId,
      answers,
    });
    await initUpload(payload);
    dispatch(metadataUploadSuccess({ scheduleId, itemId }));
  } catch (error) {
    dispatch(metadataUploadFail({ itemId }));
  }
};

const doUpload = (
  scheduleId: string,
  itemId: string,
  presignedUrl: string,
  metadata: Metadata,
  blob: Blob
): AppThunk => async dispatch => {
  const durationSeconds = metadata.recordingDuration || 0;
  try {
    dispatch(fileUploadStart({ scheduleId, itemId, durationSeconds }));
    await uploadAudioFile(presignedUrl, blob);
    dispatch(
      fileUploadSuccess({
        scheduleId,
        itemId,
        durationSeconds,
      })
    );
    onItemFinalized(metadata);
  } catch (error) {
    dispatch(fileUploadFail({ scheduleId, itemId, durationSeconds }));
  }
};

export const uploadRecording = (props: {
  sessionId: string;
  scheduleId: string;
  itemId: string;
  audio: RecorderAudio;
}): AppThunk => async (dispatch, getState) => {
  const clientId = getState().user.clientId;
  const { sessionId, scheduleId, itemId, audio } = props;
  let presignedUrl = null;
  const { recordingId } = audio;
  const payload = getRecordingMetadata({
    clientId,
    sessionId,
    itemId,
    recordingId,
    audioInfo: audio,
  });

  try {
    dispatch(metadataUploadStart({ itemId, recordingId }));
    const response = await initUpload(payload);
    presignedUrl = response.presignedUrl;
    dispatch(metadataUploadSuccess({ scheduleId, itemId, presignedUrl }));
  } catch (error) {
    dispatch(metadataUploadFail({ itemId }));
    return;
  }

  dispatch(
    doUpload(scheduleId, itemId, presignedUrl, payload.metadata, audio.blob)
  );
};

export const deleteRecording = (
  itemId: string,
  recordingId: string
): AppThunk => async dispatch => {
  try {
    dispatch(fileDeleteStart({ itemId }));
    await deleteUpload(recordingId);
    dispatch(fileDeleteSuccess({ itemId }));
  } catch (error) {
    dispatch(fileDeleteFail({ itemId }));
  }
};

export const selectItemUploadState = createSelector(
  [
    (state: RootState) => state.upload.items,
    (state: RootState) => state.playlist.schedules,
    (state: RootState) => state.playlist.currentScheduleId,
  ],
  (items, schedules, currentScheduleId) => {
    const schedule = currentScheduleId ? schedules[currentScheduleId] : null;
    const currentItemId = schedule?.currentItemId;
    if (!currentItemId) return { ...initialItemUploadState };
    return items[currentItemId] || { ...initialItemUploadState };
  }
);

export const selectIsUploading = createSelector(
  [(state: RootState) => state.upload.items],
  items => {
    const itemArray = Object.values(items);
    return itemArray.some(i => i.isLoading);
  }
);

export default slice.reducer;
