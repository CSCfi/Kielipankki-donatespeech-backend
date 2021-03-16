import { httpPost, httpDelete, handleErrors } from "../../utils/httpUtil";
import { InitUploadDto } from "./types";

export const initUpload = async (uploadData: InitUploadDto) => {
  return httpPost<{ presignedUrl: string }>("v1/init-upload", uploadData);
};

export const deleteUpload = async (id: string) =>
  httpDelete<{ delete: string }>(`v1/upload/${id}`);

export const uploadAudioFile = async (presignedUrl: string, blob: Blob) => {
  let response: Response;
  try {
    const params: RequestInit = {
      method: "PUT",
      body: blob,
      headers: {
        "Content-Type": blob.type,
      },
    };
    response = await fetch(presignedUrl, params);
  } catch (error) {
    throw new Error(error);
  }

  handleErrors(response);
  return response.statusText;
};
