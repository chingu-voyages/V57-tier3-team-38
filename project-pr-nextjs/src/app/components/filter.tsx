"use client";

import React, { useState, useRef } from "react";
import { PullRequest } from "./PullRequestCard";

export default function Filter({
  onFetchLive,
  onUseCache,
  onClearCache,
}: {
  onFetchLive: () => void;
  onUseCache: () => void;
  onClearCache: () => void;
}) {
  const [isCachingDropdownOpen, setIsCachingDropdownOpen] = useState(false);
  //const divRef = useRef<HTMLDivElement | null>(null);


  const toggleCachingDropdown = () => {
    setIsCachingDropdownOpen(!isCachingDropdownOpen);
  };

  return (
    <div>
      <div className="flex flex-row items-center justify-end bg-gray-900 border-b border-b-[#30363D] h-auto w-full py-3 px-4 space-x-3 sm:space-x-4">
        <div className="flex flex-row items-center justify-end flex-wrap space-x-3 sm:space-x-4">
          <div
            id="sourceBadge"
            className="w-[110px] ml-8 mx-8 text-xs text-gray-400 bg-slate-950 px-2 py-1 rounded border border-[#30363D] text-center sm:text-left"
          >
            Source: No data
          </div>

          <div className="relative">
            <button
              onClick={toggleCachingDropdown}
              className="w-[90px] h-auto cursor-pointer sm:mr-10 sm:w-auto bg-slate-950 border
                border-[#30363D] rounded-lg px-2 py-1 sm:px-3 sm:py-1.5 text-sm flex items-center justify-center sm:justify-start 
                space-x-2 hover:bg-gray-800 transition-colors"
            >
              <svg
                className="w-4 h-4 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"></path>
              </svg>
              <span className="text-gray-400">Cache</span>
            </button>

            {isCachingDropdownOpen && (
              <div
                id="cachingDropdown"
                className={`absolute cursor-pointer right-0 mt-2 max-h-[288px] max-w-[190px] mr-10 w-72 bg-[#0d1117] border border-[#30363D]  rounded-lg shadow-lg z-50 ${
                  isCachingDropdownOpen ? "" : "hidden"
                }`}
              >
                <div className="p-2">
                  <div className="p-2">
                    <button
                      onClick={onFetchLive}
                      className="w-full text-left cursor-pointer px-3 py-2 text-sm hover:bg-slate-950 rounded-lg transition-colors text-white"
                    >
                      Get Live Data &amp; Save
                    </button>

                    <button
                      onClick={onUseCache}
                      className="w-full text-left cursor-pointer px-3 py-2 text-sm hover:bg-slate-950 rounded-lg transition-colors text-white"
                    >
                      Use Cached Data
                    </button>

                    <button
                      onClick={onClearCache}
                      className="w-full text-left cursor-pointer px-3 py-2 text-sm hover:bg-slate-950 rounded-lg transition-colors text-red-400"
                    >
                      Clear Cache
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
