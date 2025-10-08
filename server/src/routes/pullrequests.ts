import { Router } from "express";
import { Octokit } from "@octokit/rest";

const router = Router();

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN || undefined, // works unauthenticated for public repos but low rate limits
  userAgent: "pr-status-board/1.0.0",
});

function hoursSince(iso: string) {
  const ms = Date.now() - new Date(iso).getTime();
  return Math.max(0, Math.round(ms / 36e5));
}
function mapStatus(pr: any) {
  if (pr.merged_at) return "Merged";
  if (pr.state === "closed") return "Closed";
  if (pr.draft) return "Draft";
  return "Need Review";
}
function mapReviewers(pr: any) {
  const u = (pr.requested_reviewers || []).map((x: any) => ({ name: x.login, role: "reviewer" }));
  const t = (pr.requested_teams || []).map((x: any) => ({ name: x.slug, role: "team" }));
  return [...u, ...t];
}
function mapPR(pr: any) {
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

// simple validator: owner/repo are GitHub slugs (alnum, dash, dot, underscore)
const SLUG_RE = /^[A-Za-z0-9._-]+$/;

function resolveOwnerRepo(q: any) {
  const owner = (q.owner as string) || process.env.GITHUB_OWNER;
  const repo  = (q.repo as string)  || process.env.GITHUB_REPO;
  if (!owner || !repo) throw new Error("Missing owner or repo (provide ?owner=&repo= or set env)");
  if (!SLUG_RE.test(owner) || !SLUG_RE.test(repo)) throw new Error("Invalid owner/repo format");
  return { owner, repo };
}

// GET /api/pullrequests?owner=vercel&repo=next.js&state=open
router.get("/pullrequests", async (req, res) => {
  const state = (req.query.state as "open" | "closed" | "all") || "open";
  try {
    const { owner, repo } = resolveOwnerRepo(req.query);
    const { data } = await octokit.pulls.list({
      owner, repo, state, per_page: 50, sort: "updated", direction: "desc",
    });
    res.json(data.map(mapPR));
  } catch (e: any) {
    const status = e?.status;
    const message = e?.response?.data?.message || e?.message;
    console.error("pulls.list error:", status, message);
    res.status(502).json({ error: "GitHub error", gh_status: status, gh_message: message });
  }
});

// GET /api/pullrequests/:id?owner=...&repo=...
router.get("/pullrequests/:id", async (req, res) => {
  try {
    const { owner, repo } = resolveOwnerRepo(req.query);
    const { data } = await octokit.pulls.get({
      owner, repo, pull_number: Number(req.params.id),
    });
    res.json(mapPR(data));
  } catch (e: any) {
    const status = e?.status;
    const message = e?.response?.data?.message || e?.message;
    console.error("pulls.get error:", status, message);
    res.status(502).json({ error: "GitHub error", gh_status: status, gh_message: message });
  }
});

export default router;
