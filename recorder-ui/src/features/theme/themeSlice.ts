import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { RootState, AppThunk } from "../../app/store";
import { getThemes } from "./ThemeService";
import { Themes, LocalizedThemeContainer, LocalizedThemes } from "./types";
import { Language, localize } from "../../utils/localizationUtil";

interface ThemeState {
  isLoading: boolean;
  themes: Themes | null;
  error: string | null;
}

const initialState: ThemeState = {
  isLoading: false,
  themes: null,
  error: null,
};

export const slice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    getThemesStarted: state => {
      state.isLoading = true;
    },
    getThemesSuccess: (state, action: PayloadAction<Themes>) => {
      state.isLoading = false;
      state.themes = action.payload;
      state.error = null;
    },
    getThemesFailed: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.themes = null;
      state.error = action.payload;
    },
  },
});

export const {
  getThemesStarted,
  getThemesSuccess,
  getThemesFailed,
} = slice.actions;

export const fetchThemes = (): AppThunk => async (dispatch, getState) => {
  const themes = getState().theme.themes;
  if (themes) return;

  try {
    dispatch(getThemesStarted());
    const themeContainers = await getThemes();
    const themes = themeContainers.reduce((acc, container) => {
      acc[container.id] = container;
      return acc;
    }, {} as Themes);
    dispatch(getThemesSuccess(themes));
  } catch (err) {
    dispatch(getThemesFailed(err.message));
  }
};

export const selectLocalizedThemes = createSelector(
  [(state: RootState) => state.theme.themes],
  themes => {
    const language: Language = "fi";
    if (!themes) return null;

    const localizedThemeContainers = Object.keys(themes).map(themeId => {
      const theme = themes[themeId].content;
      return {
        id: themeId,
        content: {
          ...theme,
          title: localize(language, theme.title),
          description: localize(language, theme.description),
        },
      } as LocalizedThemeContainer;
    });
    return localizedThemeContainers.reduce((acc, themeContainer) => {
      acc[themeContainer.id] = themeContainer;
      return acc;
    }, {} as LocalizedThemes);
  }
);

export const selectIsLoadingThemes = createSelector(
  [(state: RootState) => state.theme.isLoading],
  isLoading => isLoading
);

export default slice.reducer;
