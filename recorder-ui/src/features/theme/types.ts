import { LocalizibleText } from "../../utils/localizationUtil";

export type ThemeBase = {
  image: string;
  scheduleIds: string[];
};

export type Theme = ThemeBase & {
  title: LocalizibleText;
  description: LocalizibleText;
};

export type LocalizedTheme = ThemeBase & {
  title: string;
  description: string;
};

export type ThemeContainer = {
  id: string;
  content: Theme;
};

export type LocalizedThemeContainer = {
  id: string;
  content: LocalizedTheme;
};

export type Themes = { [key: string]: ThemeContainer };

export type LocalizedThemes = { [key: string]: LocalizedThemeContainer };
