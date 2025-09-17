"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function Navbar() {
    const [activeButton, setActiveButton] = useState<string>("home");

    return (
        <div className="flex items-center bg-[#161B22] border border-[#30363D] h-[112px] p-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg m-4">
                <span className="text-white font-bold text-lg sm:text-xl">PRB</span>
              
            </div>
            
            <h1 className="text-xl sm:text-2xl font-bold m-4">PR Status Board</h1>
        
        <Link href="/" passHref>
            <button
                className={`flex justify-center items-center rounded-md font-bold duration-300 
                ease-in-out hover:-translate-y-1 bg-[#161B22] cursor-pointer m-4 h-[40px] w-[98px] ${
                    activeButton === "home" ? "text-[#58A6FF] bg-zinc-950" : "text-white bg-[#161B22]"
                }`}
                onClick={() => setActiveButton("home")}
            >
                🏠 Home
            </button>
        </Link>        

        <Link href="/openRequests" passHref>
            <button
                className={`flex justify-center items-center rounded-md font-bold duration-300 
                ease-in-out hover:-translate-y-1 bg-[#161B22] cursor-pointer m-4 h-[40px] w-[127px] ${
                    activeButton === "open-prs" ? "text-[#58A6FF] bg-zinc-950" : "text-white bg-[#161B22]"
                }`}
                onClick={() => setActiveButton("open-prs")}
            >
                🔓 Open PRs
            </button>
        </Link>

        <Link href="/closedRequests" passHref>
            <button
                className={`flex justify-center items-center rounded-md font-bold duration-300 
                ease-in-out hover:-translate-y-1 bg-[#161B22] cursor-pointer m-4 h-[40px] w-[139px] ${
                    activeButton === "closed-prs" ? "text-[#58A6FF] bg-zinc-950" : "text-white bg-[#161B22]"
                }`}
                onClick={() => setActiveButton("closed-prs")}
            >
                ✅ Closed PRs
            </button>
        </Link>
            
                <button className="ml-auto mr-10 cursor-pointer items-center justify-end font-bold bg-blue-500 hover:bg-blue-600 text-white 
                py-2 px-4 rounded-lg transition-colors text-sm">
                    Sign In
                </button>
            
            
        </div>
    );
}