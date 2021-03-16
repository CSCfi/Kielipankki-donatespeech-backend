import * as firebase from "firebase/app";

import "firebase/analytics";
import { Metadata } from "../features/upload/types";
import { LocalizedThemeContainer } from "../features/theme/types";
import {
  LocalizedSchedule,
  LocalizedScheduleItem,
} from "../features/configuration/types";
import config from "../config/config";
import { PlaylistAnswer } from "../features/playlist/types";

type SelectContentEvent = {
  content_type: "theme" | "schedule" | "scheduleitem";
  item_id: string;
  item_name: string;
};

const USE_PROD = (process.env.REACT_APP_STAGE === 'prod');
const MEASUREMENT_ID = USE_PROD ? "<redacted>" : "<redacted>";
const ITEM_FINALIZED_EVENT = "recording_completed";
const SELECT_CONTENT_EVENT = "select_content";
const SCHEDULE_COMPLETED_EVENT = "schedule_completed";
const SCHEDULE_ITEM_COMPLETED_EVENT = "schedule_item_completed";

const firebaseConfigProd = {
  apiKey: "<your-firebase-api-key>",
  authDomain: "<your-firebase-domain>",
  databaseURL: "<your-firebase-database>",
  projectId: "<your-firebase-project-id>",
  storageBucket: "<your-firebase-storage>",
  messagingSenderId: "<your-firebase-messaging-sender-id>",
  appId: "<your-firebase-app-id>",
};

const firebaseConfigDev = {
  apiKey: "<your-firebase-api-key>",
  authDomain: "<your-firebase-domain>",
  databaseURL: "<your-firebase-database>",
  projectId: "<your-firebase-project-id>",
  storageBucket: "<your-firebase-storage>",
  messagingSenderId: "<your-firebase-messaging-sender-id>",
  appId: "<your-firebase-app-id>",
};

const firebaseConfig = {
  measurementId: `G-${MEASUREMENT_ID}`,
  ...(USE_PROD ? firebaseConfigProd : firebaseConfigDev)
};

let app: firebase.app.App | undefined;
let isEnabledByUser: boolean | null = null;

const sendEvent = (eventName: string, event: object) => {
  if (!app || !config.ANALYTICS_ENABLED || !isEnabledByUser) return;
  app.analytics().logEvent(eventName, event);
};

const deleteCookie = (name: string) => {
  document.cookie =
    name +
    "=; Path=/; Domain=.example.com; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
};

const deleteCookies = () => {
  deleteCookie("_ga");
  deleteCookie(`_ga_${MEASUREMENT_ID}`);
};

export const enableAnalyticsByUser = () => {
  if (!app) {
    app = firebase.initializeApp(firebaseConfig);
  }
  isEnabledByUser = true;
};

export const disableAnalyticsByUser = () => {
  // Delete cookies if disabling for the first time
  // NOTE: excplicit false check as state is null by default
  if (isEnabledByUser !== false) {
    deleteCookies();
  }

  isEnabledByUser = false;
};

export const analytics = () => app?.analytics();

export const onItemFinalized = (metadata: Metadata) => {
  const event = {
    recording_id: metadata.recordingId,
    client_id: metadata.clientId,
    item_id: metadata.itemId,
    recording_timestamp: metadata.recordingTimestamp,
    client_platform_name: metadata.clientPlatformName,
    recording_duration: metadata.recordingDuration,
    recording_specification: `${metadata.recordingSampleRate ||
      ""}/${metadata.recordingBitDepth ||
      ""}/${metadata.recordingNumberOfChannels || ""}`,
  };

  sendEvent(ITEM_FINALIZED_EVENT, event);
};

export const onThemeSelected = (theme: LocalizedThemeContainer) => {
  const event: SelectContentEvent = {
    item_id: theme.id,
    item_name: theme.content.title,
    content_type: "theme",
  };
  sendEvent(SELECT_CONTENT_EVENT, event);
};

export const onScheduleSelected = (schedule: {
  scheduleId: string;
  title: string;
}) => {
  const event: SelectContentEvent = {
    item_id: schedule.scheduleId,
    item_name: schedule.title,
    content_type: "schedule",
  };
  sendEvent(SELECT_CONTENT_EVENT, event);
};

export const onScheduleCompleted = (schedule: LocalizedSchedule) => {
  const event: SelectContentEvent = {
    item_id: schedule.scheduleId,
    item_name: schedule.title,
    content_type: "schedule",
  };
  sendEvent(SCHEDULE_COMPLETED_EVENT, event);
};

export const onScheduleItemSelected = (item: {
  itemId: string;
  title: string;
}) => {
  const event: SelectContentEvent = {
    item_id: item.itemId,
    item_name: item.title,
    content_type: "scheduleitem",
  };
  sendEvent(SELECT_CONTENT_EVENT, event);
};

export const onScheduleItemCompleted = (item: LocalizedScheduleItem, answer: PlaylistAnswer | null) => {
  const event: SelectContentEvent = {
    item_id: item.itemId,
    item_name: item.title,
    content_type: "scheduleitem",
  };
  const answers = (answer?.value instanceof Array) ? JSON.stringify(answer.value) : answer?.value
  sendEvent(SCHEDULE_ITEM_COMPLETED_EVENT, {
    answers,
    ...event
  });
};
