"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function Profile() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <button
        onClick={() => signIn("github")}
        className="flex items-start flex-wrap max-w-[80px] max-h-[40px] sm:h-full sm:w-auto 
        text-sm lg:h-auto md:ml-auto md:mr-10 cursor-pointer font-bold bg-blue-500 hover:bg-blue-600 
        text-white py-2 px-4 rounded-lg whitespace-nowrap ml-4"
      >
        Sign in
      </button>
    );
  }

  return (
    <div className="sm:ml-auto ml-4 flex flex-wrap items-center space-x-4">
      <img
        src={session.user?.image || "/default-avatar.png"}
        alt={session.user?.name || "GitHub Avatar"}
        className="w-8 h-8 rounded-full"
      />
      <span className="text-white sm:font-medium font-normal text-sm">{session.user?.name}</span>
      <button
        onClick={() => signOut()}
        // className="cursor-pointer font-bold bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-lg text-xs"
className="flex items-start flex-wrap max-w-[80px] max-h-[40px] sm:h-full sm:w-auto 
        text-sm lg:h-auto md:ml-auto md:mr-10 cursor-pointer font-bold bg-red-500 hover:bg-red-600 
        text-white py-2 px-4 rounded-lg whitespace-nowrap ml-4"
>


        Sign out
      </button>
    </div>
  );
}
