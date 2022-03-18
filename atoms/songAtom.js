import { atom } from "recoil";

export const UseSSRTracks = atom({
  key: "UseSSRTracks",
  default: true,
});

export const CurrentTrackId = atom({
  key: "CurrentTrackId",
  default: null,
});

export const UseSSRTrack = atom({
  key: "useSSRTrack",
  default: true,
});

export const IsPlaying = atom({
  key: "IsPlaying",
  default: false,
});

export const UseSSRIsPlaying = atom({
  key: "UseSSRisPlaying",
  default: true,
});
