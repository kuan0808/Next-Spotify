import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
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

import { currentTrackState, isPlayingState } from "../atoms/songAtom";
import useSpotify from "../hooks/useSpotify";
import useSongInfo from "../hooks/useSongInfo";

const Player = () => {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();
  const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState(50);

  const songInfo = useSongInfo();

  // If no song is selected in this app, fetch the current song from Spotify
  const fetchCurrentSong = async () => {
    spotifyApi.getMyCurrentPlayingTrack().then((data) => {
      setCurrentTrackId(data.body?.item?.id);

      spotifyApi.getMyCurrentPlaybackState().then((data) => {
        setIsPlaying(data.body?.is_playing);
      });
    });
  };

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !songInfo) {
      // Fetch the song info
      fetchCurrentSong();
      setVolume(50);
    }
  }, [songInfo, spotifyApi, session]);

  const handlePlayPause = async () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data.body?.is_playing) {
        spotifyApi.pause();
        setIsPlaying(false);
      } else {
        spotifyApi.play();
        setIsPlaying(true);
      }
    });
  };

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debounceAdjustVolume(volume);
    }
  }, [volume]);

  // Debounce the volume adjustment to avoid spamming the API
  const debounceAdjustVolume = useCallback(
    _.debounce((volume) => {
      spotifyApi.setVolume(volume).catch((err) => {});
    }, 300),
    []
  );

  console.log(songInfo);
  return (
    <div className="h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-sm px-2 md:px-8">
      {/* Left */}
      <div className="flex items-center space-x-4">
        <img
          className="hidden md:inline h-10 w-10"
          src={songInfo?.album?.images?.[0]?.url}
          alt={songInfo?.name}
        />
        <div>
          <h3>{songInfo?.name}</h3>
          <p className="text-xs">{songInfo?.artists?.[0]?.name}</p>
        </div>
      </div>

      {/* Center */}
      <div className="flex items-center justify-evenly">
        <SwitchHorizontalIcon className="button" />
        <RewindIcon
          onClick={() => {
            spotifyApi.skipToPrevious().then(fetchCurrentSong());
            // fetchCurrentSong();
          }}
          className="button"
        />
        {isPlaying ? (
          <PauseIcon className="button w-10 h-10" onClick={handlePlayPause} />
        ) : (
          <PlayIcon onClick={handlePlayPause} className="button w-10 h-10" />
        )}
        <FastForwardIcon
          onClick={() =>
            spotifyApi.skipToNext().then(() => {
              console.log("next");
              fetchCurrentSong();
            })
          }
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
