import React from "react";
import "./ArrowButton.css";
import ArrowBackward from "./webNavigateTriangle.svg";
import ArrowForward from "./webNavigateTriangleForward.svg";

interface ArrowButtonProps {
  direction: "forward" | "backward";
  onClick: () => void;
}

const ArrowButton: React.FC<ArrowButtonProps> = ({ direction, onClick }) => {
  const icon = direction === "forward" ? ArrowForward : ArrowBackward;
  const ariaLabel = direction === "forward" ? "Seuraava" : "Edellinen";
  return (
    <button onClick={onClick} className="arrow-button" aria-label={ariaLabel}>
      <img src={icon} alt="Edellinen" />
    </button>
  );
};

export default ArrowButton;
