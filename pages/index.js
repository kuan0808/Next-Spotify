import _ from "lodash";
import { getSession } from "next-auth/react";
import Head from "next/head";

import { Center, Player, Sidebar } from "../components";
import spotifyApi from "../lib/spotify";

export default function Home({
  playlists,
  playlistId,
  tracks,
  trackId,
  trackInfo,
  isPlaying,
}) {
  return (
    <div className="bg-black h-screen overflow-hidden">
      <Head>
        <title>Next Spotify</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex">
        <Sidebar
          ssrPlaylists={playlists}
          ssrPlaylistId={playlistId}
          ssrIsPlaying={isPlaying}
        />
        <Center
          ssrTracks={tracks}
          ssrTrackId={trackId}
          ssrIsPlaying={isPlaying}
        />
      </main>
      <div className="sticky bottom-0">
        <Player
          ssrTracks={tracks}
          ssrTrackInfo={trackInfo}
          ssrIsPlaying={isPlaying}
        />
      </div>
    </div>
  );
}

export const getServerSideProps = async (ctx) => {
  // Check if the user is authenticated
  const session = await getSession(ctx);
  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }
  spotifyApi.setAccessToken(session.user.accessToken);

  // Get all playlists SSR
  const {
    body: { items: playlists },
  } = await spotifyApi.getUserPlaylists();

  // Get all tracks for a random playlist
  const playlistId = _.shuffle(playlists).pop().id;
  const { body: tracks } = await spotifyApi.getPlaylist(playlistId);

  // Chaining the promises to avoid API errors when fetching current track info & playing status
  const result = await spotifyApi
    .getMyDevices()
    .then(async (data) => {
      // See if there's a active device available to prevent API error
      let availableDevices = data.body.devices;
      let hasActiveDevice = availableDevices.some((device) => device.is_active);
      if (!hasActiveDevice) {
        console.log("No active device found, setting first device as active");
        return spotifyApi
          .play({
            device_id: availableDevices[0].id,
          })
          .then(() => {
            console.log("Device active");
            return spotifyApi.pause({
              device_id: availableDevices[0].id,
            });
          });
      }
    })
    //Get current playing track
    .then(async () => {
      return spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        return { trackId: data?.body?.item?.id };
      });
    })
    // Get current track info
    .then(async (acc) => {
      return fetch(`https://api.spotify.com/v1/tracks/${acc.trackId}`, {
        headers: {
          Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
        },
      }).then((res) =>
        res.json().then((data) => ({ ...acc, trackInfo: data }))
      );
    })
    // Get current playback state
    .then(async (acc) => {
      return spotifyApi
        .getMyCurrentPlaybackState()
        .then((data) => ({ ...acc, ...{ isPlaying: data?.body?.is_playing } }));
    })
    .then((acc) => {
      return acc;
    })
    .catch((err) => console.log(err));

  return {
    props: {
      session,
      playlists,
      playlistId,
      tracks,
      ...result,
    },
  };
};
