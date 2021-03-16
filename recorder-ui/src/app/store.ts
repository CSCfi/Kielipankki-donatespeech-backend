import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { throttle } from "throttle-debounce";
import themeReducer from "../features/theme/themeSlice";
import configurationReducer from "../features/configuration/configurationSlice";
import uploadReducer from "../features/upload/uploadSlice";
import playlistReducer from "../features/playlist/playlistSlice";
import userReducer from "../features/user/userSlice";
import { saveState } from "../utils/localStorageUtil";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    configuration: configurationReducer,
    upload: uploadReducer,
    playlist: playlistReducer,
    user: userReducer,
  },
});

store.subscribe(
  throttle(1000, () => {
    const user = store.getState().user;
    const playlist = {
      ...store.getState().playlist,
      transient: { itemAnswers: {} },
    };
    if (!playlist.initialized || !user.initialized) return;

    saveState({ user, playlist });
  })
);

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;
