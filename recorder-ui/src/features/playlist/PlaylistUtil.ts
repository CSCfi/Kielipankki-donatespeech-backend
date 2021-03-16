import {
  LocalizedScheduleItem,
  LocalizedScheduleItemState,
  LocalizedSchedule,
} from "../configuration/types";
import config from "../../config/config";
import {
  ItemStatus,
  DisplayedItemProps,
  ScheduleStatus,
  DisplayedElement,
} from "./types";

export const getMediaUrl = (item: LocalizedScheduleItem) => {
  const { itemType, url, kind } = item;
  switch (itemType) {
    case "audio":
    case "video":
    case "image":
    case "yle-audio":
    case "yle-video":
      return url;
    case "local-audio":
      return `${config.LOCAL_AUDIO_URL}/${url}`;
    case "local-video":
      return `${config.LOCAL_VIDEO_URL}/${url}`;
    case "local-image":
      return `${config.LOCAL_IMAGE_URL}/${url}`;
    case "text":
      return kind === "media" ? url : getImageUrl(url);
    default:
      return getImageUrl(url);
  }
};

const isString = (val: any) => typeof val === "string";

const getField = (
  item: LocalizedScheduleItem,
  itemState: ItemStatus,
  selector: (
    obj: LocalizedScheduleItem | LocalizedScheduleItemState
  ) => string | undefined | null,
  defaultText?: string | null
): string => {
  const state = item[itemState];
  const stateFieldValue = state ? selector(state) : null;
  if (isString(stateFieldValue)) return stateFieldValue || "";
  if (isString(defaultText)) return defaultText || "";

  const fieldValue = selector(item);
  return isString(fieldValue) ? fieldValue || "" : "";
};

const getMediaType = (
  itemType: LocalizedScheduleItem["itemType"],
  url: string | null | undefined
) => {
  switch (itemType) {
    case "yle-video":
    case "local-video":
    case "video":
      return "video";
    case "yle-audio":
    case "local-audio":
    case "audio":
      return "audio";
    case "image":
    case "local-image":
      return "image";
    case "text":
      return "text";
    default:
      return isString(url) ? "image" : null;
  }
};

const getImageUrl = (imageUrl: string | null | undefined) => {
  if (!isString(imageUrl)) {
    return null;
  }

  return imageUrl
    ? imageUrl.startsWith("http")
      ? imageUrl
      : `${config.LOCAL_IMAGE_URL}/${imageUrl}`
    : null;
};

const getMediaTypeAndUrl = (
  item: LocalizedScheduleItem,
  itemState: ItemStatus
) => {
  let mediaType: DisplayedElement["mediaType"] = getMediaType(
    item.itemType,
    item.url
  );
  let url = getMediaUrl(item);

  const state = item[itemState];
  const imageUrl = state?.imageUrl;
  if (isString(imageUrl)) {
    mediaType = "image";
    url = getImageUrl(imageUrl);
  }

  return {
    mediaType,
    url,
  };
};

export const getItemState = (props: {
  item: LocalizedScheduleItem | null;
  isRecording: boolean;
  isItemCompleted: boolean;
}) => {
  const { item, isItemCompleted, isRecording } = props;
  if (!item || !item.isRecording) {
    return "start";
  }

  return isRecording ? "recording" : isItemCompleted ? "finish" : "start";
};

export const getDisplayedElement = (
  props: DisplayedItemProps
): DisplayedElement => {
  const { item, itemState } = props;
  const defaultTitle =
    item.isRecording && itemState === "finish"
      ? "Hyvin kerrottu, paljon kiitoksia!"
      : null;

  const { mediaType, url } = getMediaTypeAndUrl(item, itemState);

  return {
    item,
    title: getField(item, itemState, i => i.title, defaultTitle),
    body1: getField(item, itemState, i => i.body1),
    body2: getField(item, itemState, i => i.body2),
    mediaType,
    url: url || null,
  };
};

const getMediaElement = (
  base: DisplayedElement,
  state?: LocalizedScheduleItemState | null
) => {
  const element = { ...base };
  if (!state) return element;

  if (isString(state.title)) element.title = state.title || "";
  if (isString(state.body1)) element.body1 = state.body1 || "";
  if (isString(state.body2)) element.body2 = state.body2  || "";
  if (isString(state.imageUrl)) {
    element.mediaType = "image";
    element.url = getImageUrl(state.imageUrl);
  }
  return element;
};

export const getDisplayedScheduleElement = (
  scheduleStatus: ScheduleStatus,
  schedule: LocalizedSchedule
): DisplayedElement | null => {
  const { title, body1, body2 } = schedule;
  switch (scheduleStatus) {
    case "start":
      return getMediaElement({ title, body1, body2 }, schedule.start);
    case "playlist":
      return null;
    case "finish":
      return getMediaElement({ title, body1, body2 }, schedule.finish);
  }
};

const pad = (num: number, size: number) => ("000" + num).slice(size * -1);

export const getFormattedDuration = (durationSeconds: number) => {
  const minutes = Math.floor(durationSeconds / 60);
  const seconds = Math.floor(durationSeconds - minutes * 60);
  return `${pad(minutes, 2)}:${pad(seconds, 2)}`;
};

export const getFromattedTotalDuration = (durationSeconds: number) => {
  const minutes = Math.floor(durationSeconds / 60);
  return `${minutes} min`;
};
