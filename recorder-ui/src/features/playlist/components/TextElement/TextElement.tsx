import React from "react";
import "./TextElement.css";

type TextElementProps = {
  text: string;
};

const TextElement: React.FC<TextElementProps> = ({ text }) => {
  if (!text) return null;

  return (
    <div className="text-element d-flex align-items-center">
      <span>{text}</span>
    </div>
  );
};

export default TextElement;
