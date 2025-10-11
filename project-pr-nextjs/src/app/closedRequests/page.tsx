"use client";

import { useState, useEffect, useMemo } from 'react';
// import PullRequestCard, { PullRequest } from "../components/PullRequestCard";
// import { Octokit } from "octokit";
import Filter from '../components/filter';

const cn = (...classes) => classes.filter(Boolean).join(' ');

type Reviewer = {
  name: string;
  role: string;
}

type PullRequest = {
  id: number;
  title: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  closedOn: string;
  age: string; // e.g., "168h old" (time PR was open)
  reviewers: Reviewer[];
  status: "Closed" | "Merged"; // Only closed/merged for this view
  url: string;
  rawClosedAt: string; // Crucial for accurate date sorting in main file
}

// Placeholder for the external Filter component (changed to arrow function)
const Filter = () => {
    return (
        // Render a simple div placeholder for the filter component
        <div className="bg-[#161B22] border-b border-[#30363D] py-3 px-10">
            {/* The actual Filter component content is external */}
        </div>
    );
}
const PullRequestCard = ({ pr }: { pr: PullRequest }) => {
  const ageInHours = parseInt(pr.age.replace('h old', ''), 10);

  // Determine the left border color based on age (time PR was open before closure)
  const ageClass =
    ageInHours > 72 // More than 3 days (72h) is critical
      ? "border-l-red-400"
      : ageInHours >= 24
      ? "border-l-yellow-400" // More than 1 day (24h) is a concern
      : "border-l-green-400"; // Less than a day is good
      
  return (
    <div 
      className={cn(
        // "bg-[#161b22] mx-auto sm:mx-16 border border-[#30363D] rounded-lg p-4 hover:bg-[#30363D]/80 transition",
        // "w-full max-w-4xl h-auto",
               "bg-[#161b22] mx-auto sm:mx-16 border border-[#30363D] rounded-lg p-4 hover:bg-[#30363D]/80 transition  h-[180px] sm:w-auto sm:h-auto",
        `${ageClass}`
      )}
    >
      <a href={pr.url} target="_blank" rel="noopener noreferrer" className="block">
        <div className="flex justify-between items-start mb-2">
          <h2 className="font-semibold text-lg text-white hover:text-blue-200 transition">
            <span className="font-bold">#{pr.id}</span> {pr.title}
          </h2>
          <span
            className={cn(
              // "px-2 py-1 text-xs rounded-md font-bold h-auto w-auto min-w-[70px] text-center whitespace-nowrap",
              "px-3 py-2 text-xs rounded-md font-bold h-auto w-auto",

              pr.status === "Closed" && "bg-red-600 text-white",
              pr.status === "Merged" && "bg-purple-600 text-white"
            )}
          >
            {pr.status}
          </span>
        </div>

        <p className="text-sm text-gray-400">
          by <span className="font-medium text-white">{pr.author}</span> • created{" "}
          {pr.createdAt} • **closed {pr.closedOn}** • open time:{" "}
          <span
            className={cn(
              ageInHours > 72
                ? "text-red-400"
                : ageInHours >= 24
                ? "text-yellow-400"
                : "text-green-400"
            )}
          >
            {pr.age}
          </span>
        </p>
      </a>

      <div className="flex gap-2 mt-3 flex-wrap items-center">
        <span className="text-xs text-gray-400 font-medium">Reviewers:</span>
        {pr.reviewers.length > 0 ? (
          pr.reviewers.map((rev) => (
            <span
              key={rev.name}
              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs 
              font-medium max-w-full border border-blue-700 text-blue-200 bg-blue-900"
            >
              {rev.name}
            </span>
          ))
        ) : (
          <span className="text-xs text-gray-500 italic">None assigned/found</span>
        )}
      </div>
    </div>
  );
}


