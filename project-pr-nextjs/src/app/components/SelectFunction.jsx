"use client"

import React, { useState } from 'react'
import Prompt from './Prompt.jsx' // Import the Prompt component
import PRs from './TeamInfo.jsx'

const SelectFunction = () => {
  const [userSelection, setUserSelection] = useState(''); // Declare a state variable...

  const handleClick = (e) => {
    e.preventDefault();
    const selectedFunction = e.target.name;
    setUserSelection((prevSelection) => (prevSelection === selectedFunction ? '' : selectedFunction));
  };

  return (
    <div className=' bg-slate-950 w-auto h-auto '>
      <label>
        Select a function to demo:
      </label>
      <br />
      <div className="space-between space-x-4">
        <button
          type="submit"
          name="github"
          className={`button rounded-xl px-4 py-2 cursor-pointer ${
            userSelection === 'github' ? 'bg-blue-600 text-white' : 'bg-blue-800 text-gray-300'
          }`}
          onClick={handleClick}
        >
          Github API
        </button>

        <button
          type="submit"
          name="prompt"
          className={`button rounded-xl px-4 py-2 cursor-pointer ${
            userSelection === 'prompt' ? 'bg-red-600 text-white' : 'bg-red-800 text-gray-300'
          }`}
          onClick={handleClick}
        >
          AI Prompt
        </button>
      </div>

      {userSelection === 'github' && <PRs />}
      {userSelection === 'prompt' && <Prompt />}
      {userSelection === '' && <p>Please select a function demo.</p>}
      <hr />
    </div>
  );
};

export default SelectFunction;