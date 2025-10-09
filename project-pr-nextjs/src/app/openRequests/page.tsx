"use client";

import { useEffect, useMemo, useState } from "react";
import PullRequestCard, { PullRequest as CardPR } from "../components/PullRequestCard";
import Filter from "../components/filter";
import { getOpenPRs } from "@/lib/api";
import type { PullRequest, Reviewer, PRStatus } from "@shared/types";

/**
 * ---- Helper: format ISO timestamps into short display strings ---------------
 */
function isoToShort(iso: string): string {
  // e.g., "2025-10-06T14:12:00Z" -> "2025-10-06 14:12"
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}

/**
 * ---- Main Component ---------------------------------------------------------
 */
export default function OpenPRsPage() {
  // UI filters & state
  const [authorFilter, setAuthorFilter] = useState("All Authors");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [sortBy, setSortBy] = useState<"Created" | "Updated" | "Title">("Created");
  const [searchTerm, setSearchTerm] = useState("");

  // Loading & error handling
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Data
  const [prs, setPrs] = useState<CardPR[]>([]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setErrorMsg(null);

        // TODO: replace these with your selected owner/repo values if needed
        const owner = "chingu-voyages";
        const repo = "V57-tier3-team-38";

        const apiData: PullRequest[] = await getOpenPRs(owner, repo);

        // Map API -> PullRequestCard shape (CardPR)
        const mapped: CardPR[] = apiData.map((p) => ({
          id: p.id,
          title: p.title,
          author: p.user?.login ?? "unknown",
          createdAt: isoToShort(p.created_at),
          updatedAt: isoToShort(p.updated_at),
          closedOn: p.state === "closed" ? isoToShort(p.updated_at) : "",
          age: "", // optional: can compute age later
          reviewers: [] as Reviewer[], // backend placeholder
          status: p.draft
            ? "Draft"
            : p.state === "open"
            ? "Need Review"
            : "Closed", // simplified logic for now
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

  /**
   * ---- Derived filters & sorting --------------------------------------------
   */
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

  /**
   * ---- Render ---------------------------------------------------------------
   */
  return (
    <main className="min-h-screen text-white">
      <Filter />

      <div className="px-10 mt-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center mb-8 space-y-4 lg:space-y-0 justify-between max-w-[1216px] m-auto">
          <h1 className="text-3xl font-bold mb-6 mt-5">Open Pull Requests</h1>

          <div className="flex flex-row flex-wrap gap-3">
            {/* Search box */}
            <input
              type="text"
              placeholder="Search Open PRs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[200px] sm:w-[220px] bg-[#161b22] border border-[#30363D] rounded-lg pl-4 pr-4 py-1.5 text-sm 
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Author filter */}
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

            {/* Status filter */}
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

            {/* Sorting */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "Created" | "Updated" | "Title")}
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
