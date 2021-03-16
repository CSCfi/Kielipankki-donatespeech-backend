import { httpGet } from "../../utils/httpUtil";
import { ThemeContainer, Theme } from "./types";

export const getThemes = async () => {
  return httpGet<ThemeContainer[]>("v1/theme");
};

export const getTheme = async (id: string) => {
  return httpGet<Theme>(`v1/theme/${id}`);
};
