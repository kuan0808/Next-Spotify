import React, { useState, useEffect, useCallback } from "react";
import { useRecoilState } from "recoil";
import {
  HeartIcon,
  VolumeUpIcon as VolumeDownIcon,
} from "@heroicons/react/outline";
import {
  FastForwardIcon,
  PauseIcon,
  PlayIcon,
  ReplyIcon,
  RewindIcon,
  VolumeUpIcon,
  SwitchHorizontalIcon,
} from "@heroicons/react/solid";
import _ from "lodash";

import {
  CurrentTrackId,
  IsPlaying,
  UseSSRIsPlaying,
  UseSSRTrack,
} from "../atoms/songAtom";
import useSpotify from "../hooks/useSpotify";
import useTrackInfo from "../hooks/useTrackInfo";

const Player = ({ ssrTrackInfo, ssrIsPlaying }) => {
  const spotifyApi = useSpotify();
  const [isPlaying, setIsPlaying] = useRecoilState(IsPlaying);
  const [useSSRIsPlaying, setUseSSRIsPlaying] = useRecoilState(UseSSRIsPlaying);

  const [currentTrackId, setCurrentTrackId] = useRecoilState(CurrentTrackId);
  const [useSSRTrack, setUseSSRTrack] = useRecoilState(UseSSRTrack);
  const trackInfo = useTrackInfo();

  const [volume, setVolume] = useState(0);

  const [updateTrackId, setUpdateTrackId] = useState(false);

  const clientTrackInfo = useSSRTrack ? ssrTrackInfo : trackInfo;
  const clientIsPlaying = useSSRIsPlaying ? ssrIsPlaying : isPlaying;

  useEffect(() => {
    if (spotifyApi.getAccessToken() && updateTrackId) {
      const fetchCurrentTrack = async () => {
        let trackId = await spotifyApi
          .getMyCurrentPlayingTrack()
          .then((data) => data?.body?.item?.id);
        setCurrentTrackId(trackId);
      };
      setTimeout(fetchCurrentTrack, 500);
      setUpdateTrackId(false);
    }
  }, [updateTrackId]);

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debounceAdjustVolume(volume);
    }
  }, [volume]);

  const handlePlayPause = async () => {
    const data = await spotifyApi.getMyCurrentPlaybackState();
    setUseSSRIsPlaying(false);
    if (data.body?.is_playing) {
      return spotifyApi.pause().then(() => {
        setIsPlaying(false);
      });
    } else {
      return spotifyApi.play().then(() => {
        setIsPlaying(true);
      });
    }
  };

  const handleSkipSong = async (operation) => {
    const url = `https://api.spotify.com/v1/me/player/${operation}`;
    try {
      await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
          "content-type": "application/json",
        },
      });
      setUpdateTrackId(true);
    } catch (e) {
      console.log(e);
    }
  };

  // Debounce the volume adjustment to avoid spamming the API
  const debounceAdjustVolume = useCallback(
    _.debounce((volume) => {
      spotifyApi.setVolume(volume).catch((err) => {});
    }, 300),
    []
  );
  return (
    <div className="h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-sm px-2 md:px-8">
      {/* Left */}
      <div className="flex items-center space-x-4">
        <img
          className="hidden md:inline h-10 w-10"
          src={clientTrackInfo?.album?.images?.[0]?.url}
          alt={clientTrackInfo?.name}
        />
        <div>
          <h3>{clientTrackInfo?.name}</h3>
          <p className="text-xs">{clientTrackInfo?.artists?.[0]?.name}</p>
        </div>
      </div>

      {/* Center */}
      <div className="flex items-center justify-evenly">
        <SwitchHorizontalIcon className="button" />
        <RewindIcon
          onClick={() => handleSkipSong("previous")}
          className="button"
        />
        {clientIsPlaying ? (
          <PauseIcon className="button w-10 h-10" onClick={handlePlayPause} />
        ) : (
          <PlayIcon onClick={handlePlayPause} className="button w-10 h-10" />
        )}
        <FastForwardIcon
          onClick={() => handleSkipSong("next")}
          className="button"
        />
        <ReplyIcon className="button" />
      </div>

      {/* Right */}
      <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
        <VolumeDownIcon
          className="button"
          onClick={() => volume > 0 && setVolume(_.clamp(volume - 10, 0, 100))}
        />
        <input
          className="w-14 md:w-20"
          type="range"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          min={0}
          max={100}
        />
        <VolumeUpIcon
          className="button"
          onClick={() =>
            volume < 100 && setVolume(_.clamp(volume + 10, 0, 100))
          }
        />
      </div>
    </div>
  );
};

export default Player;
