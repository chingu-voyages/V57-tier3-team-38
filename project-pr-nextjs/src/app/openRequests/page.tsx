"use client";

import { useState, useEffect } from "react";
import PullRequestCard from "../components/PullRequestCard";
import Filter from "../components/filter";
import { Octokit } from "octokit";
import type { OpenPullRequest, OpenPRStatus } from "@/types/pr";

export default function OpenPRsPage() {
  const [prs, setPRs] = useState<OpenPullRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters (these are client-only filters over the fetched list)
  const [authorFilter, setAuthorFilter] = useState("All Authors");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [sortBy, setSortBy] = useState("Created");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPRs = async () => {
      try {
        const octokit = new Octokit({
          auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN,
        });

        const { data } = await octokit.request(
          "GET /repos/{owner}/{repo}/pulls",
          {
            owner: process.env.NEXT_PUBLIC_GITHUB_ORG as string,
            repo: process.env.NEXT_PUBLIC_GITHUB_REPO_NAME as string,
            state: "open",
            headers: { "X-GitHub-Api-Version": "2022-11-28" },
          }
        );

        const formatted: OpenPullRequest[] = await Promise.all(
          data.map(async (pr: any) => {
            // reviews for status computation
            const { data: reviews } = await octokit.request(
              "GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews",
              {
                owner: process.env.NEXT_PUBLIC_GITHUB_ORG as string,
                repo: process.env.NEXT_PUBLIC_GITHUB_REPO_NAME as string,
                pull_number: pr.number,
              }
            );

            // latest review & last action
            const latestReview = [...reviews].sort(
              (a: any, b: any) =>
                new Date(b.submitted_at).getTime() -
                new Date(a.submitted_at).getTime()
            )[0];

            let lastAction = "Created";
            let lastActionTime = pr.created_at;

            if (latestReview) {
              if (latestReview.state === "APPROVED") lastAction = "Approved";
              else if (latestReview.state === "CHANGES_REQUESTED")
                lastAction = "Requested changes";
              else lastAction = "Commented";
              lastActionTime = latestReview.submitted_at;
            } else if (pr.updated_at) {
              lastAction = "Updated";
              lastActionTime = pr.updated_at;
            }

            const hoursSince = Math.floor(
              (Date.now() - new Date(lastActionTime).getTime()) /
                (1000 * 60 * 60)
            ).toString();

            // reviewers (group by latest state per reviewer)
            const latestByUser = reviews.reduce((acc: any, r: any) => {
              acc[r.user.login] = r;
              return acc;
            }, {} as Record<string, any>);

            const reviewersGrouped = {
              approved: [] as string[],
              changesRequested: [] as string[],
              commented: [] as string[],
              pending: [] as string[],
            };

            Object.entries(latestByUser).forEach(([login, r]: any) => {
              if (r.state === "APPROVED") reviewersGrouped.approved.push(login);
              else if (r.state === "CHANGES_REQUESTED")
                reviewersGrouped.changesRequested.push(login);
              else if (r.state === "COMMENTED")
                reviewersGrouped.commented.push(login);
            });

            (pr.requested_reviewers || []).forEach((rev: any) => {
              if (!latestByUser[rev.login])
                reviewersGrouped.pending.push(rev.login);
            });

            // compute OpenPRStatus (no Draft/Closed/Merged here)
            const finalStates: string[] = Object.values(latestByUser).map(
              (r: any) => r.state
            );
            const approvals = finalStates.filter((s) => s === "APPROVED");
            const changeRequests = finalStates.filter(
              (s) => s === "CHANGES_REQUESTED"
            );

            let status: OpenPRStatus = "Unapproved";
            if (changeRequests.length > 0) {
              status = "Requested changes";
            } else if (
              approvals.length === pr.requested_reviewers?.length &&
              pr.requested_reviewers?.length > 0
            ) {
              status = "Approved";
            } else if (approvals.length > 0) {
              status = "Pending approvals";
            }

            const item: OpenPullRequest = {
              id: pr.number,
              title: pr.title,
              author: pr.user.login,
              createdAt: new Date(pr.created_at).toLocaleDateString(),
              updatedAt: new Date(pr.updated_at).toLocaleDateString(),
              age: hoursSince,
              status,
              url: pr.html_url,
              lastAction,
              lastActionAt: hoursSince,
              reviewersGrouped,
            };

            return item;
          })
        );

        setPRs(formatted);
      } catch (err) {
        console.error("Error fetching PRs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPRs();
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
      {/* Let the top Filter’s search drive searchTerm */}
      <Filter onSearchChange={setSearchTerm} />

      <div className="px-10 mt-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center mb-8 space-y-4 lg:space-y-0 justify-between max-w-[1216px] m-auto">
          <h1 className="text-3xl font-bold mb-6 mt-5">Open Pull Requests</h1>

          <div className="flex flex-row flex-wrap gap-3">
            {/* Keep the dropdown filters; remove the duplicate text input since Filter handles it */}
            <select
              value={authorFilter}
              onChange={(e) => setAuthorFilter(e.target.value)}
              className="font-bold w-[120px] sm:w-[140px] text-sm h-[38px] bg-[#161b22] border border-[#30363D] rounded-lg"
            >
              <option>All Authors</option>
              {[...new Set(prs.map((pr) => pr.author))].map((author) => (
                <option key={author}>{author}</option>
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
              <option>Created</option>
              <option>Updated</option>
              <option>Title</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-4">
            {filteredPRs.map((pr) => (
              <PullRequestCard key={pr.id} pr={pr} />
            ))}
            {filteredPRs.length === 0 && (
              <p className="text-gray-500 text-sm">No PRs found.</p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
