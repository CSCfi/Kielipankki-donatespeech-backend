import React from "react";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Themes from "../theme/Themes";
import NavigationBar from "../navigation/NavigationBar/NavigationBar";
import routes from "../../config/routes";
import AppIcons from "../components/AppIcons/AppIcons";

import hyLogo from "./hyWhite.png";
import "./LandingPage.css";

type LandingPageProps = {};

const LandingPage: React.FC<LandingPageProps> = () => {
  return (
    <Container fluid>
      <Row className="landing-page">
        <Col>
          <Row className="landing-page-part landing-page-part-1 ">
            <Col className="landing-page-part-content">
              <Row>
                <Col>
                  <NavigationBar />
                </Col>
              </Row>
              <Row>
                <Col className="landing-page-part-1-content">
                  <Row>
                    <h2 className="landing-page-title">
                      Pulistaan meille parempia palveluja
                    </h2>
                    <p className="landing-page-description">
                      Nyt kerätään kaikenlaista puhuttua suomea! Lahjoittamasi
                      puheen avulla esimerkiksi ääniohjatut laitteet
                      voivat oppia ymmärtämään erilaisia murteita ja puhetapoja.
                      Valitse alta aihe, josta haluat puhua.
                    </p>
                  </Row>
                  <Row className="landing-page-themes">
                    <Col className="px-0">
                      <Themes />
                    </Col>
                  </Row>
                  <Row className=" landing-page-app-icons">
                    <Col>
                      <p>
                        Lahjoittaminen onnistuu parhaiten mobiilisovelluksella:
                      </p>
                      <AppIcons />
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className="landing-page-part landing-page-part-2 ">
            <Col xs={12} className="landing-page-part-content">
              <Row className="justify-content-end">
                <Col sm={12} md={8}>
                  <h2>
                    Puheentunnistus toimimaan myös suomeksi — kauniit murteemme
                    huomioiden
                  </h2>
                  <p>
                    Hankkeen nimi -hanke kerää suomenkielisiä puhenäytteitä.
                  </p>
                  <p>
                    Lahjoitukset auttavat kehittämään esimerkiksi
                    puheentunnistusta, joka ymmärtää kaikenlaista suomea –
                    murteineen, taukoineen ja takelteluineen.
                  </p>
                  <p>
                    Näin pystymme käyttämään tulevaisuuden puheohjattuja
                    laitteita ja palveluja entistä sujuvammin myös suomen
                    kielellä. Sujuva puheohjaus on erityisen tärkeää
                    hoitotyössä, kuten vanhustenhuollossa.
                  </p>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className="landing-page-part landing-page-part-3 ">
            <Col className="landing-page-part-content" xs={12}>
              <h2>Lahjoittamasi puhe käsitellään luottamuksella</h2>
              <p>
                Lahjoittamaasi puhetta käytetään tekoälyn tutkimukseen ja
                kehitykseen sekä kielentutkimukseen. Lahjoituksesi päätyy
                Helsingin yliopiston hallintaan ja voidaan Kielipankin kautta
                välittää edelleen suomalaisille ja kansainvälisille yrityksille
                sekä tutkijoille. Lahjoittajia ei pyritä tunnistamaan, mutta
                vältä kuitenkin nimien ja arkaluontoisten asioiden
                mainitsemista.
              </p>
              <Link to={routes.PRIVACY}>Lue lisää tietosuojasta</Link>
            </Col>
          </Row>
          <Row className="landing-page-part landing-page-part-4">
            <Col className="landing-page-part-content " xs={12}>
              <p>
                Tämän yleishyödyllisen hankkeen takana on muun muassa
                {"  "}
                <b>Helsingin yliopisto</b>
                {". "}
              </p>
              <div className="d-flex flex-wrap justify-content-center">
                <img src={hyLogo} alt="Helsingin yliopisto" />
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default LandingPage;
