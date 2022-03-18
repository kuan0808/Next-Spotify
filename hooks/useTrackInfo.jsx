import React, { useState, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import { CurrentTrackId, IsPlaying, UseSSRTrack } from "../atoms/songAtom";
import useSpotify from "./useSpotify";

const useTrackInfo = () => {
  const spotifyApi = useSpotify();
  const [useSSRTrack, setUseSSRTrack] = useRecoilState(UseSSRTrack);
  const [trackInfo, setTrackInfo] = useState(null);
  const currentTrackId = useRecoilValue(CurrentTrackId);
  const [isPlaying, setIsPlaying] = useRecoilState(IsPlaying);

  useEffect(() => {
    const fetchTrackInfo = async () => {
      if (spotifyApi.getAccessToken() && currentTrackId) {
        const info = await fetch(
          `https://api.spotify.com/v1/tracks/${currentTrackId}`,
          {
            headers: {
              Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
            },
          }
        )
          .then((res) => res.json())
          .catch((err) => console.log("Something went wrong!", err));
        setTrackInfo(info);
        // Set isPlaying to true while switching song
        setIsPlaying(true);
        setUseSSRTrack(false);
      }
    };

    fetchTrackInfo();
  }, [currentTrackId, spotifyApi]);

  return trackInfo;
};

export default useTrackInfo;
