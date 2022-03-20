import React, { useEffect, useState } from "react";
import {
  HomeIcon,
  SearchIcon,
  LibraryIcon,
  PlusCircleIcon,
  HeartIcon,
  RssIcon,
} from "@heroicons/react/outline";
import { useRecoilState, useRecoilValue } from "recoil";
import clsx from "clsx";

import useSpotify from "../hooks/useSpotify";
import {
  CurrentPlaylistId,
  RefreshPlaylists,
  UseSSRPlaylists,
} from "../atoms/playlistAtom";
import { CurrentTrackId, IsPlaying, UseSSRIsPlaying } from "../atoms/songAtom";
import { VolumeUpIcon } from "@heroicons/react/solid";

const Sidebar = ({ ssrPlaylists, ssrPlaylistId, ssrIsPlaying }) => {
  const spotifyApi = useSpotify();
  const [playlists, setPlaylists] = useState([]);
  const [useSSRPlaylists, setUseSSRPlaylists] = useRecoilState(UseSSRPlaylists);
  const [refreshPlaylists, setRefreshPlaylists] = useRecoilState(
    RefreshPlaylists
  );
  const [currentPlaylistId, setCurrentPlaylistId] = useRecoilState(
    CurrentPlaylistId
  );

  const [playingPlaylistId, setPlayingPlaylistId] = useState(null);

  const isPlaying = useRecoilValue(IsPlaying);
  const useSSRIsPlaying = useRecoilValue(UseSSRIsPlaying);

  const currentTrackId = useRecoilValue(CurrentTrackId);

  const clientPlaylists = useSSRPlaylists ? ssrPlaylists : playlists;
  const clientIsPlaying = useSSRIsPlaying ? ssrIsPlaying : isPlaying;
  const clientPlaylistId = !currentPlaylistId
    ? ssrPlaylistId
    : currentPlaylistId;

  useEffect(() => {
    if (spotifyApi.getAccessToken() && refreshPlaylists) {
      spotifyApi.getUserPlaylists().then((data) => {
        setPlaylists(data.body.items);
      });
      setRefreshPlaylists(false);
      setUseSSRPlaylists(false);
    }
  }, [refreshPlaylists, spotifyApi]);

  useEffect(() => {
    const fetchPlayingPlaylistId = async () => {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        let id = data?.body?.context?.uri?.split(":")[2];
        setPlayingPlaylistId(id);
      });
    };
    setTimeout(() => {
      fetchPlayingPlaylistId();
    }, 800);
  }, [currentTrackId]);

  return (
    <div className="text-gray-500 p-5 text-xs lg:text-sm border-r border-gray-900 overflow-y-scroll scrollbar-hide h-screen w-[14rem] hidden md:inline-flex pb-36">
      <div className="space-y-4 w-full">
        <button className="flex items-center space-x-2 hover:text-white">
          <HomeIcon className="h-5 w-5" />
          <p>Home</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <SearchIcon className="h-5 w-5" />
          <p>Search</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <LibraryIcon className="h-5 w-5" />
          <p>Your Library</p>
        </button>
        <hr className="border-t-[0.1px] border-gray-900" />

        <button className="flex items-center space-x-2 hover:text-white">
          <PlusCircleIcon className="h-5 w-5" />
          <p>Create Playlist</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <HeartIcon className="h-5 w-5" />
          <p>Liked Songs</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <RssIcon className="h-5 w-5" />
          <p>Your Episodes</p>
        </button>
        <hr className="border-t-[0.1px] border-gray-900" />

        {/* PlayLists */}
        {clientPlaylists.map((playlist) => (
          <div
            key={playlist.id}
            className={clsx("flex items-center justify-between", {
              "text-white": clientPlaylistId === playlist.id,
            })}
            onClick={() => setCurrentPlaylistId(playlist.id)}
          >
            <p className="cursor-pointer hover:text-white truncate pr-1">
              {playlist.name}
            </p>
            {playingPlaylistId === playlist.id && clientIsPlaying && (
              <VolumeUpIcon className="h-3 w-3" />
            )}
          </div>
        ))}
        {/* Dummy data for my lack of playlist 😅 */}
        <p className="cursor-pointer hover:text-white">Playlist name...</p>
        <p className="cursor-pointer hover:text-white">Playlist name...</p>
        <p className="cursor-pointer hover:text-white">Playlist name...</p>
        <p className="cursor-pointer hover:text-white">Playlist name...</p>
        <p className="cursor-pointer hover:text-white">Playlist name...</p>
        <p className="cursor-pointer hover:text-white">Playlist name...</p>
        <p className="cursor-pointer hover:text-white">Playlist name...</p>
        <p className="cursor-pointer hover:text-white">Playlist name...</p>
        <p className="cursor-pointer hover:text-white">Playlist name...</p>
        <p className="cursor-pointer hover:text-white">Playlist name...</p>
        <p className="cursor-pointer hover:text-white">Playlist name...</p>
        <p className="cursor-pointer hover:text-white">Playlist name...</p>
        <p className="cursor-pointer hover:text-white">Playlist name...</p>
        <p className="cursor-pointer hover:text-white">Playlist name...</p>
      </div>
    </div>
  );
};

export default Sidebar;
