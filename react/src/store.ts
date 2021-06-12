import { Store } from "pullstate";
import { TUserIdentification } from "./auth";

interface IShortyStore {
  isLoggedIn: boolean;
  user: null | TUserIdentification;
}

export const ShortyStore = new Store<IShortyStore>({
  isLoggedIn: false,
  user: null,
});
