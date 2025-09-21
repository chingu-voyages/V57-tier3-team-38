"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function Profile() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <button
        onClick={() => signIn("github")}
        className="ml-auto mr-10 cursor-pointer font-bold bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
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
      <span className="text-white font-medium">{session.user?.name}</span>
      <button
        onClick={() => signOut()}
        className="cursor-pointer font-bold bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-lg"
      >
        Sign out
      </button>
    </div>
  );
}
