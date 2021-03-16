import React, { useEffect } from "react";
import "./RecorderStatusView.css";
import { RecorderStatus } from "../../../utils/AudioRecorder";
import { useAudioRecorderContext } from "../../../utils/AudioRecorderContext";
import AppIcons from "../../components/AppIcons/AppIcons";
import PlaylistButton from "../../playlist/components/PlaylistButton/PlaylistButton";

type RecorderStatusViewProps = {
  onQuit: () => void;
};

const getTitle = (status: RecorderStatus) => {
  switch (status) {
    case "NotInitialized":
    case "WaitingForAccess":
      return "Anna selaimellesi lupa mikrofonin käyttöön";
    case "AccessDenied":
      return "Lupaa mikrofonin käyttöön ei annettu";
    case "NotSupported":
      return "Palvelu ei toimi selaimellasi";
    default:
      return "";
  }
};

const getBodys = (status: RecorderStatus) => {
  switch (status) {
    case "NotInitialized":
    case "WaitingForAccess":
    case "AccessDenied":
      return [
        "Jotta puheen lahjoittaminen onnistuu, sinun pitää antaa selaimellesi lupa käyttää mikrofonia äänityksen ajan. Kameraa palvelu ei käytä. Ainoastaan ääntä tallennetaan.",
        "Lahjoitettu puhe käsitellään luottamuksellisesti ja sen turvallisesta säilömisestä vastaa yliopistojen Kielipankki.",
      ];
    case "NotSupported":
      return [
        "Puheen lahjoittaminen selaimella onnistuu parhaiten käyttäen uusinta versiota Chromesta tai Firefoxista.",
        "Voit myös ladata Hankkeen nimi -sovelluksen:",
      ];
    default:
      return [];
  }
};

const RecorderStatusView: React.FC<RecorderStatusViewProps> = ({ onQuit }) => {
  const recorder = useAudioRecorderContext();

  useEffect(() => recorder?.initialize(), [recorder]);

  if (!recorder || recorder.status === "NotInitialized") return null;

  const status = recorder.status;
  const getFooter = () => {
    switch (status) {
      case "NotSupported":
        return (
          <>
            <AppIcons />
            <PlaylistButton
              className="my-4"
              text="Palaa etusivulle"
              onClick={onQuit}
            />
          </>
        );
      default:
        return null;
    }
  };

  const bodys = getBodys(status);
  return (
    <div className="recorder-status-view">
      <h3>{getTitle(status)}</h3>
      {bodys.map(b => (
        <p key={b}>{b}</p>
      ))}
      <div>{getFooter()}</div>
    </div>
  );
};

export default RecorderStatusView;
