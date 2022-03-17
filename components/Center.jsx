import { ChevronDownIcon } from "@heroicons/react/solid";
import { signOut, useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import { shuffle } from "lodash";
import { useRecoilState, useRecoilValue } from "recoil";

import {
  PlaylistIdState,
  PlaylistsState,
  PlaylistState,
} from "../atoms/playlistAtom";
import useSpotify from "../hooks/useSpotify";
import Songs from "./Songs";

const from_colors = [
  "from-indigo-500",
  "from-blue-500",
  "from-green-500",
  "from-red-500",
  "from-yellow-500",
  "from-pink-500",
  "from-purple-500",
];

const Center = () => {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();
  const [fromColor, setFromColor] = useState(null);
  const playlists = useRecoilValue(PlaylistsState);
  const [playlistId, setPlaylistId] = useRecoilState(PlaylistIdState);
  const [playlist, setPlaylist] = useRecoilState(PlaylistState);

  useEffect(() => {
    setFromColor(shuffle(from_colors).pop());
  }, [playlistId]);

  // After user playlists being loaded in sidebar, set the playlistId to a random one
  useEffect(() => {
    if (playlists.length === 0) return;
    setPlaylistId(shuffle(playlists).pop().id);
  }, [playlists]);

  // After playlistId being set, get the playlist
  useEffect(() => {
    if (!playlistId) return;
    spotifyApi
      .getPlaylist(playlistId)
      .then((data) => {
        setPlaylist(data.body);
      })
      .catch((err) => console.log("Something went wrong!", err));
  }, [spotifyApi, playlistId]);

  return (
    <div className="relative flex-grow text-white h-screen overflow-y-scroll scrollbar-hide">
      <header className="absolute top-5 right-8">
        <div
          className="flex items-center justify-center bg-black gap-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full
        p-0.5 lg:pr-2 text-white"
          onClick={signOut}
        >
          <img
            className="rounded-full w-8 h-8"
            src={session?.user.image}
            alt={`${session?.user.name}'s avatar`}
          />
          <h2 className="hidden lg:inline text-sm">{session?.user?.name}</h2>
          <ChevronDownIcon className="hidden lg:inline w-5 h-5" />
        </div>
      </header>

      <section
        className={`flex items-end space-x-7 bg-gradient-to-b to-black ${fromColor} h-80 text-white p-8`}
      >
        <img
          className="w-44 h-44 shadow-2xl object-cover"
          src={playlist?.images?.[0]?.url}
          alt=""
        />
        <div>
          <p>Playlist</p>
          <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">
            {playlist?.name}
          </h1>
        </div>
      </section>
      <div>
        <Songs />
      </div>
    </div>
  );
};

export default Center;
