import React from "react";
import "./LoadingSpinner.css";

type LoadingSpinnerProps = {};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = () => {
  return (
    <div className="d-flex justify-content-center">
      <div className="spinner-border" role="status">
        <span className="sr-only">Ladataan...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
