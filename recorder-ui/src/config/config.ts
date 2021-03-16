type Conf = {
  ENDPOINT: string;
  API_KEY: string;
  WEBSITE_URL: string;
  SHOW_WIP_NOTE: boolean;
};

const dev: Conf = {
  ENDPOINT: "https://endpoint.dev.example.com",
  API_KEY: "<your-dev-api-key-here>",
  WEBSITE_URL: "https://dev.example.com",
  SHOW_WIP_NOTE: true,
};

const prod: Conf = {
  ENDPOINT: "https://endpoint.example.com",
  API_KEY: "<your-prod-api-key-here>",
  WEBSITE_URL: "https://example.com",
  SHOW_WIP_NOTE: false,
};

const conf = process.env.REACT_APP_STAGE === "prod" ? prod : dev;

const LOCAL_VIDEO_URL = `${process.env.PUBLIC_URL}/media/video`;
const LOCAL_AUDIO_URL = `${process.env.PUBLIC_URL}/media/audio`;
const LOCAL_IMAGE_URL = `${process.env.PUBLIC_URL}/media/image`;

export default {
  LOCAL_AUDIO_URL,
  LOCAL_VIDEO_URL,
  LOCAL_IMAGE_URL,
  ...conf,
  ANALYTICS_ENABLED:
    process.env.REACT_APP_STAGE === "prod" ||
    process.env.REACT_APP_STAGE === "dev",
};
