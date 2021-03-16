import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { RootState, AppThunk } from "../../app/store";
import {
  Configurations,
  LocalizedScheduleItem,
  LocalizedSchedule,
  LocalizedConfigurations,
  Schedule,
} from "./types";
import { getConfigurations, getConfiguration } from "./ConfigurationService";
import {
  localize,
  localizeItemState,
  Language,
} from "../../utils/localizationUtil";

interface ConfigurationState {
  isLoading: boolean;
  configurations: Configurations;
  error: string | null;
}

const initialState: ConfigurationState = {
  isLoading: false,
  configurations: {},
  error: null,
};

export const slice = createSlice({
  name: "configuration",
  initialState,
  reducers: {
    getAllConfigurationsStarted: state => {
      state.isLoading = true;
    },
    getAllConfigurationsSuccess: (
      state,
      action: PayloadAction<Configurations>
    ) => {
      state.isLoading = false;
      state.configurations = action.payload;
      state.error = null;
    },
    getAllConfigurationsFailed: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.configurations = {};
      state.error = action.payload;
    },
    getConfigurationStarted: state => {
      state.isLoading = true;
    },
    getConfigurationSuccess: (state, action: PayloadAction<Schedule>) => {
      state.isLoading = false;
      state.configurations[action.payload.scheduleId] = action.payload;
      state.error = null;
    },
    getConfigurationFailed: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  getAllConfigurationsStarted,
  getAllConfigurationsSuccess,
  getAllConfigurationsFailed,
  getConfigurationStarted,
  getConfigurationSuccess,
  getConfigurationFailed,
} = slice.actions;

export const fetchAllConfigurations = (): AppThunk => async dispatch => {
  try {
    dispatch(getAllConfigurationsStarted());
    const confs = await getConfigurations();
    const configurations = confs.reduce((acc, conf) => {
      acc[conf.content.scheduleId] = conf.content;
      return acc;
    }, {} as Configurations);
    dispatch(getAllConfigurationsSuccess(configurations));
  } catch (err) {
    dispatch(getAllConfigurationsFailed(err.message));
  }
};

export const fetchConfiguration = (scheduleId: string): AppThunk => async (
  dispatch,
  getState
) => {
  const configurations = getState().configuration.configurations;
  if (configurations[scheduleId]) return;

  try {
    dispatch(getConfigurationStarted());
    const schedule = await getConfiguration(scheduleId);
    dispatch(getConfigurationSuccess(schedule));
  } catch (err) {
    dispatch(getConfigurationFailed(err.message));
  }
};

//  Selectors

export const selectConfigurations = createSelector(
  [(state: RootState) => state.configuration.configurations],
  configurations => configurations
);

export const selectLocalizedConfigurations = createSelector(
  [selectConfigurations],
  configurations => {
    const language: Language = "fi";
    if (!configurations) return null;

    const localizedSchedules = Object.keys(configurations).map(confKey => {
      const schedule = configurations[confKey];
      const localizedItems = schedule.items.map(
        item =>
          ({
            ...item,
            title: localize(language, item.title),
            body1: localize(language, item.body1),
            body2: localize(language, item.body2),
            start: localizeItemState(language, item.start),
            recording: localizeItemState(language, item.recording),
            finish: localizeItemState(language, item.finish),
            options: item.options.map(o => localize(language, o)),
            otherAnswer: localize(language, item.otherAnswer),
            otherEntryLabel: localize(language, item.otherEntryLabel),
            metaTitle: localize(language, item.metaTitle),
          } as LocalizedScheduleItem)
      );
      return {
        ...schedule,
        title: localize(language, schedule.title),
        body1: localize(language, schedule.body1),
        body2: localize(language, schedule.body2),
        start: localizeItemState(language, schedule.start),
        finish: localizeItemState(language, schedule.finish),
        items: localizedItems,
      } as LocalizedSchedule;
    });
    return localizedSchedules.reduce((acc, schedule) => {
      acc[schedule.scheduleId] = schedule;
      return acc;
    }, {} as LocalizedConfigurations);
  }
);

export const selectIsLoadingConfiguration = createSelector(
  [(state: RootState) => state.configuration.isLoading],
  isLoading => isLoading
);

export const selectConfigurationError = createSelector(
  [(state: RootState) => state.configuration.error],
  error => error
);

export default slice.reducer;
