import React from "react";
import "./ItemTitle.css";

type ItemTitleProps = {
  title: string;
};

const ItemTitle: React.FC<ItemTitleProps> = ({ title }) => {
  return <h2 className="item-title">{title}</h2>;
};

export default ItemTitle;
