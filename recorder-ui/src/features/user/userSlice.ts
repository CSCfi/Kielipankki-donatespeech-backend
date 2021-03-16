import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { RootState, AppThunk } from "../../app/store";
import { loadState } from "../../utils/localStorageUtil";
import { PlaylistAnswer } from "../playlist/types";
import { answerChange } from "../playlist/playlistSlice";

// NOTE: Update schema version when playlist state schema is changed
// so that it is no longer compatible with earlier schema (breaking changes).
// User state is loaded initialy from browser's local storage,
// and unsupported obsolete schema might cause errors and crashes.

// Also, note that when the schme version number is changed,
// user's client ID will be reset along with other user state stored in local storage.
// So try to avoid introducing breaking changes!
// Instead, prefer adding new fields to the root of the state.
const STATE_SCHEMA_MAJOR_VERSION = 4;

// NOTE: Update STATE_SCHEMA_MAJOR_VERSION if braking changes are introduced,
// see info for STATE_SCHENA_MAJOR_VERSION above.
export interface UserState {
  schemaVersion: number;
  initialized: boolean;
  clientId: string;
  isAnalyticsEnabled: boolean | null;
  isTermsAndConditionAccepted: boolean;
  itemAnswers: { [key: string]: PlaylistAnswer };
}

export const createInitialState = (): UserState => ({
  schemaVersion: STATE_SCHEMA_MAJOR_VERSION,
  initialized: false,
  clientId: uuidv4(),
  isAnalyticsEnabled: null,
  isTermsAndConditionAccepted: false,
  itemAnswers: {},
});

export const slice = createSlice({
  name: "user",
  initialState: createInitialState(),
  reducers: {
    stateLoadSuccess: (state, action: PayloadAction<UserState>) => {
      // Do not use loaded state if schema version does not match
      if (state.schemaVersion !== action.payload.schemaVersion) {
        state.initialized = true;
        return;
      }

      return {
        ...createInitialState(),
        ...action.payload,
        initialized: true,
        schemaVersion: STATE_SCHEMA_MAJOR_VERSION,
      };
    },
    stateLoadFail: state => {
      state.initialized = true;
    },
    analyticsEnabledChange: (state, action: PayloadAction<boolean>) => {
      state.isAnalyticsEnabled = action.payload;
    },
    termsAndConditionAccepted: state => {
      state.isTermsAndConditionAccepted = true;
    },
    userStateReset: state => {
      return { ...createInitialState(), initialized: state.initialized };
    },
  },
  extraReducers: {
    [answerChange.type]: (state, action: PayloadAction<PlaylistAnswer>) => {
      state.itemAnswers[action.payload.itemId] = action.payload;
    },
  },
});

export const {
  stateLoadSuccess,
  stateLoadFail,
  analyticsEnabledChange,
  userStateReset,
  termsAndConditionAccepted,
} = slice.actions;

// Thunks
export const loadInitialUserState = (): AppThunk => async dispatch => {
  const initialState = await loadState();
  const user = initialState?.user;
  if (user) {
    dispatch(slice.actions.stateLoadSuccess(user));
  } else {
    dispatch(slice.actions.stateLoadFail());
  }
};

// Selectors
export const selectClientId = createSelector(
  [(state: RootState) => state.user.clientId],
  clientId => clientId
);

export const selectIsAnalyticsEnabled = createSelector(
  [(state: RootState) => state.user.isAnalyticsEnabled],
  isAnalyticsEnabled => Boolean(isAnalyticsEnabled)
);

export const selectIsAnalyticsConsentPending = createSelector(
  [(state: RootState) => state.user.isAnalyticsEnabled],
  isAnalyticsEnabled => isAnalyticsEnabled === null
);

export const selectIsTermsAndConditionAccepted = createSelector(
  [(state: RootState) => state.user.isTermsAndConditionAccepted],
  isTermsAndConditionAccepted => isTermsAndConditionAccepted
);

export default slice.reducer;
