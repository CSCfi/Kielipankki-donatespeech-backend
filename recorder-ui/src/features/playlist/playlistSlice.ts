import { createSlice, createSelector, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { RootState, AppThunk } from "../../app/store";
import { PlaylistAnswer, PlaylistRecording, ScheduleStatus } from "./types";
import { loadState } from "../../utils/localStorageUtil";
import { selectLocalizedConfigurations } from "../configuration/configurationSlice";
import {
  metadataUploadSuccess,
  fileUploadStart,
  fileUploadFail,
} from "../upload/uploadSlice";

// NOTE: Update schema version when playlist state schema is changed
// so that it is no longer compatible with earlier schema (breaking changes).
// Playlist state is loaded initialy from browser's local storage,
// and unsupported obsolete schema might cause errors and crashes.
const STATE_SCHEMA_MAJOR_VERSION = 9;

// NOTE: Update STATE_SCHEMA_MAJOR_VERSION if braking changes are introduced
export type ScheduleState = {
  sessionId: string;
  status: ScheduleStatus;
  currentItemId: string | null;
  answers: { [key: string]: { isDirty: boolean } };
  recordings: { [key: string]: boolean };
};

const createInitialScheduleState = (): ScheduleState => {
  return {
    sessionId: uuidv4(),
    status: "start",
    currentItemId: null,
    answers: {},
    recordings: {},
  };
};

// NOTE: Update STATE_SCHEMA_MAJOR_VERSION if braking changes are introduced
export type ScheduleStatistics = {
  recordingDurationSeconds: { [key: string]: number };
  isScheduleCompleted: boolean;
};

const initialScheduleStats: ScheduleStatistics = {
  recordingDurationSeconds: {},
  isScheduleCompleted: false,
};

// NOTE: Update STATE_SCHEMA_MAJOR_VERSION if braking changes are introduced
export type PlaylistState = {
  schemaVersion: number;
  initialized: boolean;
  currentScheduleId: string | null;
  schedules: { [key: string]: ScheduleState };
  scheduleStatistics: { [key: string]: ScheduleStatistics };
};

const initialPlaylistState: PlaylistState = {
  schemaVersion: STATE_SCHEMA_MAJOR_VERSION,
  initialized: false,
  currentScheduleId: null,
  schedules: {},
  scheduleStatistics: {},
};

export const slice = createSlice({
  name: "playlist",
  initialState: initialPlaylistState,
  reducers: {
    stateLoadSuccess: (state, action: PayloadAction<PlaylistState>) => {
      // Do not use loaded state if schema version does not match
      if (state.schemaVersion !== action.payload.schemaVersion) {
        state.initialized = true;
        return;
      }

      return {
        ...initialPlaylistState,
        ...action.payload,
        initialized: true,
        schemaVersion: STATE_SCHEMA_MAJOR_VERSION,
      };
    },
    stateLoadFail: state => {
      state.initialized = true;
    },
    schedulePlaylistReset: state => {
      if (!state.currentScheduleId) return;
      state.schedules[state.currentScheduleId] = createInitialScheduleState();
      state.currentScheduleId = null;
    },
    scheduleIdChange: (state, action: PayloadAction<string | null>) => {
      const scheduleId = action.payload;
      state.currentScheduleId = scheduleId;
      const schedule = scheduleId ? state.schedules[scheduleId] : null;
      if (!schedule && scheduleId) {
        state.schedules[scheduleId] = createInitialScheduleState();
      }
      if (scheduleId && !state.scheduleStatistics[scheduleId]) {
        state.scheduleStatistics[scheduleId] = { ...initialScheduleStats };
      }
    },
    scheduleStatusChange: (state, action: PayloadAction<ScheduleStatus>) => {
      if (
        !state.currentScheduleId ||
        !state.schedules[state.currentScheduleId]
      ) {
        return;
      }

      const status = action.payload;
      state.schedules[state.currentScheduleId].status = status;

      if (
        status === "finish" &&
        state.scheduleStatistics[state.currentScheduleId]
      ) {
        state.scheduleStatistics[
          state.currentScheduleId
        ].isScheduleCompleted = true;
      }
    },
    itemIdChange: (state, action: PayloadAction<string | null>) => {
      if (
        !state.currentScheduleId ||
        !state.schedules[state.currentScheduleId]
      ) {
        return;
      }
      state.schedules[state.currentScheduleId].currentItemId = action.payload;
    },
    answerChange: (state, action: PayloadAction<PlaylistAnswer>) => {
      const scheduleId = state.currentScheduleId;
      const schedule = scheduleId ? state.schedules[scheduleId] : null;
      if (!schedule || !scheduleId) {
        return;
      }

      schedule.answers[action.payload.itemId] = { isDirty: true };
      state.schedules[scheduleId] = schedule;
    },
    recordingChange: (state, action: PayloadAction<PlaylistRecording>) => {
      const scheduleId = state.currentScheduleId;
      const schedule = scheduleId ? state.schedules[scheduleId] : null;
      if (!schedule || !scheduleId) {
        return;
      }

      const recording = action.payload;
      schedule.recordings[recording.itemId] = recording.completed;
      state.schedules[scheduleId] = schedule;
    },
    playlistStateReset: state => {
      return { ...initialPlaylistState, initialized: state.initialized };
    },
  },
  extraReducers: {
    [fileUploadStart.type]: (
      state,
      action: PayloadAction<{
        scheduleId: string;
        itemId: string;
        durationSeconds: number;
      }>
    ) => {
      const { scheduleId, itemId, durationSeconds } = action.payload;
      if (!state.scheduleStatistics[scheduleId]) {
        return;
      }

      const currentDuration =
        state.scheduleStatistics[scheduleId].recordingDurationSeconds[itemId] ||
        0;
      state.scheduleStatistics[scheduleId].recordingDurationSeconds[itemId] =
        currentDuration + durationSeconds;
    },
    [fileUploadFail.type]: (
      state,
      action: PayloadAction<{
        scheduleId: string;
        itemId: string;
        durationSeconds: number;
      }>
    ) => {
      const { scheduleId, itemId, durationSeconds } = action.payload;
      if (!state.scheduleStatistics[scheduleId]) {
        return;
      }

      const currentDuration =
        state.scheduleStatistics[scheduleId].recordingDurationSeconds[itemId] ||
        0;
      state.scheduleStatistics[scheduleId].recordingDurationSeconds[itemId] =
        currentDuration - durationSeconds;
    },
    [metadataUploadSuccess.type]: (
      state,
      action: PayloadAction<{
        scheduleId: string;
        itemId: string;
        presignedUrl?: string;
      }>
    ) => {
      const { scheduleId, itemId } = action.payload;
      const schedule = scheduleId ? state.schedules[scheduleId] : null;
      if (!schedule || !scheduleId) {
        return;
      }

      schedule.answers[itemId] = { isDirty: false };
      state.schedules[scheduleId] = schedule;
    },
  },
});

export const {
  schedulePlaylistReset,
  scheduleIdChange,
  scheduleStatusChange,
  itemIdChange,
  answerChange,
  recordingChange,
  playlistStateReset,
} = slice.actions;

export const loadInitialPlaylistState = (): AppThunk => async dispatch => {
  const initialState = await loadState();
  const playlist = initialState?.playlist;
  if (playlist) {
    dispatch(slice.actions.stateLoadSuccess(playlist));
  } else {
    dispatch(slice.actions.stateLoadFail());
  }
};

export const selectSchedules = createSelector(
  [(state: RootState) => state.playlist.schedules],
  schedules => schedules
);

export const selectCurrentScheduleState = createSelector(
  [selectSchedules, (state: RootState) => state.playlist.currentScheduleId],
  (schedules, scheduleId) => {
    if (!scheduleId) return null;
    return schedules[scheduleId] || null;
  }
);

export const selectSessionId = createSelector(
  [selectCurrentScheduleState],
  scheduleState => {
    return scheduleState?.sessionId || null;
  }
);

export const selectCurrentScheduleId = (state: RootState) =>
  state.playlist.currentScheduleId;

export const selectCurrentSchedule = createSelector(
  [
    (state: RootState) => state.playlist.currentScheduleId,
    selectLocalizedConfigurations,
  ],
  (scheduleId, configurations) => {
    if (!scheduleId || !configurations) return null;
    return configurations[scheduleId] || null;
  }
);

export const selectCurrentItemId = createSelector(
  [selectCurrentScheduleState],
  schedule => {
    return schedule?.currentItemId || null;
  }
);

export const selectCurrentItemAnswer = createSelector(
  [selectCurrentItemId, (state: RootState) => state.user.itemAnswers],
  (currentItemId, itemAnswers) => {
    if (!currentItemId) return null;
    return itemAnswers[currentItemId] || null;
  }
);

export const selectAnswers = createSelector(
  [selectCurrentScheduleState],
  schedule => {
    return schedule ? schedule.answers : {};
  }
);

export const selectIsScheduleItemAnswerDirty = createSelector(
  [selectAnswers, selectCurrentItemId],
  (answers, currentItemId) => {
    if (!currentItemId) return false;
    const answer = currentItemId ? answers[currentItemId] : null;
    return answer && answer.isDirty;
  }
);

const selectItems = createSelector(
  [
    (state: RootState) => state.playlist.currentScheduleId,
    selectLocalizedConfigurations,
  ],
  (scheduleId, configurations) => {
    if (!scheduleId || !configurations) return [];
    const schedule = configurations[scheduleId];
    return schedule?.items || [];
  }
);

export const selectCompletedItemIds = createSelector(
  [selectCurrentScheduleState],
  schedule => {
    if (!schedule) {
      return {};
    }

    const mergedItems = { ...schedule.answers, ...schedule.recordings };
    return Object.keys(mergedItems).reduce((acc, itemId) => {
      acc[itemId] = Boolean(mergedItems[itemId]);
      return acc;
    }, {} as { [key: string]: boolean });
  }
);

export const selectCurrentItemIndex = createSelector(
  [selectCurrentItemId, selectItems],
  (itemId, items) => {
    if (!itemId) return -1;
    return items.findIndex(item => item.itemId === itemId);
  }
);

export const selectCurrentItem = createSelector(
  [selectItems, selectCurrentItemIndex],
  (items, itemIndex) => {
    return items[itemIndex] || null;
  }
);

export const selectIsItemCompleted = createSelector(
  [selectCompletedItemIds, selectCurrentItem],
  (completedItemIds, item) => {
    const isCompleted = Boolean(
      item && item.itemId && completedItemIds[item.itemId]
    );
    return isCompleted || (item && !item.isRecording && item.kind !== "prompt");
  }
);

export const selectNextItemId = createSelector(
  [selectCurrentItemIndex, selectItems],
  (itemIndex, items) => {
    const nextItem = items[itemIndex + 1];
    return nextItem ? nextItem.itemId : null;
  }
);

export const selectPrevioiusItemId = createSelector(
  [selectCurrentItemIndex, selectItems],
  (itemIndex, items) => {
    const nextItem = items[itemIndex - 1];
    return nextItem ? nextItem.itemId : null;
  }
);

export const selectScheduleStatus = createSelector(
  [selectCurrentScheduleState],
  currentSchedule => {
    return currentSchedule?.status || "start";
  }
);

export const selectScheduleStatistics = createSelector(
  [(state: RootState) => state.playlist.scheduleStatistics],
  scheduleStatistics => scheduleStatistics
);

export const selectTotalRecordingDuration = createSelector(
  [selectScheduleStatistics],
  scheduleStatistics => {
    return Object.values(scheduleStatistics).reduce((acc, stats) => {
      const scheduleDuration = Object.values(
        stats.recordingDurationSeconds
      ).reduce((accDuration, duration) => accDuration + duration, 0);
      return acc + scheduleDuration;
    }, 0);
  }
);

export const selectScheduleTotalRecordingDuration = createSelector(
  [selectCurrentScheduleId, selectScheduleStatistics],
  (scheduleId, scheduleStatistics) => {
    const stats = scheduleId ? scheduleStatistics[scheduleId] : null;
    const durations = stats
      ? Object.values(stats.recordingDurationSeconds)
      : [];
    return durations.reduce((acc, duration) => acc + duration, 0);
  }
);

export const selectRecordingItemProgress = createSelector(
  [selectItems, selectCurrentItemId],
  (items, itemId) => {
    const recordingItems = items.filter(i => i.isRecording);
    const currentRecordingItemIndex = recordingItems.findIndex(
      i => i.itemId === itemId
    );
    if (currentRecordingItemIndex < 0) return null;

    return {
      itemNumber: currentRecordingItemIndex + 1,
      totalCount: recordingItems.length,
    };
  }
);

export default slice.reducer;
