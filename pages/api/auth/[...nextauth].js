import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

import spotifyApi, { LOGIN_URL } from "../../../lib/spotify";

const refreshAccessToken = async (token) => {
  try {
    spotifyApi.setAccessToken(token.accessToken);
    spotifyApi.setRefreshToken(token.refreshToken);

    const { body: refreshedToken } = await spotifyApi.refreshAccessToken();
    console.log("GET REFRESHTOKEN, RETURNING...");
    // console.log(
    //   "expires_refreshed: ",
    //   Date.now() + refreshToken.expires_in * 1000
    // );
    return {
      ...token,
      accessToken: refreshedToken.access_token,
      accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000, // = 1 hour as 3600 (seconds) return from spotify API
      refreshToken: refreshedToken.refresh_token ?? token.refreshToken, // Basically refreshToken never expires, unless spotify revoke it
    };
  } catch (error) {
    console.log(error);

    return {
      ...token,
      error: "RefreahAccessTokenError",
    };
  }
};

export default NextAuth({
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      authorization: LOGIN_URL,
    }),
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, account, user }) {
      console.log("TOKEN: ", token);
      // Check if it's an initial sign in, if not, account and user will be undefined
      if (account && user) {
        console.log("NEW USER SIGNED IN");
        console.log("account: ", account);
        console.log("user: ", user);
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
          accessTokenExpires: account.expires_at * 1000, //convert to ms
        };
      }

      // Return the previous token if the access token has not expired yet
      if (token.accessTokenExpires > Date.now()) {
        console.log("EXISITING ACCESS TOKEN IS VALID");
        console.log("account: ", account);
        console.log("user: ", user);
        console.log("token: ", token);
        return token;
      }

      // AcessToken expired, refresh it
      console.log("ACCESS TOKEN HAS EXPIRED, REFRESHING...");
      return await refreshAccessToken(token);
    },

    // session is for client side, and token is for server side
    //eg. client don't need to know the expiry time of the token
    async session({ session, token }) {
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.user.username = token.username;

      return session;
    },
  },
});
