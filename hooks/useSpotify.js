import React, { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";

import spotifyApi from "../lib/spotify";

const useSpotify = () => {
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      //If refresh access token attempt fails, direct user to login
      if (session.error === "RefreahAccessTokenError") {
        signIn();
      }

      spotifyApi.setAccessToken(session.user.accessToken);
    }
  }, [session]);

  return spotifyApi;
};

export default useSpotify;
