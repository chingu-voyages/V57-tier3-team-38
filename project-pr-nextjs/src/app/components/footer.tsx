"use client";

import React from 'react'

export default function Footer() {
  return (
    <footer className="h-[160px] bg-[#161B22] mt-16 border-t border-[#30363D] flex items-center justify-center">
      <div className="flex flex-col space-y-6 w-full max-w-6xl px-6 ">
                
                <div className="text-center">
                    <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
                        Streamlining code review workflows with intelligent PR tracking and real-time collaboration insights
                    </p>
                </div>                
                
                
                <div className="flex flex-col md:flex-row justify-between w-full items-center space-y-4 md:space-y-0">
                    <div className="flex items-center space-x-2">
                        <a href="https://github.com/chingu-voyages/V57-tier3-team-37" className="text-blue-500 hover:text-blue-400 transition-colors flex items-center space-x-2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"></path>
                            </svg>
                            <span className='mr-auto'>View on GitHub</span>
                        </a>
                    </div>
                    <div className="text-gray-400 text-sm text-center md:text-right">
                        Built by <span className="text-white">Trevor Topolski</span>, <span className="text-white">Spandan Mahat</span>, <span className="text-white">Claire ...</span>
                    </div>
                </div>
            </div>
    </footer>
  )
}
