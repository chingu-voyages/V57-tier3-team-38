"use client";

import { useEffect, useMemo, useState } from "react";
import { Octokit } from "octokit";
import Filter from "../components/filter";
import PullRequestCard from "../components/PullRequestCardClosedPageTemp";
import type { ClosedPullRequest } from "@/types/pr";

export default function ClosedRequestsPage() {
  const [prs, setPRs] = useState<ClosedPullRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // client-side filters
  const [authorFilter, setAuthorFilter] = useState("All Authors");
  const [typeFilter, setTypeFilter] = useState<"All Types" | "Closed" | "Merged">("All Types");
  const [sortBy, setSortBy] = useState<"Created" | "Updated" | "Title" | "Closed">("Closed");
  const [searchTerm, setSearchTerm] = useState("");

  // fetch closed PRs
  useEffect(() => {
    const run = async () => {
      try {
        const octokit = new Octokit({ auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN });
        const owner = process.env.NEXT_PUBLIC_GITHUB_ORG as string;
        const repo  = process.env.NEXT_PUBLIC_GITHUB_REPO_NAME as string;

        // You can add pagination if needed; this grabs the first page (default per_page=30)
        const { data } = await octokit.request("GET /repos/{owner}/{repo}/pulls", {
          owner,
          repo,
          state: "closed",
          headers: { "X-GitHub-Api-Version": "2022-11-28" },
        });

        // Map API -> ClosedPullRequest
        const mapped: ClosedPullRequest[] = data.map((pr: any) => {
          const closedAt = pr.closed_at ?? pr.merged_at ?? pr.updated_at ?? pr.created_at;
          const status: "Closed" | "Merged" = pr.merged_at ? "Merged" : "Closed";

          // reviewers: simple best-effort from requested_reviewers + user who opened PR
          const reviewers =
            (pr.requested_reviewers ?? []).map((r: any) => ({ name: r.login as string, role: "reviewer" })) ||
            [];

          // age in hours since closed (string to match the card)
          const hoursSinceClosed = Math.floor(
            (Date.now() - new Date(closedAt).getTime()) / (1000 * 60 * 60)
          ).toString();

          return {
            id: pr.number,
            title: pr.title,
            author: pr.user?.login ?? "unknown",
            createdAt: new Date(pr.created_at).toLocaleDateString(),
            updatedAt: new Date(pr.updated_at).toLocaleDateString(),
            closedOn: new Date(closedAt).toLocaleDateString(),
            age: hoursSinceClosed, // card expects a string like "168"
            reviewers,
            status,
          };
        });

        setPRs(mapped);
      } catch (e) {
        console.error("Error fetching closed PRs:", e);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  // filter + sort
  const filtered = useMemo(() => {
    return prs
      .filter((pr) => {
        const byAuthor = authorFilter === "All Authors" || pr.author === authorFilter;
        const byType = typeFilter === "All Types" || pr.status === typeFilter;
        const bySearch =
          !searchTerm ||
          pr.title.toLowerCase().includes(searchTerm.toLowerCase());
        return byAuthor && byType && bySearch;
      })
      .sort((a, b) => {
        if (sortBy === "Created") return a.createdAt.localeCompare(b.createdAt);
        if (sortBy === "Updated") return a.updatedAt.localeCompare(b.updatedAt);
        if (sortBy === "Title") return a.title.localeCompare(b.title);
        // default: Closed date
        return a.closedOn.localeCompare(b.closedOn);
      });
  }, [prs, authorFilter, typeFilter, searchTerm, sortBy]);

  return (
    <main className="text-white bg-[#161B22] min-h-screen">
      {/* top search box drives searchTerm here */}
      <Filter onSearchChange={setSearchTerm} />

      <div className="px-10 mt-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center mb-8 space-y-4 lg:space-y-0 justify-between max-w-auto m-auto">
          <h1 className="font-bold text-3xl">Closed Pull Requests</h1>

          <div className="flex flex-row flex-wrap gap-3">
            <select
              value={authorFilter}
              onChange={(e) => setAuthorFilter(e.target.value)}
              className="text-white font-bold w-[140px] sm:w-[160px] text-xs h-[38px] bg-[#161b22] border border-[#30363D] rounded-lg pl-3"
            >
              <option>All Authors</option>
              {[...new Set(prs.map((p) => p.author))].map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="text-white font-bold w-[140px] sm:w-[160px] text-xs h-[38px] bg-[#161b22] border border-[#30363D] rounded-lg pl-3"
            >
              <option>All Types</option>
              <option>Closed</option>
              <option>Merged</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-white font-bold w-[180px] sm:w-[200px] text-xs h-[38px] bg-[#161b22] border border-[#30363D] rounded-lg pl-3"
            >
              <option>Closed</option>
              <option>Created</option>
              <option>Updated</option>
              <option>Title</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-400 text-sm">Loading…</p>
        ) : (
          <div className="space-y-4">
            {filtered.map((pr) => (
              <PullRequestCard key={pr.id} pr={pr} />
            ))}
            {filtered.length === 0 && (
              <p className="text-gray-500 text-sm">No PRs found.</p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