export default function ClosedRequests() {
    const [prs, setPRs] = useState<PullRequest[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [authorFilter, setAuthorFilter] = useState("All Authors");
    const [typeFilter, setTypeFilter] = useState("All Types"); 
    
    // Changing default sort to reflect the closed view
    const [sortBy, setSortBy] = useState("Closed Date"); 
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchPRs = async () => {
            const owner = process.env.NEXT_PUBLIC_GITHUB_ORG;
            const repo = process.env.NEXT_PUBLIC_GITHUB_REPO_NAME;
            const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
            
            const headers = {
                "Authorization": `token ${token}`,
                "X-GitHub-Api-Version": "2022-11-28"
            };

            try {
                // 1. Fetch closed PRs using native fetch
                const prsUrl = `https://api.github.com/repos/${owner}/${repo}/pulls?state=closed&per_page=100`;
                const prsResponse = await fetch(prsUrl, { headers });
                const prsData = await prsResponse.json();

                if (!prsResponse.ok) {
                    console.error("GitHub PR Fetch failed:", prsData.message || prsResponse.statusText);
                    setLoading(false);
                    return;
                }

                const formatted: PullRequest[] = await Promise.all(
                    prsData.map(async (pr: any) => {
                        // 1. Determine Status: Merged or Closed (unmerged)
                        const isMerged = pr.merged_at !== null;
                        const status = isMerged ? "Merged" : "Closed";

                        // 2. Calculate Dates and Age (Time PR was Open)
                        const createdDate = new Date(pr.created_at);
                        const closedDate = new Date(pr.closed_at);
                        const closedOnString = closedDate.toLocaleDateString();

                        // Calculate age in hours (Time PR was open)
                        const hoursOpen = Math.floor(
                            (closedDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60)
                        );
                        const ageString = `${hoursOpen}h old`;

                        // 3. Fetch Reviews using native fetch
                        // GitHub provides the reviews_url in the PR object
                        const reviewsUrl = pr.url + '/reviews'; 
                        const reviewsResponse = await fetch(reviewsUrl, { headers });
                        const reviews = await reviewsResponse.json();

                        if (!reviewsResponse.ok && reviewsResponse.status !== 404) {
                            console.warn(`Could not fetch reviews for PR #${pr.number}: ${reviews.message}`);
                        }

                        const allReviewerLogins = new Set<string>();

                        // Add requested reviewers 
                        (pr.requested_reviewers || []).forEach((r: any) => 
                            allReviewerLogins.add(r.login)
                        );

                        // Add submitted reviewers
                        (reviews || []).forEach((r: any) => { // Ensure reviews is an array before iterating
                            if (r.user?.login) {
                                allReviewerLogins.add(r.user.login);
                            }
                        });
                        
                        // Map the unique logins to the Reviewer interface
                        const prReviewers = Array.from(allReviewerLogins).map(
                            (login) => ({
                                name: login,
                                role: "Reviewer", 
                            })
                        );

                        // 4. Return the fully formatted PullRequest object
                        return {
                            id: pr.number,
                            title: pr.title,
                            author: pr.user.login,
                            createdAt: new Date(pr.created_at).toLocaleDateString(),
                            updatedAt: new Date(pr.updated_at).toLocaleDateString(),
                            closedOn: closedOnString, 
                            age: ageString,          
                            url: pr.html_url,
                            reviewers: prReviewers,
                            status: status as PullRequest["status"], 
                            rawClosedAt: pr.closed_at, // Use for sorting
                        };
                    })
                );

                setPRs(formatted);
            }
            catch (err) {
                console.error("General Error in fetchPRs:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPRs();
    }, []);


    const filteredPRs = useMemo(() => {
        return prs
            .filter((pr) => {
                const matchesAuthor =
                    authorFilter === "All Authors" || pr.author === authorFilter;
                // Filtering based on the user's defined typeFilter state against the pr.status value
                const matchesStatus =
                    typeFilter === "All Types" || pr.status === typeFilter; 
                const matchesSearch =
                    searchTerm === "" ||
                    pr.title.toLowerCase().includes(searchTerm.toLowerCase());
                return matchesAuthor && matchesStatus && matchesSearch;
            })
            .sort((a, b) => {
                if (sortBy === "Closed Date") {
                    // Sorting by the raw timestamp (descending: newest first)
                    return new Date(b.rawClosedAt).getTime() - new Date(a.rawClosedAt).getTime();
                }
                // Use default sorting for Updated and Title if needed
                if (sortBy === "Updated") return a.updatedAt.localeCompare(b.updatedAt);
                if (sortBy === "Title") return a.title.localeCompare(b.title);
                return 0;
            });
    }, [prs, authorFilter, typeFilter, searchTerm, sortBy]);


  return (
    <main className="text-white bg-[#161B22] min-h-screen font-['Inter']">
      <Filter/>

      {loading ? (
        <div className="p-10 mt-10">
             <p className="text-xl animate-pulse">
                <span className="text-white mr-2">
                    <svg className="animate-spin inline -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </span>
                Fetching closed pull requests...
            </p>
        </div>
        ) : (
        <div className="px-4 md:px-10 mt-10 max-w-6xl mx-auto">

        <div className="flex flex-col lg:flex-row items-start lg:items-center mb-8 space-y-4 lg:space-y-0 justify-between max-w-[1216px] m-auto">
                <h1 className="text-3xl font-bold mb-6 mt-5">Closed Pull Requests</h1>

                <div className="flex flex-row flex-wrap gap-3">
                    <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search Closed PRs..."
                    className="w-[200px] sm:w-[220px] bg-[#161b22] border border-[#30363D] rounded-lg pl-4 pr-4 py-1.5 text-sm 
                        focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <select 
                    value={authorFilter}
                    onChange={(e) => setAuthorFilter(e.target.value)}
              className="font-bold w-[120px] sm:w-[140px] text-sm h-[38px] bg-[#161b22] border border-[#30363D] rounded-lg"
                    >          
                        <option className="bg-[#161b22]">All Authors</option>
                        {[...new Set(prs.map((pr) => pr.author))].sort().map((author) => (
                            <option key={author} className="bg-[#161b22]">{author}</option>
                        ))}
                    </select>

                    <select
                    value={typeFilter} 
                    onChange={(e) => setTypeFilter(e.target.value)}
              className="font-bold w-[140px] sm:w-[160px] text-sm h-[38px] bg-[#161b22] border border-[#30363D] rounded-lg"
                    >
                        <option className="bg-[#161b22]">All Types</option>
                        <option className="bg-[#161b22]">Merged</option>
                        <option className="bg-[#161b22]">Closed</option>
                    </select>

                    <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)} 
              className="font-bold w-[140px] sm:w-[160px] text-sm h-[38px] bg-[#161b22] border border-[#30363D] rounded-lg"
                    >
                        <option className="bg-[#161b22]">Closed Date</option>
                        <option className="bg-[#161b22]">Updated</option>
                        <option className="bg-[#161b22]">Title</option>
                    </select>
                </div>
            </div>

            <div className="space-y-4">
  {filteredPRs.map((pr) => (
    <PullRequestCard key={pr.id} pr={pr} />
  ))}
  {filteredPRs.length === 0 && (
    <p className="text-gray-500 text-sm border border-[#30363D] rounded-lg mt-4 p-4">
      No closed pull requests match your current filter criteria.
    </p>
  )}
</div>
        </div>
        )}
    </main>
  );
}