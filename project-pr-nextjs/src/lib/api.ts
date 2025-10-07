import type { PullRequest } from "@shared/types";
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function getOpenPRs(): Promise<PullRequest[]> {
  const res = await fetch(`${API}/api/pullrequests?state=open`, { cache: "no-store" });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}
