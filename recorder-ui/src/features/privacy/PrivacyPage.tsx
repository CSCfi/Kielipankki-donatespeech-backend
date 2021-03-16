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
        Lahjoituksesi voit poistaa tietokannasta ottamalla yhteyttä osoitteeseen
        {"  "}
        <a href={`mailto: ${EMAIL_ADDRESS}`}>{EMAIL_ADDRESS}</a>
        {"  "}
        ja kertomalla heille tunnisteesi sekä ilmaisemalla tahtosi poistaa
        lahjoituksesi tietokannasta.
      </p>
      <p>Ota talteen selainkohtainen tunnisteesi:</p>
      <p className="mb-4">
        <strong>{clientId}</strong>
      </p>

      <h4>Lahjoittamiseen liittyvien tietojen poistaminen selaimesta</h4>
      <p className="mb-4">
        Mikäli olet esimerkiksi yhteiskäyttöisellä koneella vaikkapa kirjastossa
        tai muuten haluat, ettei tämä käyttämäsi selain muista lahjoittamasi
        puheen määrää eikä tekemiäsi valintoja, voit poistaa tiedot selaimesta
        painamalla “Tyhjennä tiedot” -painiketta. Samalla vaihtuu
        selainkohtainen tunnisteesi, joten otathan nykyisen tunnisteesi talteen
        ennen tietojen tyhjentämistä!
      </p>
      <PlaylistButton
        className="mb-4"
        buttonType="outline"
        text="Tyhjennä tiedot"
        onClick={clearUserData}
      />

      <h3 className="mt-5">Tietoa henkilötietojen käsittelystä</h3>
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

      <h4>Rekisterinpitäjät</h4>
      <p className="mb-4">
      Nam egestas erat lorem, egestas dignissim velit tincidunt eget.
      </p>

      <h5>Rekisterinpitäjien yhteystiedot</h5>
      <p className="mb-4">
        Mikäli sinulla on kysyttävää henkilötietojen käsittelystä 
        tai haluat käyttää rekisteröidyn oikeuksia, ota
        yhteyttä osoitteeseen
        {"  "}
        <a href="mailto:<your-feedback-email-here>">
          your-feedback-email-here
        </a>
        .
      </p>

      <p>Rekisterinpitäjien tietosuojayhteyshenkilöiden tiedot:</p>

      <ul className="mb-4">
        <li>
          Helsingin yliopisto (tietosuojavastaava):
          {"  "}
          <a href="mailto:tietosuoja@helsinki.fi">tietosuoja@helsinki.fi</a>
        </li>
      </ul>

      <h5>Rekisterinpitäjien vastuut henkilötietojen käsittelyssä</h5>

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
        muille organisaatioille tekoälyn tutkimusta ja kehitystä, kielen
        tutkimusta tai näihin liittyvää korkeakouluopetusta varten. Aineiston
        säilytyksestä ja käsittelystä Kielipankissa vastaa rekisterinpitäjänä
        Helsingin yliopisto. Jatkossa Helsingin yliopisto voi myös siirtää
        puheaineiston kokonaisuudessaan jollekin toiselle organisaatiolle, josta
        tulee omalta osaltaan rekisterinpitäjä ja joka voi myös maksua vastaan
        myydä aineiston käyttöoikeuksia puhetta ymmärtävien ja tuottavien
        sovellusten ja palveluiden kehitykseen.
      </p>

      <h6>Aineiston käyttö tekoälykehityksessä ja kielen tutkimuksessa</h6>

      <p className="mb-4">
        Hankkeen nimi -kampanjassa kerättyä puheaineistoa voivat käyttää
        tekoälyn kehitykseen ja tutkimukseen sekä kielentutkimukseen kaupalliset
        yritykset ja tekoälykehittäjät sekä tieteellistä tutkimusta tekevät
        tutkijat, korkeakoulut ja tutkimuslaitokset. Lisäksi korkeakoulut voivat
        käyttää puheaineistoja näihin tarkoituksiin liittyvään opetukseen. Nämä
        yritykset tai muut organisaatiot ovat rekisterinpitäjinä vastuussa
        omasta tekoälykehityksestään, tutkimuksestaan tai opetuksestaan. Tietoa
        siitä, mille vastaanottajille puheaineistoa on luovutettu ja miten ne
        käsittelevät aineistoa, tulee olemaan saatavilla osoitteesta
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

      <h4>Miksi henkilötietoja käsitellään?</h4>
      <p className="mb-4">
      Duis pharetra, magna et porttitor lobortis, mi libero hendrerit orci, ac 
      condimentum ante purus et est. Suspendisse non accumsan dolor. Phasellus 
      auctor dapibus quam, vehicula ultrices urna tristique quis. Vivamus diam 
      nisi, posuere vel ex at, luctus malesuada sapien. Praesent quis lorem 
      quis nibh facilisis sollicitudin. Nam sit amet accumsan purus.        
      </p>

      <h4>Mitä henkilötietoja käsitellään?</h4>
      <p className="mb-4">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ultricies 
      erat at dolor scelerisque euismod vel vitae eros. Maecenas a convallis eros, 
      vel aliquet ipsum. Ut ac ipsum velit. Sed viverra faucibus justo ut rutrum. 
      Phasellus pellentesque volutpat tincidunt. Donec hendrerit mauris ut sapien 
      feugiat scelerisque.      
      </p>

      <h4>Mikä on käsittelyn oikeusperuste?</h4>
      <p className="mb-4">
      Suspendisse varius quam non vulputate ullamcorper. Pellentesque auctor 
      justo nec dui placerat pretium. In ut felis gravida, commodo urna vitae, 
      volutpat quam. Aenean et arcu turpis. Sed leo lorem, mattis eget neque et, 
      blandit semper dui. Vestibulum id accumsan turpis, et blandit metus.
      </p>

      <p>Olemme huolellisesti arvioineet tasapainotestillä, että
        voimme käyttää oikeutettua etua perusteena henkilötietojen käsittelylle.
        Tietoa tasapainotestistä ja sen huomioista löytyy
        {"  "}
        <a href={balanceTest} target="_blank" rel="noopener noreferrer">
          täältä
        </a>
        {". "}
      </p>

      <h4>
        Keitä ovat henkilötietojen vastaanottajat tai vastaanottajaryhmät?
      </h4>
      <p className="mb-4">
      Fusce vitae ante eget erat mattis sodales. Pellentesque auctor gravida tellus, 
      eget convallis orci venenatis vitae. Fusce elementum sit amet turpis non aliquam. 
      </p>

      <h4>Aiotaanko tietoja siirtää EU:n ulkopuolelle?</h4>
      <p className="mb-4">
      Duis ut aliquet purus. Aenean interdum condimentum molestie. Aenean porta 
      sed odio at laoreet. In sit amet dui eu libero dignissim fermentum. In posuere 
      nisl arcu, quis mollis sapien fermentum sit amet. Cras ut consequat turpis. 
      Duis gravida aliquam maximus. 
      </p>

      <h4>
        Kuinka kauan tietoja säilytetään tai millä kriteerillä säilytysaika
        määrittyy?
      </h4>
      <p className="mb-4">
      Phasellus orci ipsum, congue at nisi vel, interdum fringilla nisi. Duis 
      venenatis tellus mi, eu aliquam dolor rhoncus a. Morbi vel massa ex. Morbi 
      eu iaculis justo. Vestibulum facilisis imperdiet leo quis pulvinar.</p>

      <h4>Omat oikeutesi</h4>
      <p className="mb-4">
        Jotta pystyt käyttämään seuraavassa kuvattuja oikeuksiasi, sinun on
        pystyttävä kertomaan tunnisteesi
        pyynnön yhteydessä tai muuten kyettävä
        riittävästi yksilöimään, mistä tiedoista on kysymys. Tallennathan
        tunnisteen huolellisesti.
      </p>

      <h5>Oikeus saada tietoa ja pääsy tietoihin</h5>
      <p className="mb-4">
        Sinulla on oikeus saada tietää, käsittelemmekö henkilötietojasi. Jos
        käsittelemme henkilötietojasi, sinulla on oikeus saada tietää, mitä
        tietojasi käsittelemme.
      </p>

      <h5>Oikeus vaatia tietojen korjaamista ja poistamista</h5>
      <p className="mb-4">
        Sinulla on oikeus vaatia virheellisen tiedon korjaamista ottamalla
        meihin yhteyttä.
      </p>

      <p className="mb-4">
        Voit pyytää meitä poistamaan henkilötietosi järjestelmistämme.
        Suoritamme pyyntösi mukaiset toimenpiteet, mikäli meillä ei ole
        oikeutettua syytä olla poistamatta tietoa. Tiedot eivät välttämättä
        poistu välittömästi kaikista varmuuskopio- tai muista vastaavista
        järjestelmistämme.
      </p>

      <h5>Suoramarkkinointi ja automaattinen päätöksenteko</h5>
      <p className="mb-4">
      Nam in leo odio. Maecenas eros metus, semper ut mi molestie, lobortis 
      suscipit est. Vivamus tortor dolor, condimentum non velit vitae, suscipit 
      egestas purus. Aenean non semper dolor.
      </p>

      <h5>Oikeus rajoittaa tiedon käsittelyä</h5>
      <p className="mb-4">
        Voit pyytää meitä rajoittamaan tiettyjen henkilötietojesi käsittelyjä.
        Tietojen käsittelyn rajoittamista koskeva pyyntö saattaa johtaa
        rajoitetumpiin mahdollisuuksiin hyödyntää lahjoittamaasi puhetta
        tekoälyn kehittämisessä.
      </p>

      <h5>Oikeus vastustaa tiedon käsittelyä</h5>
      <p className="mb-4">
        Voit henkilökohtaiseen erityiseen tilanteeseesi liittyvällä perusteella
        vastustaa henkilötietojesi käsittelyä eli pyytää, että niitä ei
        käsiteltäisi ollenkaan. Tällöin lopetamme tietojesi käsittelyn ellemme
        voi osoittaa, että käsittelyyn on olemassa huomattavan tärkeä ja
        perusteltu syy, joka syrjäyttää sinun etusi, oikeutesi ja vapautesi, tai
        käsittely on tarpeen oikeusvaateen laatimiseksi, esittämiseksi tai
        puolustamiseksi.
      </p>

      <h5>Oikeus tehdä valitus valvontaviranomaiselle</h5>
      <p className="mb-4">
        Sinulla on oikeus tehdä valitus tietosuojavaltuutetulle, jos katsot,
        että henkilötietojesi käsittelyssä rikotaan lakia. Lisätietoja
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
