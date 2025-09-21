"use client";

import { useState } from 'react'
import PullRequestCard, { PullRequest } from '../components/PullRequestCard'
import Filter from '../components/filter'

const mockPRs: PullRequest[] = [
  {
    id: 1230,
    title: "Update dependencies to latest version",
    author: "sarah-dev",
    createdAt: "9/10/2025",
    updatedAt: "",
    closedOn: "3 days ago",
    age: "168h old",
    reviewers: [
      { name: "mike-reviewer", role: "reviewer" },
      { name: "alex-lead", role: "lead" },
    ],
    status: "Merged",
  },
  {
    id: 1231,
    title: "Add unit tests for authentication model",
    author: "mike-dev",
    createdAt: "9/7/2025",
    updatedAt: "",
    closedOn: "closed 5 days ago",
    age: "240h old",
    reviewers: [{ name: "sarah-reviewer", role: "reviewer" }],
    status: "Closed",
  },
  {
    id: 1232,
    title: "Refactor User Authentication Flow",
    author: "alex-dev",
    createdAt: "8/3/2025",
    updatedAt: "",
    closedOn: "08/8/2025",
    age: "1080h old",
    reviewers: [
      { name: "sarah-lead", role: "lead" },
      { name: "mike-reviewer", role: "reviewer" },
    ],
    status: "Merged",
  },
];

export default function ClosedRequests() {

    const [authorFilter, setAuthorFilter] = useState("All Authors");
    const [typeFilter, setTypeFilter] = useState("All Types"); //fixed typo from All Status to All Types which resolved error
    const [sortBy, setSortBy] = useState("Created");
    const [searchTerm, setSearchTerm] = useState("");
  
    const filteredPRs = mockPRs
      .filter((pr) => {
        const matchesAuthor =
          authorFilter === "All Authors" || pr.author === authorFilter;
        const matchesType =
          typeFilter === "All Types" || pr.status === typeFilter;
        const matchesSearch =
          searchTerm === "" ||
          pr.title.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesAuthor && matchesType && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "Created") return a.createdAt.localeCompare(b.createdAt);
        if (sortBy === "Updated") return a.updatedAt.localeCompare(b.updatedAt);
        if (sortBy === "Title") return a.title.localeCompare(b.title);
        return 0;
      });

  return (
    <main className="h-screen">
      <Filter/>

      <div className="px-10 mt-10">

        <div className="flex flex-col lg:flex-row items-start lg:items-center mb-8 space-y-4 lg:space-y-0 justify-between">
          <h1 className="font-bold text-3xl">Closed Pull Requests</h1>

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Closed PRs..."
              className="w-full max-w-[256px] bg-[#161b22] border border-[#30363D] 
              rounded-lg pl-4 pr-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <select 
            value={authorFilter}
            onChange={(e) => setAuthorFilter(e.target.value)}
            className="ml-6 font-bold w-[106px] text-sm h-[38px] bg-[#161b22] border border-[#30363D] rounded-lg"            
            >            
              <option>All Authors</option>
              {[...new Set(mockPRs.map((pr) => pr.author))].map((author) => (
            <option key={author}>{author}</option>
          ))}
            </select>

            <select
            value={typeFilter} 
            onChange={(e) => setTypeFilter(e.target.value)}
            className="ml-6 font-bold w-[159px] text-sm h-[38px] bg-[#161b22] border border-[#30363D] rounded-lg">
              <option>All Types</option>
              <option>Merged</option>
              <option>Closed</option>
            </select>

            <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)} 
            className="ml-6 font-bold w-[166px] text-sm h-[38px] bg-[#161b22] border border-[#30363D] rounded-lg">
              <option>Sort by Closed Date</option>
              <option>Updated</option>
              <option>Title</option>
            </select>
          </div>
        </div>

        <div className='space-y-4'>
          {filteredPRs.map((pr) => (
            <PullRequestCard key={pr.id} pr={pr} />
          ))}
          {filteredPRs.length === 0 && (
            <p className="text-gray-500 text-sm">No PRs found.</p>
          )}
        </div>
      </div>
    </main>
  );
}
