import React from "react";
import hyLogo from "./hyBlack.png";
import "./PartnersPage.css";

type PartnersPageProps = {};

const PartnersPage: React.FC<PartnersPageProps> = () => {
  return (
    <div className="partners-page frame--view">
      <h2>Yhteistyökumppanit</h2>
      <p className="mb-4">
        Hankkeen nimi -kampanja toteutetaan Helsingin yliopiston
        ja yhteistyökumppanien yhteistyönä.
      </p>
      <div className="partner-page--icons partner-page--icons-1 d-flex flex-wrap">
        <div className="d-flex flex-wrap justify-content-center">
          <img src={hyLogo} alt="Helsingin yliopisto" />
        </div>
      </div>
    </div>
  );
};

export default PartnersPage;
