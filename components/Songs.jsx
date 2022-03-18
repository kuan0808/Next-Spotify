import React from "react";
import Song from "./Song";

const Songs = ({ tracks, trackId, ssrIsPlaying }) => {
  return (
    <div className="text-white px-8 flex flex-col space-y-1 pb-28">
      {tracks?.tracks.items.map((track, idx) => (
        <Song
          key={track.track.id}
          track={track}
          order={idx}
          trackId={trackId}
          ssrIsPlaying={ssrIsPlaying}
        />
      ))}
      <p></p>
    </div>
  );
};

export default Songs;
