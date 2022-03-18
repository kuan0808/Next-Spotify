import { atom } from "recoil";

export const RefreshPlaylists = atom({
  key: "RefreshPlaylists",
  default: false,
});

export const UseSSRPlaylists = atom({
  key: "UseSSRPlaylists",
  default: true,
});

export const CurrentPlaylistId = atom({
  key: "CurrentPlaylistId",
  default: null,
});
