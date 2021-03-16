import React from "react";
import "./ItemDescription.css";

type ItemDescriptionProps = {
  description: string;
  isSmall?: boolean;
};

const ItemDescription: React.FC<ItemDescriptionProps> = ({
  description,
  isSmall,
}) => {
  const smallClass = isSmall ? "item-description--small" : "";
  return (
    <>
      {description && (
        <p className={`item-description ${smallClass}`}>{description}</p>
      )}
    </>
  );
};

export default ItemDescription;
