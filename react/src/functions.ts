import axios, { AxiosResponse } from "axios";

const responseBody = (response: AxiosResponse) => response.data;

export type TURLCreationSuccessResponse = {
  id: string;
};

export type TURLCreationResponse = null | TURLCreationSuccessResponse;

export async function createURL(url: string): Promise<TURLCreationResponse> {
  try {
    return await axios.post("/api/urls", { url }).then(responseBody);
  } catch (error) {
    console.error("Error while trying to save URL", error);
    return null;
  }
}

export async function getURL(id: string): Promise<string | null> {
  try {
    return await axios.get(`/api/short/${id}`).then(responseBody);
  } catch (error) {
    console.error("Error while trying to get URL", error);
    return null;
  }
}
