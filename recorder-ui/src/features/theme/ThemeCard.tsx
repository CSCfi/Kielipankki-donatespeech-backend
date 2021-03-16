import React from "react";
import { useSelector } from "react-redux";
import { LocalizedThemeContainer } from "./types";

import "./ThemeCard.css";
import { selectScheduleStatistics } from "../playlist/playlistSlice";

type ThemeCardProps = {
  theme: LocalizedThemeContainer;
  onScheduleSelect: (event: { themeId: string; scheduleId: string }) => void;
};

const ThemeCard: React.FC<ThemeCardProps> = ({ theme, onScheduleSelect }) => {
  const scheduleStatistics = useSelector(selectScheduleStatistics);
  const themeContent = theme.content;

  const firstScheduleId = theme.content.scheduleIds[0];
  const stats = scheduleStatistics[firstScheduleId];
  const completedClass = stats?.isScheduleCompleted
    ? "theme-card--completed"
    : "";

  const handleClick = () => {
    const event = {
      themeId: theme.id,
      scheduleId: firstScheduleId,
    };
    onScheduleSelect(event);
  };

  return (
    <button className={`theme-card ${completedClass}`} onClick={handleClick}>
        <div className="theme-card-image-col">
          <div className="theme-card-image">
            <img src={themeContent.image} alt={themeContent.title} />
          </div>
        </div>
        <div className="theme-card-label my-auto">
          <span>{themeContent.title}</span>
        </div>
    </button>
  );
};

export default ThemeCard;
