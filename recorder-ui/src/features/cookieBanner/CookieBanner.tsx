import React from "react";
import "./CookieBanner.css";
import { useDispatch } from "react-redux";
import { analyticsEnabledChange } from "../user/userSlice";
import PlaylistButton from "../playlist/components/PlaylistButton/PlaylistButton";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link } from "react-router-dom";
import routes from "../../config/routes";

type CookieBannerProps = {};

const CookieBanner: React.FC<CookieBannerProps> = () => {
  const dispatch = useDispatch();

  const handleDeny = () => {
    dispatch(analyticsEnabledChange(false));
  };

  const handleAllow = () => {
    dispatch(analyticsEnabledChange(true));
  };

  return (
    <Container fluid className="cookie-banner fixed-bottom">
      <Row>
        <Col md={12} lg={6} className="pb-2">
          Hankkeen nimi -sivusto käyttää evästeitä palvelun kehittämiseen
          tarvittavan analytiikan takia. Lue lisää{" "}
          <Link to={routes.PRIVACY}>tietosuojasta</Link>.
        </Col>
        <Col className="d-flex flex-wrap align-items-center">
          <PlaylistButton
            buttonType="outline"
            className="mr-3 mb-2"
            text="Estä evästeet"
            onClick={handleDeny}
          />
          <PlaylistButton
            className="mb-2"
            text="Hyväksy evästeet"
            onClick={handleAllow}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default CookieBanner;
