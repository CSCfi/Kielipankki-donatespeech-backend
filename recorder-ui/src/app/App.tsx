import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ErrorBoundary from "react-error-boundary";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { useAudioRecorder } from "../utils/AudioRecorder";
import { AudioRecorderProvider } from "../utils/AudioRecorderContext";
import useRecordingManager from "../utils/useRecordingManager";
import { loadInitialPlaylistState } from "../features/playlist/playlistSlice";
import {
  enableAnalyticsByUser,
  disableAnalyticsByUser,
} from "../utils/firebase";
import NavigationBar from "../features/navigation/NavigationBar/NavigationBar";
import LandingPage from "../features/landingPage/LandingPage";
import config from "../config/config";
import routes from "../config/routes";
import PrivacyPage from "../features/privacy/PrivacyPage";
import PartnersPage from "../features/partners/PartnersPage";
import Frame from "../features/components/Frame";
import {
  loadInitialUserState,
  selectIsAnalyticsEnabled,
  selectIsAnalyticsConsentPending,
} from "../features/user/userSlice";
import ScheduleView from "../features/schedule/ScheduleView";
import InfoPage from "../features/infoPage/InfoPage";
import CookieBanner from "../features/cookieBanner/CookieBanner";

import "./App.css";

function App() {
  const dispatch = useDispatch();
  const isAnalyticsEnabled = useSelector(selectIsAnalyticsEnabled);
  const isAnalyticsConsentPending = useSelector(
    selectIsAnalyticsConsentPending
  );

  const recorder = useAudioRecorder();
  const forceStopRecorder = useRecordingManager(recorder);

  useEffect(() => {
    dispatch(loadInitialPlaylistState());
    dispatch(loadInitialUserState());
  }, [dispatch]);

  useEffect(() => {
    if (isAnalyticsEnabled) {
      enableAnalyticsByUser();
    } else {
      disableAnalyticsByUser();
    }
  }, [isAnalyticsEnabled]);

  const renderWipNote = () => {
    return config.SHOW_WIP_NOTE ? (
      <div className="wip-note py-2">Nettisivut työn alla</div>
    ) : null;
  };

  return (
    <ErrorBoundary
      onError={(error: Error, componentStack: string) =>
        console.error(error, componentStack)
      }
      FallbackComponent={() => (
        <Route render={() => <Redirect to={{ pathname: "/" }} />} />
      )}
    >
      <Router>
        <AudioRecorderProvider value={recorder}>
          <div className="App">
            <Switch>
              <Route path={routes.HOME} exact>
                {renderWipNote()}
                <LandingPage />
              </Route>
              <Route path={routes.PARTNERS}>
                <Frame>
                  {renderWipNote()}
                  <NavigationBar />
                  <PartnersPage />
                </Frame>
              </Route>
              <Route path={routes.PRIVACY}>
                <Frame>
                  {renderWipNote()}
                  <NavigationBar />
                  <PrivacyPage />
                </Frame>
              </Route>
              <Route path={routes.INFO}>
                <Frame>
                  {renderWipNote()}
                  <NavigationBar />
                  <InfoPage />
                </Frame>
              </Route>
              <Route path={`${routes.SCHEDULE}/:scheduleId`}>
                <ScheduleView onRecorderResetRequested={forceStopRecorder} />
              </Route>
              <Route render={() => <Redirect to={{ pathname: "/" }} />} />
            </Switch>
            {isAnalyticsConsentPending && <CookieBanner />}
          </div>
        </AudioRecorderProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
