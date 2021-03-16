import localforage from "localforage";
import { PlaylistState } from "../features/playlist/playlistSlice";
import { UserState } from "../features/user/userSlice";
const STATE_KEY = "hankkeennimi";

export type LocalStorageState = {
  playlist: PlaylistState;
  user: UserState;
};

export const loadState = async (): Promise<LocalStorageState | null> => {
  try {
    return await localforage.getItem(STATE_KEY);
  } catch (error) {
    return null;
  }
};

export const saveState = async (state: LocalStorageState) => {
  try {
    await localforage.setItem(STATE_KEY, state);
    return true;
  } catch (error) {
    return false;
  }
};
