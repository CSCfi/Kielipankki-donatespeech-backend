import { LocalizedScheduleItem } from "../configuration/types";

export type ScheduleStatus = "start" | "playlist" | "finish";

export type ItemStatus = "start" | "recording" | "finish";

export type DisplayedItemProps = {
  item: LocalizedScheduleItem;
  itemState: ItemStatus;
};

export type DisplayedElement = {
  item?: LocalizedScheduleItem | null;
  title: string;
  body1: string;
  body2: string;
  mediaType?: "audio" | "video" | "image" | "text" | null;
  url?: string | null;
  metaTitle?: string | "";
};

// NOTE: Update PlaylistSlice STATE_SCHEMA_MAJOR_VERSION if braking changes are introduced
export type PlaylistAnswer = {
  itemId: string;
  value: string | string[];
  extraValue?: string;
  otherValueInConfiguration?: string;
};

// NOTE: Update PlaylistSlice STATE_SCHEMA_MAJOR_VERSION if braking changes are introduced
export type PlaylistRecording = PlaylistItem & {
  completed: boolean;
};

// NOTE: Update PlaylistSlice STATE_SCHEMA_MAJOR_VERSION if braking changes are introduced
export type PlaylistItem = {
  itemId: string;
};

// NOTE: Update PlaylistSlice STATE_SCHEMA_MAJOR_VERSION if braking changes are introduced
export type PlaylistStart = {
  scheduleId: string;
  itemId: string;
};
