"use client";

import { useEffect, useMemo, useState } from "react";
import PullRequestCard, { PullRequest as CardPR } from "../components/PullRequestCard";
import Filter from "../components/filter";

/**
 * ---- OLD MOCK DATA (kept for reference) -------------------------------------
 */
// const mockPRs: CardPR[] = [
//   {
//     id: 1234,
//     title: "Add dark mode support to dashboard components",
//     author: "sarah-dev",
//     createdAt: "2 days ago",
//     updatedAt: "today",
//     closedOn: "",
//     age: "48h old",
//     reviewers: [
//       { name: "mike-reviewer", role: "reviewer" },
//       { name: "alex-lead", role: "lead" },
//     ],
//     status: "Need Review",
//   },
//   {
//     id: 1235,
//     title: "Fix responsive layout issues on mobile devices",
//     author: "mike-dev",
//     createdAt: "today",
//     updatedAt: "today",
//     closedOn: "",
//     age: "5h old",
//     reviewers: [{ name: "sarah-reviewer", role: "reviewer" }],
//     status: "Draft",
//   },
//   {
//     id: 1236,
//     title: "Implement GitHub API integration for real-time PR data",
//     author: "alex-dev",
//     createdAt: "4 days ago",
//     updatedAt: "2 days ago",
//     closedOn: "",
//     age: "96h old",
//     reviewers: [
//       { name: "sarah-lead", role: "lead" },
//       { name: "mike-reviewer", role: "reviewer" },
//     ],
//     status: "In Review",
//   },
//   {
//     id: 1237,
//     title: "Update documentation for new API endpoints",
//     author: "jane-writer",
//     createdAt: "yesterday",
//     updatedAt: "today",
//     closedOn: "",
//     age: "24h old",
//     reviewers: [{ name: "alex-lead", role: "lead" }],
//     status: "Need Review",
//   },
// ];

/**
 * ---- API Types (from server) ------------------------------------------------
 * If you already set up /shared/types.ts, you can import from "@shared/types" instead.
 */
type PRStatus = "Need Review" | "In Review" | "Draft" | "Closed" | "Merged";
interface Reviewer { name: string; role: string }
interface ApiPullRequest {
  id: number;
  title: string;
  author: string;
  createdAt: string;    // ISO
  updatedAt: string;    // ISO
  closedOn: string;     // ISO or ""
  ageHours: number;     // numeric from backend
  reviewers: Reviewer[];
  status: PRStatus;
}

/**
 * ---- Minimal API helper using fetch ----------------------------------------
 */
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function getOpenPRs(): Promise<ApiPullRequest[]> {
  const res = await fetch(`${API_BASE}/api/pullrequests?state=open`, { cache: "no-store" });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status} ${res.statusText} ${text}`);
  }
  return res.json();
}

/**
 * ---- Small helpers to format times for display ------------------------------
 */
function isoToShort(iso: string): string {
  // e.g., "2025-10-06T14:12:00Z" -> "2025-10-06 14:12"
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  // Keep it simple (avoid locale surprises): YYYY-MM-DD HH:MM
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}

export default function OpenPRsPage() {
  // UI state
  const [authorFilter, setAuthorFilter] = useState("All Authors");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [sortBy, setSortBy] = useState<"Created" | "Updated" | "Title">("Created");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Data state (mapped to the Card's expected shape)
  const [prs, setPrs] = useState<CardPR[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setErrorMsg(null);

        const apiData = await getOpenPRs();

        // Map API shape -> PullRequestCard shape (expects `age` string, created/updated as strings)
        const mapped: CardPR[] = apiData.map((p) => ({
          id: p.id,
          title: p.title,
          author: p.author,
          createdAt: isoToShort(p.createdAt),
          updatedAt: isoToShort(p.updatedAt),
          closedOn: p.closedOn ? isoToShort(p.closedOn) : "",
          age: `${p.ageHours}h old`,
          reviewers: p.reviewers,
          status: p.status,
        }));

        if (mounted) setPrs(mapped);
      } catch (e: any) {
        if (mounted) setErrorMsg(e?.message || "Failed to load PRs");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const authors = useMemo(() => {
    const set = new Set<string>();
    prs.forEach((p) => set.add(p.author));
    return Array.from(set);
  }, [prs]);

  const filteredPRs = useMemo(() => {
    const list = prs.filter((pr) => {
      const matchesAuthor = authorFilter === "All Authors" || pr.author === authorFilter;
      const matchesStatus = statusFilter === "All Status" || pr.status === statusFilter;
      const matchesSearch =
        searchTerm === "" || pr.title.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesAuthor && matchesStatus && matchesSearch;
    });

    const sorted = [...list].sort((a, b) => {
      if (sortBy === "Created") return a.createdAt.localeCompare(b.createdAt);
      if (sortBy === "Updated") return a.updatedAt.localeCompare(b.updatedAt);
      if (sortBy === "Title") return a.title.localeCompare(b.title);
      return 0;
    });

    return sorted;
  }, [prs, authorFilter, statusFilter, searchTerm, sortBy]);

  return (
    <main className="min-h-screen text-white">
      <Filter />

      <div className="px-10 mt-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center mb-8 space-y-4 lg:space-y-0 justify-between max-w-[1216px] m-auto">
          <h1 className="text-3xl font-bold mb-6 mt-5">Open Pull Requests</h1>

          <div className="flex flex-row flex-wrap gap-3">
            <input
              type="text"
              placeholder="Search Open PRs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[200px] sm:w-[220px] bg-[#161b22] border border-[#30363D] rounded-lg pl-4 pr-4 py-1.5 text-sm 
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <select
              value={authorFilter}
              onChange={(e) => setAuthorFilter(e.target.value)}
              className="font-bold w-[120px] sm:w-[140px] text-sm h-[38px] bg-[#161b22] border border-[#30363D] rounded-lg"
            >
              <option>All Authors</option>
              {authors.map((author) => (
                <option key={author}>{author}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="font-bold w-[140px] sm:w-[160px] text-sm h-[38px] bg-[#161b22] border border-[#30363D] rounded-lg"
            >
              <option>All Status</option>
              <option>Need Review</option>
              <option>In Review</option>
              <option>Draft</option>
              <option>Closed</option>
              <option>Merged</option>
            </select>

            {/* FIX: give options explicit values so sorting works */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="font-bold w-[140px] sm:w-[160px] text-sm h-[38px] bg-[#161b22] border border-[#30363D] rounded-lg"
            >
              <option value="Created">Created</option>
              <option value="Updated">Updated</option>
              <option value="Title">Title</option>
            </select>
          </div>
        </div>

        {/* Status messages */}
        {loading && <p className="text-gray-400 text-sm">Loading pull requests…</p>}
        {!loading && errorMsg && <p className="text-red-400 text-sm">Error: {errorMsg}</p>}

        {/* Cards */}
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredPRs.map((pr) => (
            <PullRequestCard key={pr.id} pr={pr} />
          ))}
        </div>

        {!loading && !errorMsg && filteredPRs.length === 0 && (
          <p className="text-gray-500 text-sm mt-6">No PRs found.</p>
        )}
      </div>
    </main>
  );
}
