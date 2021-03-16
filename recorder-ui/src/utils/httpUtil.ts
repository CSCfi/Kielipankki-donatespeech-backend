import config from "../config/config";

type FETCH_METHOD = "GET" | "POST" | "PUT" | "DELETE";

export async function httpGet<T>(endpoint: string) {
  return doFetch<T>("GET", getUrl(endpoint));
}

export async function httpPost<T>(endpoint: string, data?: object) {
  return doFetch<T>("POST", getUrl(endpoint), data);
}

export async function httpPut<T>(endpoint: string, data?: object) {
  return doFetch<T>("PUT", getUrl(endpoint), data);
}

export async function httpDelete<T>(endpoint: string) {
  return doFetch<T>("DELETE", getUrl(endpoint));
}

const getUrl = (endpoint: string) => `${config.ENDPOINT}/${endpoint}`;

const getFetchParams: (
  method: FETCH_METHOD,
  data?: object,
  headers?: RequestInit["headers"]
) => RequestInit = (method, data, headers) => {
  const params: RequestInit = {
    method,
    headers: headers || {
      "x-api-key": config.API_KEY,
      "Content-Type": "application/json",
    },
  };

  if (data) {
    params.body = JSON.stringify(data);
  }

  return params;
};

export const handleErrors = (response: Response) => {
  if (response.status < 200 && response.status > 299) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

async function doFetch<T>(
  method: FETCH_METHOD,
  url: string,
  data?: object,
  headers?: RequestInit["headers"]
) {
  let response: Response;
  try {
    response = await fetch(url, getFetchParams(method, data, headers));
  } catch (error) {
    throw new Error(error);
  }
  handleErrors(response);

  return response.json() as Promise<T>;
}
