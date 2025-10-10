import React from 'react'
import { useState } from 'react'
import SelectFunction from './SelectFunction';

export default function chatBot() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    }

  return (
    <div className='absolute items-center justify-center top-auto bottom-auto'>
      <div className="flex items-center justify-center space-x-4">
            <button onClick={toggleDropdown}
            className={`flex justify-center items-center bg-gradient-to-b from-purple-400 to bg-purple-900 hover:bg-purple-400 border border-purple-700 
            rounded-full p-3 font-bold text-sm cursor-pointer transition duration-300 ease-in-out hover:-translate-y-2`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                </svg>

            </button>
            <div className={`${isOpen ? '' : 'hidden'}`}>
                <SelectFunction/>
            </div>
        </div>
    </div>
  )
}
