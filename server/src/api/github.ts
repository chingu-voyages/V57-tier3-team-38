// server/src/api/github.ts
import { Octokit } from "@octokit/rest";

export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN || undefined, // falls back to unauthenticated if missing
  userAgent: "pr-status-board/1.0.0",
});
