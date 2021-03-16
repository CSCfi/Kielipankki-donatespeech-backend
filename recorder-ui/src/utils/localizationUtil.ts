import {
  ScheduleItemState,
  LocalizedScheduleItemState,
} from "../features/configuration/types";

export type Language = "fi" | "sv" | "en";

export type LocalizibleText = {
  [key in Language]: string | undefined;
};

export const localize = (
  lang: Language,
  text: LocalizibleText | undefined
): string | null => {
  const local = text ? text[lang] : null;
  return typeof local === "string" ? local : null;
};

export const localizeItemState = (
  lang: Language,
  state: ScheduleItemState | undefined
) =>
  ({
    ...state,
    title: state ? localize(lang, state.title) : undefined,
    body1: state ? localize(lang, state.body1) : undefined,
    body2: state ? localize(lang, state.body2) : undefined,
  } as LocalizedScheduleItemState);
