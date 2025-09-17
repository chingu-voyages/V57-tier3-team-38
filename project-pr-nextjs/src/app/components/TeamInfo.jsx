"use client"


import React, { useState } from 'react'
import { Octokit } from 'octokit'
// import '../App.css'

const TeamInfo = () => {
  const [branches, setBranches] = useState('')
  const [prs, setPRs] = useState('')
  const [repo, setRepo] = useState('')
  const [team, setTeam] = useState('')

  // Function to pretty-print JSON with colors and indentation
  const syntaxHighlight =(json) => {
    json = JSON.stringify(json, undefined, 4)
    json = json.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>')
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?)|(\b(true|false|null)\b)|(\b-?\d+(\.\d*)?([eE][+-]?\d+)?\b)/g, function (match) {
        var cls = 'number'
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string'
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean'
        } else if (/null/.test(match)) {
            cls = 'null'
        }
        return '<span class="' + cls + '">' + match + '</span>'
    })
  }

  const handleClick = async (e) => {
    // Prevent the browser from reloading the page
    e.preventDefault()

    // Retrieve team information
    const teamData = await getTeam()
    const teamInfo = (
        <div className="border">
          {/* <p className="code-text justify-left">{syntaxHighlight(teamData)}</p>  */}
          <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-x-auto text-sm">
            {JSON.stringify(teamData, null, 2)}
          </pre>
        </div>
    )
    setTeam(teamInfo)

    // Retrieve repo information
    // const repoData = await getTeamRepo()
    // const repoInfo = (
    //     <div className="border">
    //       <p className="code-text justify-left">{syntaxHighlight(repoData)}</p> 
    //     </div>
    // )
    // setRepo(repoInfo)
    const repoData = await getTeamRepo()
    const repoInfo = (
      <pre className="bg-gray-900 p-4 rounded overflow-x-auto text-sm">
        <div
          className="code-text justify-left"
          dangerouslySetInnerHTML={{ __html: syntaxHighlight(repoData.data) }}
        />
      </pre>
    )
    setRepo(repoInfo)


    // Retrieve branch information
    // const branchData = await getRepoBranches()
    // let itemNo = 0
    // const branchItems = branchData.data.map((entry) => {
    //   itemNo++
    //   return (
    //     <div className="border" key={itemNo}>
    //       <p className="code-text justify-left">{syntaxHighlight(entry)}</p> 
    //     </div>
    //   )
    // })
    // setBranches(branchItems)

    // // Retrieve PR information
    // const prData = await getPullRequests()
    // itemNo = 0
    // const prItems = prData.data.map((entry) => {
    //   itemNo++
    //   return (
    //     <div className="border" key={itemNo}>
    //       <p className="code-text justify-left">{syntaxHighlight(entry)}</p> 
    //     </div>
    //   )
    // })
    // setPRs(prItems)
    // Retrieve branch information
    const branchData = await getRepoBranches()
    let itemNo = 0
    const branchItems = branchData.data.map((entry) => {
      itemNo++
      return (
        <pre className="bg-gray-900 p-4 rounded overflow-x-auto text-sm border" key={itemNo}>
          <div
            className="code-text justify-left"
            dangerouslySetInnerHTML={{ __html: syntaxHighlight(entry) }}
          />
        </pre>
      )
    })
    setBranches(branchItems)

    // Retrieve PR information
    const prData = await getPullRequests()
    itemNo = 0
    const prItems = prData.data.map((entry) => {
      itemNo++
      return (
        <pre className="bg-gray-900 p-4 rounded overflow-x-auto text-sm border" key={itemNo}>
          <div
            className="code-text justify-left"
            dangerouslySetInnerHTML={{ __html: syntaxHighlight(entry) }}
          />
        </pre>
      )
    })
    setPRs(prItems)
  }




  
  const getRepoBranches = async () => {
    const octokit = new Octokit({
      auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN
    })
    
    const repoBranches = await octokit.request('GET /repos/{owner}/{repo}/branches', {
      owner: process.env.NEXT_PUBLIC_GITHUB_ORG,
      repo: process.env.NEXT_PUBLIC_GITHUB_REPO_NAME,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })
    return repoBranches
  }

  // Retrieve the Pull Requests for a given repo
  const getPullRequests = async () => {
    const octokit = new Octokit({
      auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN
    })
    
    const pullRequests = await octokit.request('GET /repos/{owner}/{repo}/pulls', {
      owner: process.env.NEXT_PUBLIC_GITHUB_ORG,
      repo: process.env.NEXT_PUBLIC_GITHUB_REPO_NAME,
      state: 'all',
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })
    return pullRequests
  }

  // Get the team information
  const getTeam = async () => {
    const octokit = new Octokit({
      auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN
    })

    const teamInfo = await octokit.request('GET /orgs/{org}/teams/{team_slug}', {
      org: process.env.NEXT_PUBLIC_GITHUB_ORG,
      team_slug: process.env.NEXT_PUBLIC_GITHUB_REPO_NAME,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })
    return teamInfo
  }

  // Get the team repository information
  const getTeamRepo = async () => {
    const octokit = new Octokit({
      auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN
    })
    
    const teamRepos = await octokit.request('GET /orgs/{org}/teams/{team_slug}/repos', {
      org: process.env.NEXT_PUBLIC_GITHUB_ORG,
      team_slug: process.env.NEXT_PUBLIC_GITHUB_REPO_NAME,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })

    return teamRepos
  }

  return (
    <div>
      <button className="button bg-green-800 rounded-xl px-4 py-2" onClick={handleClick}>Click to get PR information</button>
      <h2>Team Info</h2>
      {team}
      <h2>Repo Info</h2>
      {repo}
      <h2>Repo Branches</h2>
      {branches}
      <h2>Pull Requests</h2>
      {prs}
    </div>
  )
}

export default TeamInfo