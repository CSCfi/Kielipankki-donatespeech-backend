import React from "react";
import { render, fireEvent, wait } from "../../utils/testUtils";
import ScheduleView from "./ScheduleView";
import summerSchedule from "../configuration/test-assets/summer-schedule.json";
import { Schedule } from "../configuration/types";
import { initUpload, uploadAudioFile } from "../upload/UploadService";
import { InitUploadDto } from "../upload/types";
import { RECORDER_AUDIO_MOCK } from "../../utils/__mocks__/AudioRecorder";

const schedule = (summerSchedule as unknown) as Schedule;

jest.mock("../configuration/ConfigurationService");
jest.mock("../upload/UploadService");
jest.mock("../../utils/firebase");

const mockedInitUpload = (initUpload as unknown) as jest.Mock<
  typeof initUpload
>;
const mockedUploadAudioFile = (uploadAudioFile as unknown) as jest.Mock<
  typeof uploadAudioFile
>;

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({
    scheduleId: "664bc028-a92f-435f-8e33-9ab4921476c1",
  }),
  useHistory: () => ({
    push: () => ({}),
  }),
}));

afterEach(() => {
  jest.clearAllMocks();
});

const init = () => {
  const onRecorderResetRequested = () => {};
  return render(
    <ScheduleView onRecorderResetRequested={onRecorderResetRequested} />
  );
};

const getText = (text: string | null | undefined) => text || "";

it("should not throw", () => {
  init();
});

it("walks through the playlist", async () => {
  const display = init();

  // Schedule start
  const startTitle = schedule.start?.title || schedule.title;
  const foundStartTitle = await display.findByText(getText(startTitle.fi));
  expect(foundStartTitle).toBeInTheDocument();
  const startButton = display.getByText("aloita", { exact: false });
  fireEvent.click(startButton);

  // Playlist
  for (let i = 0; i < schedule.items.length; i++) {
    const item = schedule.items[i];
    const title = item.start?.title || item.title;
    if (title.fi) {
      const foundTitle = await display.findByText(getText(title.fi), {
        exact: false,
      });
      expect(foundTitle).toBeInTheDocument();
    }

    const body1 = item.start?.body1 || item.body1;
    if (body1.fi) {
      const foundBody1 = await display.findByText(getText(body1.fi), {
        exact: false,
      });
      expect(foundBody1).toBeInTheDocument();
    }

    const body2 = item.start?.body2 || item.body2;
    if (body2.fi) {
      const foundBody2 = await display.findByText(getText(body2.fi), {
        exact: false,
      });
      expect(foundBody2).toBeInTheDocument();
    }

    const nextArrowButton = await display.findByLabelText("Seuraava");
    fireEvent.click(nextArrowButton);
  }

  // Schedule finish
  const finishTitle = schedule.finish?.title || schedule.title;
  const foundFinishTitle = await display.findByText(getText(finishTitle.fi));
  expect(foundFinishTitle).toBeInTheDocument();
  const againButton = display.getByText("lahjoita lisää", { exact: false });
  expect(againButton).toBeInTheDocument();
  // Quit and clear schedule state (playlistSlice)
  fireEvent.click(againButton);

  expect(mockedInitUpload).not.toHaveBeenCalled();
  expect(mockedUploadAudioFile).not.toHaveBeenCalled();
});

it("uploads metadata and recording when recording stops", async () => {
  const display = init();

  const startButton = await display.findByText("aloita", { exact: false });
  fireEvent.click(startButton);

  // First item is recording module (isRecording = true) in summer-schedule
  fireEvent.click(await display.findByText("Äänitä"));
  // Recording
  fireEvent.click(await display.findByText("Lopeta äänitys"), { exact: false });
  // Recording stopped
  // => Recorder manager uploads metadata and recording automatically

  wait(() => expect(mockedInitUpload).toHaveBeenCalledTimes(1));
  const args = mockedInitUpload.mock.calls[0];
  const initUploadDto = args[0] as InitUploadDto;
  const expectedFileName = `${RECORDER_AUDIO_MOCK.recordingId}.${RECORDER_AUDIO_MOCK.audioType}`;
  expect(initUploadDto.filename).toEqual(expectedFileName);

  wait(() => expect(mockedUploadAudioFile).toHaveBeenCalledTimes(1));

  // Quit and clear schedule state (playlistSlice)
  fireEvent.click(await display.findByLabelText("Poistu"));
});

it("uploads metadata answers for prompt module when next module is selected", async () => {
  const display = init();

  // First prompt item is the third item (index 2)
  const startButton = await display.findByText("aloita", { exact: false });
  fireEvent.click(startButton);
  const nextButtonLabel = "Seuraava";
  fireEvent.click(await display.findByLabelText(nextButtonLabel));
  fireEvent.click(await display.findByLabelText(nextButtonLabel));

  const promptItem = schedule.items[2];
  const title = promptItem.start?.title.fi || promptItem.title.fi || "";
  const foundTitle = await display.findByText(getText(title), {
    exact: false,
  });
  expect(foundTitle).toBeInTheDocument();

  // NOTE: itemType="text" is used in the test schedule for the prompt item.
  // Was not able to properly select option for react-select used by itemType="choice"
  const expectedAnswer = "1-10 vuotta";
  const inputEl = display.getByLabelText(title);
  fireEvent.change(inputEl, { target: { value: expectedAnswer } });

  // Next item => metadata is uploaded
  fireEvent.click(await display.findByLabelText(nextButtonLabel));
  wait(() => expect(mockedInitUpload).toHaveBeenCalledTimes(1));
  const args = mockedInitUpload.mock.calls[0];
  const initUploadDto = args[0] as InitUploadDto;
  const metadataAnswers = initUploadDto.metadata.user?.answers || [];
  expect(metadataAnswers.length).toEqual(1);
  const answer = metadataAnswers[0];
  expect(answer.values.length).toEqual(1);
  expect(answer.values[0]).toEqual(expectedAnswer);
  expect(answer.itemId).toEqual(promptItem.itemId);

  // Go back to prompt item and then again to the next one.
  // Answer has not been change => metadata should NOT be uploaded
  const previousButtonLabel = "Edellinen";
  fireEvent.click(await display.findByLabelText(previousButtonLabel));
  fireEvent.click(await display.findByLabelText(nextButtonLabel));
  wait(() => expect(mockedInitUpload).toHaveBeenCalledTimes(1));

  // Go back to prompt item, change the value and go to the next item.
  // Answer is changed => metadata should be uploaded
  fireEvent.click(await display.findByLabelText(previousButtonLabel));
  fireEvent.change(inputEl, { target: { value: "100 vuotta" } });
  fireEvent.click(await display.findByLabelText(nextButtonLabel));
  wait(() => expect(mockedInitUpload).toHaveBeenCalledTimes(2));

  // Quit and clear schedule state (playlistSlice)
  fireEvent.click(await display.findByLabelText("Poistu"));
});
