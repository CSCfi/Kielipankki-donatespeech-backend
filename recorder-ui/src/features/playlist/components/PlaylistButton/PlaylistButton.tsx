import React from "react";
import "./PlaylistButton.css";
import Button, { ButtonProps } from "react-bootstrap/Button";

interface PlaylistButtonProps extends ButtonProps {
  className?: string;
  text: string;
  buttonType?: "normal" | "outline" | "text";
  onClick: () => void;
}

const PlaylistButton: React.FC<PlaylistButtonProps> = ({
  className,
  text,
  buttonType,
  onClick,
  ...restProps
}) => {
  const outlineClass =
    buttonType === "outline"
      ? "playlist-button--outline"
      : buttonType === "text"
      ? "playlist-button--text"
      : "";

  const isText = buttonType === "text";
  return (
    <div className={`playlist-button ${outlineClass} ${className || ""}`}>
      {isText ? (
        <span onClick={onClick}>{text}</span>
      ) : (
        <Button onClick={onClick} {...restProps}>
          <span>{text}</span>
        </Button>
      )}
    </div>
  );
};

export default PlaylistButton;
