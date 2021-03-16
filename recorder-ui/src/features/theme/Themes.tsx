import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import ThemeCard from "./ThemeCard";
import {
  fetchThemes,
  selectLocalizedThemes,
  selectIsLoadingThemes,
} from "./themeSlice";
import routes from "../../config/routes";
import { onThemeSelected } from "../../utils/firebase";

import "./Themes.css";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";

const Themes: React.FC = () => {
  const themes = useSelector(selectLocalizedThemes);
  const isLoading = useSelector(selectIsLoadingThemes);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(fetchThemes());
  }, [dispatch]);

  const handleScheduleSelect = (event: {
    themeId: string;
    scheduleId: string;
  }) => {
    const theme = themes ? themes[event.themeId] : null;
    if (theme) {
      onThemeSelected(theme);
    }

    history.push(`${routes.SCHEDULE}/${event.scheduleId}`);
  };

  const themeKeys = themes ? Object.keys(themes) : [];

  return (
    <div className="themes">
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="d-flex flex-wrap justify-content-between">
          {themes
            ? themeKeys.map(key => (
                <ThemeCard
                  key={key}
                  theme={themes[key]}
                  onScheduleSelect={handleScheduleSelect}
                />
              ))
            : null}
        </div>
      )}
    </div>
  );
};

export default Themes;
