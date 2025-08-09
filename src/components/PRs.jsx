import { Octokit } from 'octokit'
import { useState } from 'react'

const PRs = () => {
  const [prs, setPRs] = useState(''); // Declare a state variable...

  const handleClick = async (e) => {
    // Prevent the browser from reloading the page
    e.preventDefault()
    const prData = await getPullRequests()
    setPRs(JSON.stringify(prData))
  }

  const getRepoBranches = async () => {
    const octokit = new Octokit({
      auth: import.meta.env.VITE_GITHUB_TOKEN
    })
    
    const repoBranches = await octokit.request('GET /repos/{owner}/{repo}/branches', {
      owner: import.meta.env.VITE_GITHUB_ORG,
      repo: import.meta.env.VITE_GITHUB_REPO_NAME,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })
    return repoBranches
  }

  const getBranchCommits = async (sha) => {
    const octokit = new Octokit({
      auth: import.meta.env.VITE_GITHUB_TOKEN
    })
    
    const branchCommits = await octokit.request('GET /repos/{owner}/{repo}/commits', {
      owner: import.meta.env.VITE_GITHUB_ORG,
      repo: import.meta.env.VITE_GITHUB_REPO_NAME,
      sha: sha,
      per_page: 100,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })
    return branchCommits
  }

  // Retrieve the Pull Requests for a given repo
  const getPullRequests = async () => {
    const octokit = new Octokit({
      auth: import.meta.env.VITE_GITHUB_TOKEN
    })
    
    const pullRequests = await octokit.request('GET /repos/{owner}/{repo}/pulls', {
      owner: import.meta.env.VITE_GITHUB_ORG,
      repo: import.meta.env.VITE_GITHUB_REPO_NAME,
      state: 'all',
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })
    return pullRequests
  }

  const getTeamRepos = async () => {
    const octokit = new Octokit({
      auth: import.meta.env.VITE_GITHUB_TOKEN
    })
    
    const teamRepos = await octokit.request('GET /orgs/{org}/teams/{team_slug}/repos', {
      org: import.meta.env.VITE_GITHUB_ORG,
      team_slug: import.meta.env.VITE_GITHUB_REPO_NAME,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })

    return teamRepos
  }

  return (
    <div>
      <h1 onClick={handleClick}>Click to get PR information</h1>
      <p>{prs}</p>
      <hr />
    </div>
  )
}

export default PRs
