import { LocalizibleText } from "../../utils/localizationUtil";

export type ScheduleItemState = {
  title: LocalizibleText;
  body1: LocalizibleText;
  body2: LocalizibleText;
  imageUrl: string;
};

export type ScheduleItemBase = {
  itemId: string;
  kind: "media" | "prompt";
  itemType:
    | "local-audio"
    | "local-video"
    | "local-image"
    | "audio"
    | "video"
    | "image"
    | "yle-video"
    | "yle-audio"
    | "choice"
    | "multi-choice"
    | "text";
  typeId: string;
  url: string;
  isRecording: boolean;
  startTime?: number;
  endTime?: number;
};

export type ScheduleItem = ScheduleItemBase & {
  title: LocalizibleText;
  body1: LocalizibleText;
  body2: LocalizibleText;
  start?: ScheduleItemState;
  recording?: ScheduleItemState;
  finish?: ScheduleItemState;
  options: LocalizibleText[];
  otherAnswer?: LocalizibleText;
  otherEntryLabel?: LocalizibleText;
  metaTitle?: LocalizibleText;
};

export type Schedule = {
  scheduleId: string;
  title: LocalizibleText;
  body1: LocalizibleText;
  body2: LocalizibleText;
  items: ScheduleItem[];
  start?: ScheduleItemState;
  finish?: ScheduleItemState;
};
export type ScheduleContainer = {
  id: string;
  content: Schedule;
};

export type Configurations = { [key: string]: Schedule };

// =============================
// Localized types

export type LocalizedScheduleItemState = {
  title?: string;
  body1?: string;
  body2?: string;
  imageUrl?: string;
};

export type LocalizedScheduleItem = ScheduleItemBase & {
  title: string;
  body1: string;
  body2: string;
  start?: LocalizedScheduleItemState;
  recording?: LocalizedScheduleItemState;
  finish?: LocalizedScheduleItemState;
  options: string[];
  otherAnswer?: string;
  otherEntryLabel?: string;
  metaTitle?: string;
};

export type LocalizedSchedule = {
  scheduleId: string;
  body1: string;
  body2: string;
  title: string;
  items: LocalizedScheduleItem[];
  start?: LocalizedScheduleItemState;
  finish?: LocalizedScheduleItemState;
};

export type LocalizedScheduleContainer = {
  id: string;
  content: LocalizedSchedule;
};

export type LocalizedConfigurations = { [key: string]: LocalizedSchedule };
