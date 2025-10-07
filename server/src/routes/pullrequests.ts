import { Router } from "express";
import { Octokit } from "@octokit/rest";

// --- Octokit (re-use your init if you prefer importing it) ---
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN || undefined,
  userAgent: "pr-status-board/1.0.0",
});

const OWNER = process.env.GITHUB_OWNER!;
const REPO  = process.env.GITHUB_REPO!;

type PRStatus = "Need Review" | "In Review" | "Draft" | "Closed" | "Merged";
type Reviewer = { name: string; role: string };
export interface ApiPullRequest {
  id: number;
  title: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  closedOn: string;
  ageHours: number;
  reviewers: Reviewer[];
  status: PRStatus;
}

// --- Helpers ---
function hoursSince(iso: string): number {
  const ms = Date.now() - new Date(iso).getTime();
  return Math.max(0, Math.round(ms / 36e5));
}
function mapStatus(pr: any): PRStatus {
  if (pr.merged_at) return "Merged";
  if (pr.state === "closed") return "Closed";
  if (pr.draft) return "Draft";
  // could look at reviews API to upgrade to "In Review"
  return "Need Review";
}
function mapReviewers(pr: any): Reviewer[] {
  const u = (pr.requested_reviewers || []).map((x: any) => ({ name: x.login, role: "reviewer" }));
  const t = (pr.requested_teams || []).map((x: any) => ({ name: x.slug, role: "team" }));
  return [...u, ...t];
}
function mapPR(pr: any): ApiPullRequest {
  return {
    id: pr.number,
    title: pr.title,
    author: pr.user?.login ?? "unknown",
    createdAt: pr.created_at,
    updatedAt: pr.updated_at,
    closedOn: pr.closed_at ?? "",
    ageHours: hoursSince(pr.created_at),
    reviewers: mapReviewers(pr),
    status: mapStatus(pr),
  };
}

// --- Simple in-memory cache + fallback ---
const cache = {
  listOpen: { data: [] as ApiPullRequest[], ts: 0 },
  byId: new Map<number, { data: ApiPullRequest; ts: number }>(),
};
const TTL_MS = 60_000; // 1 minute cache window

const router = Router();

// GET /api/pullrequests?state=open|closed|all
router.get("/pullrequests", async (req, res) => {
  const state = (req.query.state as "open" | "closed" | "all") || "open";
  try {
    // cache for open list only (customize as needed)
    if (state === "open" && Date.now() - cache.listOpen.ts < TTL_MS) {
      return res.json(cache.listOpen.data);
    }

    const { data } = await octokit.pulls.list({
      owner: OWNER,
      repo: REPO,
      state,
      per_page: 50,
      sort: "updated",
      direction: "desc",
    });

    const mapped = data.map(mapPR);
    if (state === "open") {
      cache.listOpen = { data: mapped, ts: Date.now() };
    }
    res.json(mapped);
  } catch (e: any) {
    console.error("listPullRequests error:", e?.status, e?.message);
    // Fallback if we have cached data
    if (state === "open" && cache.listOpen.data.length) {
      return res.json(cache.listOpen.data);
    }
    res.status(502).json({ error: "Failed to fetch pull requests" });
  }
});

// GET /api/pullrequests/:id
router.get("/pullrequests/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    const cached = cache.byId.get(id);
    if (cached && Date.now() - cached.ts < TTL_MS) {
      return res.json(cached.data);
    }

    const { data } = await octokit.pulls.get({
      owner: OWNER,
      repo: REPO,
      pull_number: id,
    });

    const mapped = mapPR(data);
    cache.byId.set(id, { data: mapped, ts: Date.now() });
    res.json(mapped);
  } catch (e: any) {
    console.error("getPullRequest error:", e?.status, e?.message);
    const cached = cache.byId.get(id);
    if (cached) return res.json(cached.data);
    res.status(502).json({ error: "Failed to fetch pull request" });
  }
});

export default router;
