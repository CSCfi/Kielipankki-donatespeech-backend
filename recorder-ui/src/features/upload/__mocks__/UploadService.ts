export const initUpload = jest.fn(async () =>
  Promise.resolve({ presignedUrl: "test-url" })
);

export const deleteUpload = jest.fn(() => async () => Promise.resolve());

export const uploadAudioFile = jest.fn(() => async () => Promise.resolve(""));
