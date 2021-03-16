import React from "react";
import "./Frame.css";

type FrameProps = {
  className?: string;
};

const Frame: React.FC<FrameProps> = ({ className, children }) => {
  return <div className={`frame ${className || ""}`}>{children}</div>;
};

export default Frame;
