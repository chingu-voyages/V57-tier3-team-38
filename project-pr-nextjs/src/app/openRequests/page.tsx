"use client";

import { useState, useEffect } from "react";
import PullRequestCard, { PullRequest } from "../components/PullRequestCard";
import Filter from "../components/filter";
import { Octokit } from "octokit";

export default function OpenPRsPage() {
  const [lastFetched, setLastFetched] = useState<string | null>(null);
  const [lastUsedCache, setLastUsedCache] = useState<string | null>(null);
  const [lastCleared, setLastCleared] = useState<string | null>(null);

  const [prs, setPRs] = useState<PullRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const [authorFilter, setAuthorFilter] = useState("All Authors");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [sortBy, setSortBy] = useState("Created");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchLiveData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/openPRs?refresh=true", {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch from backend");
      const json = await res.json();
      console.log("Json from backend:", json);

      const formatted = json.data.map((pr: any) => {
        const reviews = pr.reviews || [];
        const latestReview = [...reviews].sort(
          (a, b) =>
            new Date(b.submitted_at).getTime() -
            new Date(a.submitted_at).getTime()
        )[0];

        let lastAction = "Created";
        let lastActionTime = pr.created_at;

        if (latestReview) {
          if (latestReview.state === "APPROVED") lastAction = "Approved";
          else if (latestReview.state === "CHANGES_REQUESTED")
            lastAction = "Requested changes";
          else if (latestReview.state === "COMMENTED") lastAction = "Commented";
          lastActionTime = latestReview.submitted_at;
        } else if (pr.updated_at) {
          lastAction = "Updated";
          lastActionTime = pr.updated_at;
        }

        const hoursSince = Math.floor(
          (Date.now() - new Date(lastActionTime).getTime()) / (1000 * 60 * 60)
        ).toString();

        const latestReviewsByUser: Record<string, any> = {};
        [...(pr.reviews || [])]
          .sort(
            (a, b) =>
              new Date(a.submitted_at).getTime() -
              new Date(b.submitted_at).getTime()
          )
          .forEach((review: any) => {
            latestReviewsByUser[review.user.login] = review;
          });

        const reviewersGrouped = {
          approved: [] as string[],
          changesRequested: [] as string[],
          commented: [] as string[],
          pending: [] as string[],
        };

        Object.entries(latestReviewsByUser).forEach(([login, review]: any) => {
          if (review.state === "APPROVED")
            reviewersGrouped.approved.push(login);
          else if (review.state === "CHANGES_REQUESTED")
            reviewersGrouped.changesRequested.push(login);
          else if (review.state === "COMMENTED")
            reviewersGrouped.commented.push(login);
        });

        (pr.requested_reviewers || []).forEach((rev: any) => {
          if (!latestReviewsByUser[rev.login])
            reviewersGrouped.pending.push(rev.login);
        });

        const totalReviewers = new Set([
          ...(pr.requested_reviewers?.map((r: any) => r.login) || []),
          ...Object.keys(
            Object.fromEntries(
              pr.reviews?.map((r: any) => [r.user.login, r.state]) || []
            )
          ),
        ]).size;

        const approvals = reviewersGrouped.approved.length;
        const changeRequests = reviewersGrouped.changesRequested.length;

        let status = "Unapproved";

        if (changeRequests > 0) {
          status = "Requested changes";
        } else if (approvals > 0 && approvals < totalReviewers) {
          status = "Pending approvals";
        } else if (approvals > 0 && approvals === totalReviewers) {
          status = "Approved";
        }

        return {
          id: pr.number,
          title: pr.title,
          author: pr.user.login,
          createdAt: new Date(pr.created_at).toLocaleDateString(),
          updatedAt: new Date(pr.updated_at).toLocaleDateString(),
          url: pr.html_url,
          reviewersGrouped,
          lastAction,
          lastActionAt: hoursSince,
          status,
          closedOn: "",
          age: hoursSince,
        };
      });

      // setPRs(formatted);
      const now = new Date().toLocaleString();
      setLastFetched(now);
      localStorage.setItem("lastFetched", now);

      alert("Live data saved to cache. Click 'Use Cached Data' to display it.");

      localStorage.setItem(
        "openPRsCache",
        JSON.stringify({ data: formatted, timestamp: Date.now() })
      );
    } catch (error) {
      console.error("Error fetching from backend:", error);
    } finally {
      setLoading(false);
    }
  };

  const useCache = () => {
    const cached = localStorage.getItem("openPRsCache");
    if (cached) {
      const parsed = JSON.parse(cached);
      const safeData = (parsed.data || []).map((pr: any) => ({
        ...pr,
        reviewersGrouped: pr.reviewersGrouped || {
          approved: [],
          changesRequested: [],
          commented: [],
          pending: [],
        },
      }));
      setPRs(safeData);
      const now = new Date().toLocaleString();
      setLastUsedCache(now);
      localStorage.setItem("lastUsedCache", now);
    } else {
      alert("No cache found!");
    }
  };

  const clearCache = () => {
    localStorage.removeItem("openPRsCache");
    setPRs([]);
    const now = new Date().toLocaleString();
    setLastCleared(now);
    localStorage.setItem("lastCleared", now);
  };

  useEffect(() => {
    const cached = localStorage.getItem("openPRsCache");
    const storedFetched = localStorage.getItem("lastFetched");
    const storedUsed = localStorage.getItem("lastUsedCache");
    const storedCleared = localStorage.getItem("lastCleared");

    if (storedFetched) setLastFetched(storedFetched);
    if (storedUsed) setLastUsedCache(storedUsed);
    if (storedCleared) setLastCleared(storedCleared);

    if (cached) {
      const parsed = JSON.parse(cached);
      const safeData = (parsed.data || []).map((pr: any) => ({
        ...pr,
        reviewersGrouped: pr.reviewersGrouped || {
          approved: [],
          changesRequested: [],
          commented: [],
          pending: [],
        },
      }));
      setPRs(safeData);
    }
    setLoading(false);
  }, []);

  const filteredPRs = prs
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
    <main className="min-h-screen text-white">
      <Filter
        onFetchLive={fetchLiveData}
        onUseCache={useCache}
        onClearCache={clearCache}
      />

      <div className="px-10 mt-10">
      {/* <p className="text-xl animate-pulse">
        <span className="text-white mr-2">
            <svg className="animate-spin inline -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        </span>
        Fetching open pull requests...
      </p> */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center mb-8 space-y-4 lg:space-y-0 justify-between max-w-[1216px] m-auto">
          <h1 className="text-3xl font-bold mb-6 mt-5">Open Pull Requests</h1>
        </div>

        <div className="text-gray-400 text-sm mb-6 space-y-1">
          {lastFetched && <p>Last fetched (Get Live Data): {lastFetched}</p>}
          {lastUsedCache && (
            <p>Last used cache (Use Cached Data): {lastUsedCache}</p>
          )}
          {lastCleared && <p>Cache cleared on: {lastCleared}</p>}
        </div>

        <div className="flex flex-row flex-wrap gap-3 mb-8">
          <input
            type="text"
            placeholder="Search Open PRs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[200px] sm:w-[220px] bg-[#161b22] border border-[#30363D] rounded-lg pl-4 pr-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={authorFilter}
            onChange={(e) => setAuthorFilter(e.target.value)}
            className="font-bold w-[120px] sm:w-[140px] text-sm h-[38px] bg-[#161b22] border border-[#30363D] rounded-lg"
          >
            <option>All Authors</option>
            {[...new Set(prs.map((pr) => pr.author))].map((author, index) => (
              <option key={`${author}-${index}`}>{author}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="font-bold w-[140px] sm:w-[160px] text-sm h-[38px] bg-[#161b22] border border-[#30363D] rounded-lg"
          >
            <option>All Status</option>
            <option>Unapproved</option>
            <option>Pending approvals</option>
            <option>Requested changes</option>
            <option>Approved</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="font-bold w-[140px] sm:w-[160px] text-sm h-[38px] bg-[#161b22] border border-[#30363D] rounded-lg"
          >
            <option>Sort By Created</option>
            <option>Updated</option>
            <option>Title</option>
          </select>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-4">
            {filteredPRs.map((pr) => (
              <PullRequestCard key={pr.id} pr={pr} />
            ))}
            {filteredPRs.length === 0 && (
              <p className="text-gray-500 text-sm">
                No pull requests found.
                <br />
                Please click{" "}
                <span className="text-blue-400 font-semibold">
                  “Get Live Data & Save”
                </span>{" "}
                to fetch the latest data.
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
