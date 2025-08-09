import { useState } from 'react'
import Prompt from './Prompt.jsx' // Import the Prompt component
import PRs from './PRs.jsx'

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
      <button type="submit" name="github" onClick={handleClick}>Github API</button>
      <button type="submit" name="prompt" onClick={handleClick}>AI Prompt</button>       

      {userSelection === 'github' && <PRs />}
      {userSelection === 'prompt' && <Prompt />}
      {userSelection === '' && <p>Please select a function demo.</p>}
      <hr />
    </div>
  )
}

export default SelectFunction
