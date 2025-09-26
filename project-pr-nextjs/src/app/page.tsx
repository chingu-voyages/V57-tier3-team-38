"use client";

import React, { useState } from "react";
import SelectFunction from './components/SelectFunction.jsx'
import Link from 'next/link';

export default function Home() {
  const [activeButton, setActiveButton] = useState<string>("home");
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div>
        <SelectFunction />
        <div className="relative justify-center mx-auto overflow-hidden rounded-2xl mt-8 bg-gradient-to-br 
        from-[#147E7E] via-[#2D5D9F] to-[#7A2E2E] h-[530px] w-[605px] md:w-auto md:h-auto lg:w-[1216px] lg:h-[482px]">
                <div className="absolute inset-0 bg-opacity-20"></div>
                <div className="relative text-center py-16 px-8">
                    <h2 className="text-5xl font-bold mb-6 text-white">Track Your Pull Requests</h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">Modern dashboard to monitor GitHub PRs with real-time status updates and intelligent caching</p>
                
                    
                    <div className="max-w-md mx-auto mb-8">
                        <div className="relative">
                            <button onClick={() => toggleDropdown()} className="w-full font-bold text-lg bg-white/10 cursor-pointer backdrop-blur-sm border border-white border-opacity-20 rounded-xl px-6 py-4 
                            text-left flex items-center justify-between hover:bg-white/20 transition-all duration-300">
                                <span id="heroSelectedRepo" className="text-blue-100">Select a repository to get started</span>
                                <svg className="w-5 h-5 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>          
                  
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                      <Link href="/openRequests" passHref>
                        <button onClick={() => setActiveButton("open-prs")} className="bg-white cursor-pointer text-blue-900 font-semibold py-4 px-8 
                        rounded-full hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                            🔓 View Open PRs
                        </button>
                      </Link>

                      <Link href="/closedRequests" passHref>
                        <button onClick={() => setActiveButton("closed-prs")} className="bg-transparent cursor-pointer border-2 border-white text-white font-semibold py-4 
                        px-8 rounded-full hover:bg-white hover:text-blue-900 transition-all duration-300">
                            ✅ View Closed PRs
                        </button>
                      </Link>
                    </div>
                    
                    
                    <div className="text-center">
                        <p className="text-blue-100 text-sm">
                            New to PR Status Board? 
                            <button className="text-white underline hover:text-blue-200 transition-colors font-medium m-1 cursor-pointer">
                                Create an account
                            </button>
                        </p>
                    </div>
                </div>                
            </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-[605px] lg:w-[1216px] mx-auto mt-16 sm:mt-8">

        <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-2xl p-8 border border-green-700 
          w-full sm:max-w-[605px] h-auto mx-auto">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-green-400 rounded-xl flex items-center justify-center">
              <svg
                className="w-7 h-7 text-green-900"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white">For Reviewers</h3>
          </div>
          <ul className="space-y-3 text-green-100">
            <li className="flex items-center space-x-3">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <span>See PRs waiting for your review at a glance</span>
            </li>
            <li className="flex items-center space-x-3">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <span>Color-coded age indicators (🟢 fresh, 🟡 aging, 🔴 stale)</span>
            </li>
            <li className="flex items-center space-x-3">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <span>Filter by "My Reviews" to focus on your queue</span>
            </li>
          </ul>
        </div>

        <div className="grid grid-cols-1 bg-gradient-to-br from-blue-900 to-purple-800 rounded-2xl p-8 border border-blue-700 
          w-full sm:max-w-[605px] h-auto mx-auto">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-blue-400 rounded-xl flex items-center justify-center">
              <svg
                className="w-7 h-7 text-blue-900"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white">For Authors</h3>
          </div>
          <ul className="space-y-3 text-blue-100">
            <li className="flex items-center space-x-3">
              <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
              <span>Track your PRs from draft to merge</span>
            </li>
            <li className="flex items-center space-x-3">
              <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
              <span>See review status: waiting, changes requested, approved</span>
            </li>
            <li className="flex items-center space-x-3">
              <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
              <span>Smart caching to avoid GitHub API rate limits</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
