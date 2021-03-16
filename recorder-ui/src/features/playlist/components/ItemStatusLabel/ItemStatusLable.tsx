import React from "react";
import "./ItemStatusLabel.css";
import { DisplayedElement } from "../../types";

type ItemStatusLabelProps = {
  recordingItemProgress?: {
    itemNumber: number;
    totalCount: number;
  } | null;
  displayedElement: DisplayedElement;
};

const NON_BRAKING_SPACE = "\u00A0";

const ItemStatusLabel: React.FC<ItemStatusLabelProps> = ({
  recordingItemProgress,
  displayedElement,
}) => {
  const getText = () => {
    const { item } = displayedElement;
    if (!item) return null;

    const isPrompt = item.kind === "prompt";
    if (isPrompt) {
      if (item.metaTitle !== null) {
        return item.metaTitle;
      }
      else {
        return "Auta tutkijaa";
      }
    }

    if (item.isRecording && recordingItemProgress)
      return `Lahjoita ${recordingItemProgress.itemNumber}/${recordingItemProgress.totalCount}`;

    const isMedia = item.itemType !== "text";
    if (item.metaTitle !== null) {
      return item.metaTitle;
    }
    if (isMedia) {
      return "Katso tai kuuntele";
    }

    return null;
  };
  const text = getText() || NON_BRAKING_SPACE;
  return <h6 className="item-status-label">{text}</h6>;
};

export default ItemStatusLabel;
