import React from "react";

import "./InfoPage.css";
import { Link } from "react-router-dom";
import routes from "../../config/routes";

type InfoPageProps = {};

const InfoPage: React.FC<InfoPageProps> = () => {
  return (
    <div className="info-page frame--view">
      <h2>Tietoa hankkeesta</h2>
      <p className="mb-4">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed quis pretium 
      tellus. Vestibulum id ultrices lorem. Quisque tincidunt commodo interdum. 
      Donec lobortis, leo a suscipit cursus, dolor justo eleifend neque, sed 
      cursus lacus risus nec arcu. Aliquam mattis scelerisque neque vel convallis. 
      Aliquam justo arcu, pulvinar in sollicitudin a, dignissim vitae ligula. 
      Sed suscipit, tortor vitae imperdiet facilisis, velit libero lacinia lectus, 
      non mattis sapien libero id libero. Nam cursus ipsum a imperdiet feugiat. 
      Nunc non varius ligula, vitae vulputate quam. Aenean euismod aliquam venenatis. 
      Sed sed lectus nec tellus interdum luctus vel vel justo. Phasellus vel interdum 
      lacus. In in nisl egestas, dictum nisi nec, hendrerit neque. Curabitur pulvinar 
      dui et sem tincidunt consequat. Phasellus bibendum massa et nulla laoreet semper. 
      Mauris eleifend non erat ac luctus.
      </p>
      <p className="mb-4">
      Proin bibendum accumsan neque at mollis. Nullam dignissim rutrum turpis nec 
      congue. Mauris rutrum nulla at dui iaculis vestibulum. Curabitur nisl risus, 
      venenatis vel faucibus vitae, vulputate nec erat. Class aptent taciti sociosqu 
      ad litora torquent per conubia nostra, per inceptos himenaeos. Vestibulum eu 
      justo a quam dignissim luctus. Quisque sit amet tellus egestas, eleifend sapien 
      id, faucibus nisl. Nam ut finibus ipsum. Cras tellus purus, laoreet a ullamcorper 
      at, rutrum eget ipsum. Aenean sollicitudin pharetra justo ut accumsan. Vestibulum 
      a turpis nec arcu molestie faucibus id a nunc. Mauris nec est venenatis, egestas 
      purus in, laoreet sem. Duis ultricies malesuada mattis. Cras a imperdiet neque. 
      Ut a sem ut ex viverra mollis.
      </p>
      <p className="mb-4">
      Nam lectus ex, varius id malesuada quis, tincidunt vel lorem. Maecenas consequat 
      sapien id lorem molestie, nec gravida erat mollis. Fusce sollicitudin nibh 
      ultrices convallis sollicitudin. Nam sollicitudin erat id leo cursus volutpat. 
      Nam lacinia arcu ut elit rhoncus, id ullamcorper neque consequat. Sed condimentum 
      sollicitudin magna quis consequat. Duis vestibulum, elit et maximus consequat, 
      elit tellus laoreet purus, non malesuada tortor nulla in neque.
      </p>
      <p className="mb-4">
        <Link to={routes.PRIVACY}>Lue lisää tietosuojasta</Link>
      </p>

      <p className="mb-4">
        Mikäli et löydä sivustolta vastausta kysymykseesi tai kohtaat teknisen
        ongelman, otathan yhteyttä
        {"  "}
        <a href="mailto:<your-feedback-email-here>">
          your-feedback-email-here
        </a>
        .
      </p>

      <h3 className="mt-5 mb-4">Usein kysytyt kysymykset</h3>

      <h5>Miksi?</h5>
      <p className="mb-4">
      Praesent vitae massa a tortor ultricies maximus. Mauris feugiat ornare 
      facilisis. Cras vestibulum egestas nibh id lobortis. Mauris semper, 
      dolor in feugiat mollis, velit magna facilisis urna, id semper purus 
      nisi at lorem. Nullam tristique, arcu id lacinia tristique, est dolor 
      sagittis sapien, id faucibus lorem neque in velit. Donec tempor metus 
      odio, ut tempor dolor commodo et. Maecenas ornare viverra nisl sit amet 
      pretium. Duis ac nisi ut magna volutpat gravida.
      </p>

      <h5>Miten?</h5>
      <p className="mb-4">
      Sed nisi metus, venenatis a odio vel, lacinia auctor lorem. Quisque 
      molestie consequat metus eget sollicitudin. Aliquam quis pharetra 
      felis. Sed sodales dui eu mauris fringilla pellentesque.
      </p>

      <h5>Mitä?</h5>
      <p className="mb-4">
      Ut imperdiet felis et neque bibendum, non luctus lectus ullamcorper. 
      Aenean ut eleifend urna, eget aliquam mi. Sed pellentesque ipsum 
      rutrum turpis laoreet tincidunt. Nulla non nibh quis turpis consectetur 
      efficitur at vel tellus.         
      </p>

      <h5>Kuka?</h5>
      <p className="mb-4">
      Cras nec augue turpis. In mauris urna, laoreet at tellus vel, 
      sagittis euismod ligula. Sed sed egestas ligula. Nullam posuere 
      velit sit amet ligula laoreet, et scelerisque nisi tempus. 
      Curabitur porttitor, est ultrices sodales gravida, ligula justo 
      scelerisque mauris, eu tincidunt ligula ipsum sit amet turpis. 
      Phasellus facilisis nibh vel nisi tempus, lobortis porttitor eros 
      posuere.
      </p>

      <h5>Paljonko?</h5>
      <p className="mb-4">
      Nullam pharetra tincidunt ante, id feugiat dolor tincidunt nec. 
      Donec libero quam, porttitor vitae tellus eu, egestas luctus nunc. 
      Duis posuere felis non semper aliquet. Nam in consectetur nisl, 
      id fringilla nisi. Nulla orci ex, ultrices porttitor lacus ut, 
      commodo dapibus diam. Nam volutpat imperdiet mauris. Sed elementum 
      arcu nec pellentesque laoreet.
      </p>

      <h5>Miksi?</h5>
      <p className="mb-4">
      Nam egestas erat lorem, egestas dignissim velit tincidunt eget. 
      Mauris aliquet, magna et imperdiet finibus, nisi urna auctor ligula, 
      non euismod sapien quam in quam. Sed dictum, magna id viverra 
      ultricies, lorem leo tincidunt eros, eget convallis quam est at nisl.
      </p>

      <h5>Pystyykö äänittämäni puheen poistamaan?</h5>
      <p className="mb-4">
        Lahjoituksesi voit poistaa tietokannasta ottamalla yhteyttä osoitteeseen
        {"  "}
        <a href="mailto:<your-removal-email-here>">
          your-removal-email-here
        </a>
        {"  "}
        ja kertomalla heille tunnisteesi sekä ilmaisemalla tahtosi poistaa
        lahjoituksesi tietokannasta. Löydät selainkohtaisen tunnisteesi
        {"  "}
        <Link to={routes.PRIVACY}>Tietosuoja</Link>
        {"  "}
        -sivulta. Mobiilisovellusta käytettäessä asennuskohtainen tunnisteesi
        löytyy
        {"  "}
        <strong>Lisätietoa</strong>
        {"  "}
        -näkymästä.
      </p>

      <p className="mb-4">
        Lisäksi aineistoa hallinnoiva taho voi tarvittaessa poistaa
        puhetallenteita tai muita tietoja.
      </p>
    </div>
  );
};

export default InfoPage;
