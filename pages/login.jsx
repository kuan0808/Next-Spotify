import { getProviders, signIn } from "next-auth/react";
import Image from "next/image";
import React from "react";

const Login = ({ providers }) => {
  return (
    <div className="flex  flex-col items-center justify-center bg-black min-h-screen w-full">
      <div className="w-52 h-52 mb-8 relative">
        <Image
          layout="fill"
          objectFit="contain"
          src="https://links.papareact.com/9xl"
          alt="spotify icon"
        />
      </div>
      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button
            className="bg-[#18D860] text-white p-5 rounded-full"
            onClick={() =>
              signIn(provider.id, {
                callbackUrl: "/",
              })
            }
          >
            Login with {provider.name}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Login;

export const getServerSideProps = async (ctx) => {
  const providers = await getProviders();

  return {
    props: {
      providers,
    },
  };
};
