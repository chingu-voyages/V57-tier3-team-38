// src/types/pr.ts

// Shared bits
export interface Reviewer {
  name: string;
  role?: string;
}

interface BasePR {
  id: number;
  title: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  age: string;          // hours since last action (string in your UIs)
}

// === Open PRs ===============================================================
export type OpenPRStatus =
  | "Unapproved"
  | "Pending approvals"
  | "Requested changes"
  | "Approved"
  | "Draft"; // allow Draft here to avoid unions bleeding in from the closed card

export interface OpenPullRequest extends BasePR {
  url: string;
  lastAction: string;
  lastActionAt: string;
  status: OpenPRStatus;
  reviewersGrouped: {
    approved: string[];
    changesRequested: string[];
    commented: string[];
    pending: string[];
  };
  closedOn?: string; // not used on the open card, but harmless if present
}

// === Closed PRs =============================================================
export type ClosedPRStatus =
  | "Need Review"
  | "In Review"
  | "Draft"
  | "Closed"
  | "Merged";

export interface ClosedPullRequest extends BasePR {
  closedOn: string;
  status: ClosedPRStatus;
  reviewers: Reviewer[];
}

// Optional helpers
export type AnyPullRequest = OpenPullRequest | ClosedPullRequest;

export function isOpenPR(pr: AnyPullRequest): pr is OpenPullRequest {
  return "reviewersGrouped" in pr;
}

export function isClosedPR(pr: AnyPullRequest): pr is ClosedPullRequest {
  return "reviewers" in pr;
}
