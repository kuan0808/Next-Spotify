import { atom } from "recoil";

// Use to save playlists
export const PlaylistsState = atom({
  key: "playlistsState",
  default: [],
});

// Use to save the active playlist ID
export const PlaylistIdState = atom({
  key: "PlaylistIdState",
  default: null,
});

// Use to save the songs in active playlist
export const PlaylistState = atom({
  key: "PlaylistState",
  default: null,
});
