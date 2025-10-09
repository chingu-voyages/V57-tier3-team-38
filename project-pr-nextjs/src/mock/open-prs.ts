// src/mock/open-prs.ts
import type { PullRequest } from "@shared/types";

export const mockOpenPRs: PullRequest[] = [
  {
    id: 1,
    number: 123,
    title: "Mock: Improve responsive layout",
    html_url: "https://github.com/owner/repo/pull/123",
    state: "open",
    user: { login: "alice" },
    created_at: "2025-10-01T12:00:00Z",
    updated_at: "2025-10-01T12:00:00Z",
    draft: false,
    base: { ref: "main" },
    head: { ref: "feat/responsive" },
  },
  // add a couple more if you like
];
