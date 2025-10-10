"use client";

import { useState, useEffect } from "react";
import PullRequestCard, { PullRequest } from "../components/PullRequestCard";
import Filter from "../components/filter";
import { Octokit } from "octokit";

export default function OpenPRsPage() {
  const [prs, setPRs] = useState<PullRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
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

        const formatted: PullRequest[] = await Promise.all(
          data.map(async (pr: any) => {
            type PRStatus = PullRequest["status"]; 
            let status: PRStatus = "Unapproved";
            
            const { data: reviews } = await octokit.request(
              "GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews",
              {
                owner: process.env.NEXT_PUBLIC_GITHUB_ORG!,
                repo: process.env.NEXT_PUBLIC_GITHUB_REPO_NAME!,
                pull_number: pr.number,
              }
            );

            const latestReview = reviews.sort(
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

            const groupedReviewers = {
              approved: [] as string[],
              changesRequested: [] as string[],
              commented: [] as string[],
              pending: [] as string[],
            };

            const latestReviews = reviews.reduce((acc: any, review: any) => {
              acc[review.user.login] = review;
              return acc;
            }, {});

            Object.entries(latestReviews).forEach(([login, review]: any) => {
              if (review.state === "APPROVED")
                groupedReviewers.approved.push(login);
              else if (review.state === "CHANGES_REQUESTED")
                groupedReviewers.changesRequested.push(login);
              else if (review.state === "COMMENTED")
                groupedReviewers.commented.push(login);
            });

            (pr.requested_reviewers || []).forEach((rev: any) => {
              if (!latestReviews[rev.login])
                groupedReviewers.pending.push(rev.login);
            });

            const finalStates = Object.values(latestReviews).map(
              (r: any) => r.state
            );
            const approvals = finalStates.filter((s: any) => s === "APPROVED");
            const changeRequests = finalStates.filter(
              (s: any) => s === "CHANGES_REQUESTED"
            );

            let status = "Unapproved";
            if (pr.draft) {
              status = "Draft";
            } else if (changeRequests.length > 0) {
              status = "Requested changes";
            } else if (
              approvals.length === pr.requested_reviewers?.length &&
              pr.requested_reviewers?.length > 0
            ) {
              status = "Approved";
            } else if (approvals.length > 0) {
              status = "Pending approvals";
            }

            return {
              id: pr.number,
              title: pr.title,
              author: pr.user.login,
              createdAt: new Date(pr.created_at).toLocaleDateString(),
              updatedAt: new Date(pr.updated_at).toLocaleDateString(),
              closedOn: "",
              age: hoursSince,
              status,
              url: pr.html_url,
              lastAction,
              lastActionAt: hoursSince,
              reviewersGrouped: groupedReviewers,
            };
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
    <main className="min-h-screen text-white ">
      <Filter/>

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
              <option>Sort By Created</option>
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
