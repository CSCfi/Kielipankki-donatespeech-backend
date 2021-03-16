import React from "react";
import { render as rtlRender } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import themeReducer from "../features/theme/themeSlice";
import configurationReducer from "../features/configuration/configurationSlice";
import uploadReducer from "../features/upload/uploadSlice";
import userReducer, {
  createInitialState as createUserState,
} from "../features/user/userSlice";
import playlistReducer from "../features/playlist/playlistSlice";
import { AudioRecorderProvider } from "./AudioRecorderContext";
import { useAudioRecorderMock } from "./__mocks__/AudioRecorder";
import useRecordingManager from "./useRecordingManager";
import { BrowserRouter } from "react-router-dom";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    configuration: configurationReducer,
    upload: uploadReducer,
    playlist: playlistReducer,
    user: userReducer,
  },
  preloadedState: {
    user: {
      ...createUserState(),
      isTermsAndConditionAccepted: true,
      isAnalyticsEnabled: false,
    },
  },
}) as any;

type WrapperProps = {};

const RecorderManagerWrapper: React.FC<WrapperProps> = ({ children }) => {
  const recorder = useAudioRecorderMock();
  useRecordingManager(recorder);
  return (
    <AudioRecorderProvider value={recorder}>{children}</AudioRecorderProvider>
  );
};

const Wrapper: React.FC<WrapperProps> = ({ children }) => {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <RecorderManagerWrapper>{children}</RecorderManagerWrapper>
      </Provider>
    </BrowserRouter>
  );
};

const render = (ui: React.ReactElement) => {
  return rtlRender(ui, { wrapper: Wrapper });
};

// re-export everything
export * from "@testing-library/react";

// override render method
export { render };

export type RootStateMock = ReturnType<typeof store.getState>;
export type AppThunkMock = ThunkAction<
  void,
  RootStateMock,
  unknown,
  Action<string>
>;
