"use client";

import { useState } from "react";
import PullRequestCard, { PullRequest } from "../components/PullRequestCard";
import Filter from "../components/filter";

const mockPRs: PullRequest[] = [
  {
    id: 1234,
    title: "Add dark mode support to dashboard components",
    author: "sarah-dev",
    createdAt: "2 days ago",
    updatedAt: "today",
    age: "48h old",
    reviewers: [
      { name: "mike-reviewer", role: "reviewer" },
      { name: "alex-lead", role: "lead" },
    ],
    status: "Need Review",
  },
  {
    id: 1235,
    title: "Fix responsive layout issues on mobile devices",
    author: "mike-dev",
    createdAt: "today",
    updatedAt: "today",
    age: "5h old",
    reviewers: [{ name: "sarah-reviewer", role: "reviewer" }],
    status: "Draft",
  },
  {
    id: 1236,
    title: "Implement GitHub API integration for real-time PR data",
    author: "alex-dev",
    createdAt: "4 days ago",
    updatedAt: "2 days ago",
    age: "96h old",
    reviewers: [
      { name: "sarah-lead", role: "lead" },
      { name: "mike-reviewer", role: "reviewer" },
    ],
    status: "In Review",
  },
  {
    id: 1237,
    title: "Update documentation for new API endpoints",
    author: "jane-writer",
    createdAt: "yesterday",
    updatedAt: "today",
    age: "24h old",
    reviewers: [{ name: "alex-lead", role: "lead" }],
    status: "Need Review",
  },
];

export default function OpenPRsPage() {
  const [authorFilter, setAuthorFilter] = useState("All Authors");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [sortBy, setSortBy] = useState("Created");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPRs = mockPRs
    .filter((pr) => {
      const matchesAuthor =
        authorFilter === "All Authors" || pr.author === authorFilter;
      const matchesStatus =
        statusFilter === "All Status" || pr.status === statusFilter;
      const matchesSearch =
        searchTerm === "" ||
        pr.title.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesAuthor && matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "Created") return a.createdAt.localeCompare(b.createdAt);
      if (sortBy === "Updated") return a.updatedAt.localeCompare(b.updatedAt);
      if (sortBy === "Title") return a.title.localeCompare(b.title);
      return 0;
    });

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <Filter/>
      <h1 className="text-2xl font-bold mb-6 mt-5">Open Pull Requests</h1>

      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search open PRs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-gray-800 text-sm px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={authorFilter}
          onChange={(e) => setAuthorFilter(e.target.value)}
          className="bg-gray-800 text-sm px-3 py-2 rounded-md"
        >
          <option>All Authors</option>
          {[...new Set(mockPRs.map((pr) => pr.author))].map((author) => (
            <option key={author}>{author}</option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-gray-800 text-sm px-3 py-2 rounded-md"
        >
          <option>All Status</option>
          <option>Need Review</option>
          <option>In Review</option>
          <option>Draft</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-gray-800 text-sm px-3 py-2 rounded-md"
        >
          <option>Created</option>
          <option>Updated</option>
          <option>Title</option>
        </select>
      </div>

      <div className="space-y-4">
        {filteredPRs.map((pr) => (
          <PullRequestCard key={pr.id} pr={pr} />
        ))}
        {filteredPRs.length === 0 && (
          <p className="text-gray-500 text-sm">No PRs found.</p>
        )}
      </div>
    </main>
  );
}
