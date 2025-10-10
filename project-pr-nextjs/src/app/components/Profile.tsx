"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import React from "react";

export default function Profile() {
  const { data: session } = useSession();

  const handleSignOut = async () => {
    await signOut({ redirect: false });

    const returnTo = encodeURIComponent(window.location.origin); 
    window.location.href = `https://github.com/logout?return_to=${returnTo}`;
  };

  if (!session) {
    return (
      <button
        onClick={() => signIn("github", { prompt: "login" })}
        className="flex items-center justify-center max-w-[80px] max-h-[40px] sm:h-full sm:w-auto 
          text-sm lg:h-auto md:ml-auto md:mr-10 cursor-pointer font-bold bg-blue-500 hover:bg-blue-600 
          text-white py-2 px-4 rounded-lg whitespace-nowrap ml-4"
      >
        Sign in
      </button>
    );
  }

  return (
    <div className="ml-auto mr-10 flex items-center space-x-4">
      <img
        src={session.user?.image || "/default-avatar.png"}
        alt={session.user?.name || "GitHub Avatar"}
        className="w-8 h-8 rounded-full"
      />
      {/* <span className="text-white font-medium">{session.user?.name}</span> */}
      <button
        onClick={handleSignOut}
        className="cursor-pointer text-sm font-bold bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-lg"
      >
        Sign out
      </button>
    </div>
  );
}
