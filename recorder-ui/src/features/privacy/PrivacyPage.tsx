import React from "react";
import "./PrivacyPage.css";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { selectClientId, userStateReset } from "../user/userSlice";
import PlaylistButton from "../playlist/components/PlaylistButton/PlaylistButton";
import { playlistStateReset } from "../playlist/playlistSlice";

import balanceTest from "./tasapainotesti.pdf";
import routes from "../../config/routes";

type PrivacyPageProps = {};

const EMAIL_ADDRESS = "<your-feedback-email-here>";

const PrivacyPage: React.FC<PrivacyPageProps> = () => {
  const clientId = useSelector(selectClientId);
  const dispatch = useDispatch();

  const clearUserData = () => {
    dispatch(userStateReset());
    dispatch(playlistStateReset());
  };

  return (
    <div className="privacy-page frame--view">
      <h2>Tietosuoja</h2>
      <p className="mb-4">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent 
      ultricies erat at dolor scelerisque euismod vel vitae eros. Maecenas 
      a convallis eros, vel aliquet ipsum. Ut ac ipsum velit. Sed viverra 
      faucibus justo ut rutrum. Phasellus pellentesque volutpat tincidunt. 
      Donec hendrerit mauris ut sapien feugiat scelerisque. Suspendisse 
      varius quam non vulputate ullamcorper. Pellentesque auctor justo 
      nec dui placerat pretium. In ut felis gravida, commodo urna vitae, 
      volutpat quam. Aenean et arcu turpis. Sed leo lorem, mattis eget 
      neque et, blandit semper dui. Vestibulum id accumsan turpis, et 
      blandit metus.      
      </p>
      <p className="mb-4">
      Morbi vehicula magna sapien, id ornare risus condimentum sed. Nullam 
      mollis finibus mi, et accumsan sapien tincidunt vitae. Ut finibus 
      urna quis tristique viverra. Quisque fermentum mauris at nisi tincidunt, 
      non lacinia arcu congue. Ut faucibus quis tortor vitae rutrum. Praesent 
      faucibus massa ante, quis consequat ante sodales sit amet. Sed molestie 
      quam at laoreet interdum.
      </p>
      <p className="mb-4">
      Vestibulum rhoncus tincidunt dui et faucibus. Praesent mattis rhoncus 
      congue. Suspendisse sit amet mi turpis. Etiam nec dapibus metus. Proin 
      faucibus ac lorem in facilisis. Proin non fringilla nulla. Quisque quis 
      sollicitudin ex. Mauris non felis et lorem euismod auctor. Ut ac turpis 
      a felis posuere venenatis. Nunc consequat dui malesuada est vulputate, 
      fringilla mattis nunc maximus.         
      </p>

      <h4>Lahjoittamasi puheen poistaminen</h4>
      <p className="mb-4">
        Lahjoituksesi voit poistaa tietokannasta ottamalla yhteytt?? osoitteeseen
        {"  "}
        <a href={`mailto: ${EMAIL_ADDRESS}`}>{EMAIL_ADDRESS}</a>
        {"  "}
        ja kertomalla heille tunnisteesi sek?? ilmaisemalla tahtosi poistaa
        lahjoituksesi tietokannasta.
      </p>
      <p>Ota talteen selainkohtainen tunnisteesi:</p>
      <p className="mb-4">
        <strong>{clientId}</strong>
      </p>

      <h4>Lahjoittamiseen liittyvien tietojen poistaminen selaimesta</h4>
      <p className="mb-4">
        Mik??li olet esimerkiksi yhteisk??ytt??isell?? koneella vaikkapa kirjastossa
        tai muuten haluat, ettei t??m?? k??ytt??m??si selain muista lahjoittamasi
        puheen m????r???? eik?? tekemi??si valintoja, voit poistaa tiedot selaimesta
        painamalla ???Tyhjenn?? tiedot??? -painiketta. Samalla vaihtuu
        selainkohtainen tunnisteesi, joten otathan nykyisen tunnisteesi talteen
        ennen tietojen tyhjent??mist??!
      </p>
      <PlaylistButton
        className="mb-4"
        buttonType="outline"
        text="Tyhjenn?? tiedot"
        onClick={clearUserData}
      />

      <h3 className="mt-5">Tietoa henkil??tietojen k??sittelyst??</h3>
      <p className="mb-4">
      Duis pharetra, magna et porttitor lobortis, mi libero hendrerit orci, 
      ac condimentum ante purus et est. Suspendisse non accumsan dolor. 
      Phasellus auctor dapibus quam, vehicula ultrices urna tristique quis. 
      Vivamus diam nisi, posuere vel ex at, luctus malesuada sapien. Praesent 
      quis lorem quis nibh facilisis sollicitudin. Nam sit amet accumsan purus.
      </p>
      <p className="mb-4">
      Nullam pharetra tincidunt ante, id feugiat dolor tincidunt nec. Donec 
      libero quam, porttitor vitae tellus eu, egestas luctus nunc. Duis posuere 
      felis non semper aliquet. Nam in consectetur nisl, id fringilla nisi. 
      Nulla orci ex, ultrices porttitor lacus ut, commodo dapibus diam. Nam 
      volutpat imperdiet mauris. Sed elementum arcu nec pellentesque laoreet.
      </p>

      <h4>Rekisterinpit??j??t</h4>
      <p className="mb-4">
      Nam egestas erat lorem, egestas dignissim velit tincidunt eget.
      </p>

      <h5>Rekisterinpit??jien yhteystiedot</h5>
      <p className="mb-4">
        Mik??li sinulla on kysytt??v???? henkil??tietojen k??sittelyst?? 
        tai haluat k??ytt???? rekister??idyn oikeuksia, ota
        yhteytt?? osoitteeseen
        {"  "}
        <a href="mailto:<your-feedback-email-here>">
          your-feedback-email-here
        </a>
        .
      </p>

      <p>Rekisterinpit??jien tietosuojayhteyshenkil??iden tiedot:</p>

      <ul className="mb-4">
        <li>
          Helsingin yliopisto (tietosuojavastaava):
          {"  "}
          <a href="mailto:tietosuoja@helsinki.fi">tietosuoja@helsinki.fi</a>
        </li>
      </ul>

      <h5>Rekisterinpit??jien vastuut henkil??tietojen k??sittelyss??</h5>

      <p className="mb-4">
      Mauris aliquet, magna et imperdiet finibus, nisi urna auctor ligula, 
      non euismod sapien quam in quam. Sed dictum, magna id viverra ultricies, 
      lorem leo tincidunt eros, eget convallis quam est at nisl. Aenean ac 
      rhoncus massa. Ut massa nunc, dignissim in luctus eget, aliquet vitae 
      eros. Sed consectetur, erat ac laoreet aliquam, erat ligula lobortis 
      libero, et tincidunt felis ante sit amet felis.        
      </p>

      <p className="mb-4">
      Vestibulum rhoncus tincidunt dui et faucibus. Praesent mattis rhoncus 
      congue. Suspendisse sit amet mi turpis. Etiam nec dapibus metus. Proin 
      faucibus ac lorem in facilisis. Proin non fringilla nulla. Quisque quis 
      sollicitudin ex. Mauris non felis et lorem euismod auctor. Ut ac turpis 
      a felis posuere venenatis. Nunc consequat dui malesuada est vulputate, 
      fringilla mattis nunc maximus. 
      </p>

      <h6>Kielipankkiin tallennettu aineisto</h6>

      <p className="mb-4">
        Kampanjan tuottama puheaineisto tallennetaan Helsingin yliopiston
        Kielipankkiin, josta aineistoa voidaan luovuttaa edelleen yrityksille ja
        muille organisaatioille teko??lyn tutkimusta ja kehityst??, kielen
        tutkimusta tai n??ihin liittyv???? korkeakouluopetusta varten. Aineiston
        s??ilytyksest?? ja k??sittelyst?? Kielipankissa vastaa rekisterinpit??j??n??
        Helsingin yliopisto. Jatkossa Helsingin yliopisto voi my??s siirt????
        puheaineiston kokonaisuudessaan jollekin toiselle organisaatiolle, josta
        tulee omalta osaltaan rekisterinpit??j?? ja joka voi my??s maksua vastaan
        myyd?? aineiston k??ytt??oikeuksia puhetta ymm??rt??vien ja tuottavien
        sovellusten ja palveluiden kehitykseen.
      </p>

      <h6>Aineiston k??ytt?? teko??lykehityksess?? ja kielen tutkimuksessa</h6>

      <p className="mb-4">
        Hankkeen nimi -kampanjassa ker??tty?? puheaineistoa voivat k??ytt????
        teko??lyn kehitykseen ja tutkimukseen sek?? kielentutkimukseen kaupalliset
        yritykset ja teko??lykehitt??j??t sek?? tieteellist?? tutkimusta tekev??t
        tutkijat, korkeakoulut ja tutkimuslaitokset. Lis??ksi korkeakoulut voivat
        k??ytt???? puheaineistoja n??ihin tarkoituksiin liittyv????n opetukseen. N??m??
        yritykset tai muut organisaatiot ovat rekisterinpit??jin?? vastuussa
        omasta teko??lykehityksest????n, tutkimuksestaan tai opetuksestaan. Tietoa
        siit??, mille vastaanottajille puheaineistoa on luovutettu ja miten ne
        k??sittelev??t aineistoa, tulee olemaan saatavilla osoitteesta
        {"  "}
        <a
          href="https://www.kielipankki.fi/hankkeen-nimi/"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://www.kielipankki.fi/hankkeen-nimi/
        </a>
        .
      </p>

      <h4>Miksi henkil??tietoja k??sitell????n?</h4>
      <p className="mb-4">
      Duis pharetra, magna et porttitor lobortis, mi libero hendrerit orci, ac 
      condimentum ante purus et est. Suspendisse non accumsan dolor. Phasellus 
      auctor dapibus quam, vehicula ultrices urna tristique quis. Vivamus diam 
      nisi, posuere vel ex at, luctus malesuada sapien. Praesent quis lorem 
      quis nibh facilisis sollicitudin. Nam sit amet accumsan purus.        
      </p>

      <h4>Mit?? henkil??tietoja k??sitell????n?</h4>
      <p className="mb-4">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ultricies 
      erat at dolor scelerisque euismod vel vitae eros. Maecenas a convallis eros, 
      vel aliquet ipsum. Ut ac ipsum velit. Sed viverra faucibus justo ut rutrum. 
      Phasellus pellentesque volutpat tincidunt. Donec hendrerit mauris ut sapien 
      feugiat scelerisque.      
      </p>

      <h4>Mik?? on k??sittelyn oikeusperuste?</h4>
      <p className="mb-4">
      Suspendisse varius quam non vulputate ullamcorper. Pellentesque auctor 
      justo nec dui placerat pretium. In ut felis gravida, commodo urna vitae, 
      volutpat quam. Aenean et arcu turpis. Sed leo lorem, mattis eget neque et, 
      blandit semper dui. Vestibulum id accumsan turpis, et blandit metus.
      </p>

      <p>Olemme huolellisesti arvioineet tasapainotestill??, ett??
        voimme k??ytt???? oikeutettua etua perusteena henkil??tietojen k??sittelylle.
        Tietoa tasapainotestist?? ja sen huomioista l??ytyy
        {"  "}
        <a href={balanceTest} target="_blank" rel="noopener noreferrer">
          t????lt??
        </a>
        {". "}
      </p>

      <h4>
        Keit?? ovat henkil??tietojen vastaanottajat tai vastaanottajaryhm??t?
      </h4>
      <p className="mb-4">
      Fusce vitae ante eget erat mattis sodales. Pellentesque auctor gravida tellus, 
      eget convallis orci venenatis vitae. Fusce elementum sit amet turpis non aliquam. 
      </p>

      <h4>Aiotaanko tietoja siirt???? EU:n ulkopuolelle?</h4>
      <p className="mb-4">
      Duis ut aliquet purus. Aenean interdum condimentum molestie. Aenean porta 
      sed odio at laoreet. In sit amet dui eu libero dignissim fermentum. In posuere 
      nisl arcu, quis mollis sapien fermentum sit amet. Cras ut consequat turpis. 
      Duis gravida aliquam maximus. 
      </p>

      <h4>
        Kuinka kauan tietoja s??ilytet????n tai mill?? kriteerill?? s??ilytysaika
        m????rittyy?
      </h4>
      <p className="mb-4">
      Phasellus orci ipsum, congue at nisi vel, interdum fringilla nisi. Duis 
      venenatis tellus mi, eu aliquam dolor rhoncus a. Morbi vel massa ex. Morbi 
      eu iaculis justo. Vestibulum facilisis imperdiet leo quis pulvinar.</p>

      <h4>Omat oikeutesi</h4>
      <p className="mb-4">
        Jotta pystyt k??ytt??m????n seuraavassa kuvattuja oikeuksiasi, sinun on
        pystytt??v?? kertomaan tunnisteesi
        pyynn??n yhteydess?? tai muuten kyett??v??
        riitt??v??sti yksil??im????n, mist?? tiedoista on kysymys. Tallennathan
        tunnisteen huolellisesti.
      </p>

      <h5>Oikeus saada tietoa ja p????sy tietoihin</h5>
      <p className="mb-4">
        Sinulla on oikeus saada tiet????, k??sittelemmek?? henkil??tietojasi. Jos
        k??sittelemme henkil??tietojasi, sinulla on oikeus saada tiet????, mit??
        tietojasi k??sittelemme.
      </p>

      <h5>Oikeus vaatia tietojen korjaamista ja poistamista</h5>
      <p className="mb-4">
        Sinulla on oikeus vaatia virheellisen tiedon korjaamista ottamalla
        meihin yhteytt??.
      </p>

      <p className="mb-4">
        Voit pyyt???? meit?? poistamaan henkil??tietosi j??rjestelmist??mme.
        Suoritamme pyynt??si mukaiset toimenpiteet, mik??li meill?? ei ole
        oikeutettua syyt?? olla poistamatta tietoa. Tiedot eiv??t v??ltt??m??tt??
        poistu v??litt??m??sti kaikista varmuuskopio- tai muista vastaavista
        j??rjestelmist??mme.
      </p>

      <h5>Suoramarkkinointi ja automaattinen p????t??ksenteko</h5>
      <p className="mb-4">
      Nam in leo odio. Maecenas eros metus, semper ut mi molestie, lobortis 
      suscipit est. Vivamus tortor dolor, condimentum non velit vitae, suscipit 
      egestas purus. Aenean non semper dolor.
      </p>

      <h5>Oikeus rajoittaa tiedon k??sittely??</h5>
      <p className="mb-4">
        Voit pyyt???? meit?? rajoittamaan tiettyjen henkil??tietojesi k??sittelyj??.
        Tietojen k??sittelyn rajoittamista koskeva pyynt?? saattaa johtaa
        rajoitetumpiin mahdollisuuksiin hy??dynt???? lahjoittamaasi puhetta
        teko??lyn kehitt??misess??.
      </p>

      <h5>Oikeus vastustaa tiedon k??sittely??</h5>
      <p className="mb-4">
        Voit henkil??kohtaiseen erityiseen tilanteeseesi liittyv??ll?? perusteella
        vastustaa henkil??tietojesi k??sittely?? eli pyyt????, ett?? niit?? ei
        k??sitelt??isi ollenkaan. T??ll??in lopetamme tietojesi k??sittelyn ellemme
        voi osoittaa, ett?? k??sittelyyn on olemassa huomattavan t??rke?? ja
        perusteltu syy, joka syrj??ytt???? sinun etusi, oikeutesi ja vapautesi, tai
        k??sittely on tarpeen oikeusvaateen laatimiseksi, esitt??miseksi tai
        puolustamiseksi.
      </p>

      <h5>Oikeus tehd?? valitus valvontaviranomaiselle</h5>
      <p className="mb-4">
        Sinulla on oikeus tehd?? valitus tietosuojavaltuutetulle, jos katsot,
        ett?? henkil??tietojesi k??sittelyss?? rikotaan lakia. Lis??tietoja
        valitusoikeudesta
        {": "}
        <a
          href="https://tietosuoja.fi/onko-tietosuojaoikeuksiasi-loukattu"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://tietosuoja.fi/onko-tietosuojaoikeuksiasi-loukattu
        </a>
      </p>
    </div>
  );
};

export default PrivacyPage;
