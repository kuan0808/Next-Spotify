import { getSession } from "next-auth/react";
import Head from "next/head";

import { Center, Player, Sidebar } from "../components";

export default function Home() {
  return (
    <div className="bg-black h-screen overflow-hidden">
      <Head>
        <title>Next Spotify</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex">
        <Sidebar />
        <Center />
      </main>
      <div className="sticky bottom-0">
        <Player />
      </div>

      <div>{/* Player */}</div>
    </div>
  );
}

export const getServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  return {
    props: {
      session,
    },
  };
};
