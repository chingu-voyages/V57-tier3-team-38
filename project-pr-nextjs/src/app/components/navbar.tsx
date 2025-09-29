"use client";

import React, { useState } from "react";
import Link from "next/link";
import Profile from "./Profile";

export default function Navbar() {
  const [activeButton, setActiveButton] = useState<string>("home");

  return (
    <div className="flex flex-wrap items-center  bg-[#161B22] border border-[#30363D] h-[230px] p-4 ">
      <div className="flex items-center flex-shrink-0">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg m-4">
          <Link href="/" passHref>
            <span
              onClick={() => setActiveButton("home")}
              className="text-white font-bold text-lg sm:text-xl"
            >
              PRB
            </span>
          </Link>
        </div>
      </div>

      <h1 className="text-base sm:text-xl font-bold m-4 text-white">
        PR Status Board
      </h1>

      <Link href="/" passHref>
        <button
          className={`flex justify-center items-center rounded-md duration-200 
                    ease-in-out hover:-translate-y-1 bg-[#161B22] cursor-pointer m-2 md:m-4 
                    w-[70px] h-[65px] md:h-[40px] md:w-[98px] text-sm md:text-base 
                    ${
                      activeButton === "home"
                        ? "text-[#58A6FF] bg-zinc-950"
                        : "text-white bg-[#161B22]"
                    }`}
          onClick={() => setActiveButton("home")}
        >
          🏠 Home
        </button>
      </Link>

      <Link href="/openRequests" passHref>
        <button
          className={`flex justify-center items-center rounded-md duration-200 
                    ease-in-out hover:-translate-y-1 bg-[#161B22] cursor-pointer m-2 md:m-4 
                    w-[75px] h-[70px] md:h-[40px] md:w-[127px] text-sm md:text-base 
                    ${
                      activeButton === "open-prs"
                        ? "text-[#58A6FF] bg-zinc-950"
                        : "text-white bg-[#161B22]"
                    }`}
          onClick={() => setActiveButton("open-prs")}
        >
          🔓 Open PRs
        </button>
      </Link>

      <Link href="/closedRequests" passHref>
        <button
          className={`flex justify-center items-center rounded-md duration-200 
                    ease-in-out hover:-translate-y-1 bg-[#161B22] cursor-pointer m-2 md:m-4 
                    w-[80px] h-[75px] md:h-[40px] md:w-[139px] text-sm md:text-base 
                    ${
                      activeButton === "closed-prs"
                        ? "text-[#58A6FF] bg-zinc-950"
                        : "text-white bg-[#161B22]"
                    }`}
          onClick={() => setActiveButton("closed-prs")}
        >
          ✅ Closed PRs
        </button>
      </Link>

      <Profile />
    </div>
  );
}
