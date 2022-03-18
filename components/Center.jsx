import React, { useState, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { signOut, useSession } from "next-auth/react";
import _, { shuffle } from "lodash";
import { useRecoilState, useRecoilValue } from "recoil";

import { CurrentPlaylistId } from "../atoms/playlistAtom";
import { IsPlaying, UseSSRIsPlaying, UseSSRTracks } from "../atoms/songAtom";
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

const Center = ({ ssrTracks, ssrTrackId, ssrIsPlaying }) => {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();
  const [fromColor, setFromColor] = useState(null);

  const [tracks, setTracks] = useState([]);
  const currentPlaylistId = useRecoilValue(CurrentPlaylistId);
  const [useSSRTracks, setUseSSRTracks] = useRecoilState(UseSSRTracks);

  const clientTracks = useSSRTracks ? ssrTracks : tracks;

  useEffect(() => {
    if (currentPlaylistId) {
      setFromColor(shuffle(from_colors).pop());
    }
  }, [currentPlaylistId]);

  // After playlistId being set, get the playlist
  useEffect(() => {
    if (spotifyApi.getAccessToken() && currentPlaylistId) {
      spotifyApi
        .getPlaylist(currentPlaylistId)
        .then((data) => {
          setTracks(data.body);
          setUseSSRTracks(false);
        })
        .catch((err) => console.log("Something went wrong!", err));
    }
  }, [spotifyApi, currentPlaylistId]);

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
        className={`flex items-end space-x-7 bg-gradient-to-b to-black ${
          fromColor ?? from_colors[0]
        } h-80 text-white p-8`}
      >
        <img
          className="w-44 h-44 shadow-2xl object-cover"
          src={clientTracks?.images?.[0]?.url}
          alt=""
        />
        <div>
          <p>Playlist</p>
          <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">
            {clientTracks?.name}
          </h1>
        </div>
      </section>
      <div>
        <Songs
          tracks={clientTracks}
          trackId={ssrTrackId}
          ssrIsPlaying={ssrIsPlaying}
        />
      </div>
    </div>
  );
};

export default Center;
