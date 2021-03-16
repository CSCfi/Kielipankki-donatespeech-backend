import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import NavItem from "react-bootstrap/NavItem";
import Nav from "react-bootstrap/Nav";
import NavigationItem from "../NavigationItem/NavigationItem";
import TotalRecordingDuration from "../../playlist/components/TotalRecordingDuration/TotalRecordingDuration";
import routes from "../../../config/routes";

import "./NavigationBar.css";

type NavigationBarProps = {};

const NavigationBar: React.FC<NavigationBarProps> = () => {
  const { pathname } = useLocation();
  if (pathname && pathname.startsWith(routes.SCHEDULE)) {
    // Do not show navbar for playlist
    return null;
  }

  return (
    <Navbar expand="lg">
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav>
          <NavItem>
            <NavigationItem
              isFirst={true}
              text="Hankkeen nimi"
              to={routes.HOME}
            />
          </NavItem>
          <NavItem>
            <NavigationItem text="Yhteistyökumppanit" to={routes.PARTNERS} />
          </NavItem>
          <NavItem>
            <NavigationItem text="Tietosuoja" to={routes.PRIVACY} />
          </NavItem>
          <NavItem>
            <NavigationItem text="Tietoa hankkeesta" to={routes.INFO} />
          </NavItem>
          <Nav.Link
            target="_blank"
            rel="noopener noreferrer"
            href="https://example.com/hankkeen-nimi"
          >
            Kampanjasivulle
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
      <div className="float-right mt-3">
        <TotalRecordingDuration label="Olet lahjoittanut:" />
      </div>
    </Navbar>
  );
};

export default NavigationBar;
