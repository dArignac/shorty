import axios, { AxiosResponse } from "axios";

export type TUserRoles = "anonymous" | "authenticated";

export type TUserIdentification = {
  identityProvider: "github";
  userId: string;
  userDetails: string;
  userRoles: TUserRoles[];
};

export type TClientPrincipal = {
  clientPrincipal: null | TUserIdentification;
};

const responseBody = (response: AxiosResponse) => response.data;

export async function getUserIdentification(): Promise<TClientPrincipal> {
  try {
    return await axios.get<TClientPrincipal>("/.auth/me").then(responseBody);
  } catch (error) {
    console.error("Error occurred when fetching user identification", error);
    return { clientPrincipal: null };
  }
}
