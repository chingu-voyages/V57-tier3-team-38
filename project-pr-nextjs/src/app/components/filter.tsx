"use client";

import React, { useState } from 'react'

export default function filter() {
  const [isRepoDropdownOpen, setIsRepoDropdownOpen] = useState(false);
  const [isCachingDropdownOpen, setIsCachingDropdownOpen] = useState(false);

  const toggleRepoDropdown = () => {
    setIsRepoDropdownOpen(!isRepoDropdownOpen);
  };

  const toggleCachingDropdown = () => {
    setIsCachingDropdownOpen(!isCachingDropdownOpen);
  };

  return (
    <div>
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center bg-gray-900 border-b h-[48px] border-b-[#30363D] justify-between py-3 lg:py-0 lg:h-12 space-y-3 lg:space-y-0">
               
                <div className="flex items-center">
                    <div className="relative w-full lg:w-auto">
                        <button onClick={toggleRepoDropdown} className="w-full ml-10 cursor-pointer lg:w-auto bg-slate-950 border border-[#30363D]  rounded-lg px-3 py-1.5 
                        text-sm flex items-center justify-between lg:justify-start space-x-2 hover:bg-gray-800 transition-colors">
                            <div className="flex items-center space-x-2">
                                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span id="selectedRepo" className="text-gray-400 truncate">Select Repository</span>
                            </div>
                            <svg className="w-3 h-3 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"></path>
                            </svg>
                        </button>

                        {isRepoDropdownOpen && (
                        <div id="repoDropdown" className={`absolute left-0 mt-2 w-full ml-10 overflow-y-auto thin-scrollbar lg:w-64 bg-[#0d1117] border border-[#30363D] max-w-[200px] max-h-[254px] rounded-lg shadow-lg z-50 ${isRepoDropdownOpen ? '' : 'hidden'}`}>
                          <div className="p-3">
                            <input type="text" id="repoSearch" placeholder="Search repositories..." className="w-full bg-slate-950 border border-[#30363D] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                          </div>
                          <div id="repoList" className="dropdown-content"><div 
                          className="px-4 py-2 hover:bg-slate-950 cursor-pointer text-sm border-b border-[#30363D] last:border-b-0">facebook/react</div><div 
                          className="px-4 py-2 hover:bg-slate-950 cursor-pointer text-sm border-b border-[#30363D] last:border-b-0">microsoft/vscode</div><div 
                          className="px-4 py-2 hover:bg-slate-950 cursor-pointer text-sm border-b border-[#30363D] last:border-b-0">vercel/next.js</div><div 
                          className="px-4 py-2 hover:bg-slate-950 cursor-pointer text-sm border-b border-[#30363D] last:border-b-0">nodejs/node</div><div 
                          className="px-4 py-2 hover:bg-slate-950 cursor-pointer text-sm border-b border-[#30363D] last:border-b-0">tailwindlabs/tailwindcss</div><div 
                          className="px-4 py-2 hover:bg-slate-950 cursor-pointer text-sm border-b border-[#30363D] last:border-b-0">vuejs/vue</div><div 
                          className="px-4 py-2 hover:bg-slate-950 cursor-pointer text-sm border-b border-[#30363D] last:border-b-0">angular/angular</div><div 
                          className="px-4 py-2 hover:bg-slate-950 cursor-pointer text-sm border-b border-[#30363D] last:border-b-0">tensorflow/tensorflow</div><div 
                          className="px-4 py-2 hover:bg-slate-950 cursor-pointer text-sm border-b border-[#30363D] last:border-b-0">kubernetes/kubernetes</div><div 
                          className="px-4 py-2 hover:bg-slate-950 cursor-pointer text-sm border-b border-[#30363D] last:border-b-0">docker/docker</div></div>
                        </div>
                        )}
                    </div>
                </div>

                
                <div className="flex-1 lg:max-w-md lg:mx-8">
                    <div className="relative">
                        <input type="text" id="globalSearch" placeholder="Search PRs..." className="w-full bg-slate-950 border border-[#30363D]  rounded-lg pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                        <svg className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"></path>
                        </svg>
                    </div>
                </div>

                
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">            
                    <div id="sourceBadge" className="text-xs text-gray-400 bg-slate-950 px-2 py-1 rounded border border-[#30363D]  text-center sm:text-left">Source: No data</div>

                    <div className="relative">
                        <button onClick={toggleCachingDropdown} className="w-full cursor-pointer mr-10 sm:w-auto bg-slate-950 border border-[#30363D]  rounded-lg px-3 py-1.5 text-sm flex items-center justify-center sm:justify-start space-x-2 hover:bg-gray-800 transition-colors">
                            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"></path>
                            </svg>
                            <span className="text-gray-400">Cache</span>
                        </button>

                        { isCachingDropdownOpen && (
                        <div id="cachingDropdown" className={`absolute right-0 mt-2 max-h-[288px] max-w-[190px] mr-10 w-72 bg-[#0d1117] border border-[#30363D]  rounded-lg shadow-lg z-50 ${isCachingDropdownOpen ? '' : 'hidden'}`}>
                            <div className="p-4 border-b border-[#30363D] ">
                                <div className="text-sm font-medium text-white" id="cacheTitle">Cache (No repository selected)</div>
                                <div className="text-xs text-gray-400 mt-1" id="cacheSubtitle">No cache available</div>
                            </div>
                            <div className="p-2">
                                <button className="w-full text-left px-3 py-2 text-sm hover:bg-slate-950 rounded-lg transition-colors text-white">
                                    🔄 Get Live Data &amp; Save
                                </button>
                                <button id="useCachedButton" className="w-full text-left px-3 py-2 text-sm hover:bg-slate-950 rounded-lg transition-colors text-gray-400">
                                    📂 Use Cached Data
                                </button>
                                <button id="clearCacheButton" className="w-full text-left px-3 py-2 text-sm hover:bg-slate-950 rounded-lg transition-colors text-red-400">
                                    🗑️ Clear Cache
                                </button>
                            </div>
                        </div>
                          )}
                    </div>
                </div>
            </div>
    </div>
  );
}
