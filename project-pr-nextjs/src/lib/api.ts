import type { PullRequest } from "@shared/types";

// For development, always go through the Next.js proxy to avoid CORS.
// The proxy adds your GitHub token (if logged in) and forwards to Express.
export async function getOpenPRs(owner: string, repo: string): Promise<PullRequest[]> {
  const url = `/api/proxy/pullrequests?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}&state=open`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(`Failed to fetch PRs (${res.status}): ${msg}`);
  }

  const data = await res.json();
  return data.items ?? []; // assuming Express returns { items: [...] }
}
