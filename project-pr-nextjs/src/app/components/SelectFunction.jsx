"use client"


import React, { useState } from 'react'
// import '../App.css'
import Prompt from './Prompt.jsx' // Import the Prompt component
import PRs from './TeamInfo.jsx'

const SelectFunction = () => {
  const [userSelection, setUserSelection] = useState(''); // Declare a state variable...

  const handleClick = async (e) => {
    // Prevent the browser from reloading the page
    e.preventDefault()
    setUserSelection(e.target.name)
  }

  return (
    <div>
      <label>
            Select a function to demo:
      </label>
      <br />
      <div className='space-between'>
        <button type="submit" name="github" className="button bg-blue-800 rounded-xl px-4 py-2" onClick={handleClick}>Github API</button>
        <button type="submit" name="prompt" className="button bg-red-800 rounded-xl px-4 py-2" onClick={handleClick}>AI Prompt</button>
      </div>      

      {userSelection === 'github' && <PRs />}
      {userSelection === 'prompt' && <Prompt />}
      {userSelection === '' && <p>Please select a function demo.</p>}
      <hr />
    </div>
  )
}

export default SelectFunction