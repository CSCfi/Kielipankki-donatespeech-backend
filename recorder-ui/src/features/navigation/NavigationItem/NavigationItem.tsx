import React from "react";
import { Link, useLocation } from "react-router-dom";

import "./NavigationItem.css";
import Nav from "react-bootstrap/Nav";

type NavigationItemProps = {
  text: string;
  to: string;
  isFirst?: boolean;
};

const NavigationItem: React.FC<NavigationItemProps> = ({
  text,
  to,
  isFirst,
}) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  const firstClass = isFirst ? "navigation-item--first" : "";
  const activeClass = isActive ? "navigation-item--active" : "";
  return (
    <div className={`navigation-item ${firstClass} ${activeClass}`}>
      <Nav.Link as={Link} to={to}>
        {text}
      </Nav.Link>
    </div>
  );
};

export default NavigationItem;
