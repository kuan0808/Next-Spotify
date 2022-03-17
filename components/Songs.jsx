import React from "react";
import { useRecoilValue } from "recoil";

import { PlaylistsState, PlaylistState } from "../atoms/playlistAtom";
import Song from "./Song";

const Songs = () => {
  const playlist = useRecoilValue(PlaylistState);

  return (
    <div className="text-white px-8 flex flex-col space-y-1 pb-28">
      {playlist?.tracks.items.map((track, idx) => (
        <Song key={track.track.id} track={track} order={idx} />
      ))}
      <p></p>
    </div>
  );
};

export default Songs;
