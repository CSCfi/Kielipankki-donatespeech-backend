import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import PlaylistButton from "../../playlist/components/PlaylistButton/PlaylistButton";
import { termsAndConditionAccepted } from "../../user/userSlice";

import "./TermsAndConditionsView.css";
import routes from "../../../config/routes";

const CAMPAIGN_URL = "https://example.com";
const KIELIPANKKI_URL = "https://www.kielipankki.fi";
const EMAIL_ADDRESS = "your-feedback-email-here";

const largerBodyTextStyle = {
  fontSize: 'larger'
};

type TermsAndConditionsViewProps = {};

const TermsAndConditionsView: React.FC<TermsAndConditionsViewProps> = () => {
  const dispatch = useDispatch();
  return (
    <div className="terms-and-conditions-view">
      <h4>Kiitos, kun tulit!</h4>
      <p>
        <strong style={largerBodyTextStyle}>
          Tällä sivulla on perustiedot hankkeesta. Kun olet lukenut ne, 
          pääset sivun alalaidasta aloittamaan lahjoittamisen.
        </strong>
      </p>
      <h4>Mikä?</h4>
      <p>
      Vestibulum lorem turpis, lacinia sed blandit nec, viverra et ligula. In 
      vestibulum dui eu pretium vestibulum. 
      </p>
      <p>
      Aliquam dictum egestas vehicula. Suspendisse potenti. Fusce ut tristique 
      mi. Donec dictum leo at metus lobortis imperdiet. Donec pellentesque 
      laoreet ultrices. Mauris tincidunt nunc pretium nunc placerat congue.
      </p>
      <p>
        Lisätietoja kampanjasta löytyy
        {"  "}
        <Link to={routes.INFO}>täältä</Link>
        {". "}
      </p>
      <h4>Kuka?</h4>
      <p>
      Pellentesque efficitur efficitur blandit. Sed iaculis enim neque, 
      cursus mollis sapien venenatis sit amet. In aliquet ligula ac nisi 
      porttitor ornare. Nullam sit amet odio nec ex semper tempus quis eu 
      erat. Donec nec elit nec neque feugiat convallis. Maecenas rhoncus 
      urna nec libero fringilla, nec auctor nisi consectetur.         
      </p>
      <h4>Miten henkilötietoja käsitellään?</h4>
      <p>
        Lahjoitettu puhe ja muut siihen liittyvät tiedot sisältävät puhujan
        henkilötietoja. Niiden käsittelyssä noudatetaan Suomessa voimassa olevaa
        tietosuojalainsäädäntöä. Lisätietoja henkilötietojen käsittelystä löytyy
        {"  "}
        <Link to={routes.PRIVACY}>täältä</Link>
        {". "}
      </p>
      <h4>Oikeudet puheeseen</h4>
      <p>
        Sinulla voi olla tekijänoikeuslain mukaisia tai muita oikeuksia
        lahjoittamaasi puheeseen.
      </p>
      <p>
        Annat Helsingin yliopistolle nämä
        oikeutesi, siinä määrin kuin se on puhetta ymmärtävän tai tuottavan
        tekoälyn kehittämisen ja tutkimuksen, kielentutkimuksen tai näihin
        tarkoituksiin liittyvän korkeakouluopetuksen kannalta tarpeellista ja
        lain mukaan mahdollista. Helsingin yliopisto saa luovuttaa ne edelleen.
      </p>
      <p>
        Ethän käytä puheessasi muiden kirjoittamaa tekstiä, kuten
        runoja, näytelmien vuorosanoja tai tekstin katkelmia etkä kerro itseäsi
        tai muita ihmisiä koskevia yksityisiä, arkaluonteisia tai
        luottamuksellisia asioita.
      </p>
      <h4>Lisätietoja</h4>
      <p>
        Kampanjan sivusto:
        {"  "}
        <a href={CAMPAIGN_URL}>(hankkeen nimi)</a>
        <br />
        Helsingin yliopisto, Kielipankki,
        {"  "}
        <a target="_blank" rel="noopener noreferrer" href={KIELIPANKKI_URL}>
          {KIELIPANKKI_URL}
        </a>
        {", "}
        <a href={`mailto: ${EMAIL_ADDRESS}`}>{EMAIL_ADDRESS}</a>
      </p>
      <div className="terms-and-conditions-footer">
        <p>
          Painamalla alla olevaa Hyväksyn-nappia hyväksyn edellä olevat puheen
          lahjoittamisen ehdot. Jos olen alle 18-vuotias, huoltajani hyväksyy
          ehdot puolestani.
        </p>
        <PlaylistButton
          text="Hyväksyn"
          onClick={() => dispatch(termsAndConditionAccepted())}
        />
      </div>
    </div>
  );
};

export default TermsAndConditionsView;
