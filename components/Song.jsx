import clsx from "clsx";
import React from "react";
import { useRecoilState } from "recoil";

import {
  CurrentTrackId,
  IsPlaying,
  UseSSRIsPlaying,
  UseSSRTrack,
} from "../atoms/songAtom";
import useSpotify from "../hooks/useSpotify";
import { millisecondsToMinutesAndSeconds } from "../lib/time";
import PlayingIcon from "./PlayingIcon";

const Song = ({ track, order, trackId, ssrIsPlaying }) => {
  const spotifyApi = useSpotify();
  const [currentTrackId, setCurrentTrackId] = useRecoilState(CurrentTrackId);
  const [isPlaying, setIsPlaying] = useRecoilState(IsPlaying);
  const [useSSRTrack, setUseSSRTrack] = useRecoilState(UseSSRTrack);
  const [useSSRIsPlaying, setUseSSRIsPlaying] = useRecoilState(UseSSRIsPlaying);

  const clientTrackId = useSSRTrack ? trackId : currentTrackId;
  const clientIsPlaying = useSSRIsPlaying ? ssrIsPlaying : isPlaying;

  const handlePlayPause = async () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      setUseSSRIsPlaying(false);
      if (data.body?.is_playing && clientTrackId === track.track.id) {
        spotifyApi.pause();
        setIsPlaying(false);
      } else {
        spotifyApi.play({
          uris: [track.track.uri],
        });
        // | This will trigger the useTrackInfo hook to update the trackInfo state
        // v and invalidate server side data
        setCurrentTrackId(track.track.id);
        setIsPlaying(true);
      }
    });
  };
  return (
    <div
      className={clsx(
        "grid grid-cols-2 text-white/80 text-sm p-4 px-5  rounded-lg cursor-pointer",
        clientTrackId === track.track.id ? "bg-gray-600" : "hover:bg-gray-900"
      )}
      // Double click to play, use e.detail to prevent single click event
      onClick={(e) => e.detail === 2 && handlePlayPause()}
    >
      <div className="flex items-center space-x-4">
        <div className="w-5 flex justify-center items-start">
          {clientIsPlaying && clientTrackId === track.track.id ? (
            <PlayingIcon />
          ) : (
            <p
              className={clsx(
                clientTrackId === track.track.id && "text-green-500"
              )}
            >
              {order + 1}
            </p>
          )}
        </div>
        <img
          className="h-10 w-10"
          src={track.track.album.images[0].url}
          alt={track.track.album.name}
        />
        <div>
          <p
            className={clsx(
              "w-36 lg:w-64 text-base text-white truncate",
              track.track.id === clientTrackId && "text-green-500"
            )}
          >
            {track.track.name}
          </p>
          <p className="w-40">{track.track.artists[0].name}</p>
        </div>
      </div>
      <div className="flex items-center justify-between ml-auto md:ml-0">
        <p className="w-[15rem] hidden md:inline truncate">
          {track.track.album.name}
        </p>
        <p>{millisecondsToMinutesAndSeconds(track.track.duration_ms)}</p>
      </div>
    </div>
  );
};

export default Song;
