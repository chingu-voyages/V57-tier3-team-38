export interface Reviewer { name: string; role: string }
export type PRStatus = "Need Review" | "In Review" | "Draft" | "Closed" | "Merged";

export interface PullRequest {
  id: number;
  title: string;
  author: string;
  createdAt: string;   // ISO
  updatedAt: string;   // ISO
  closedOn: string;    // ISO or ""
  ageHours: number;    // use number for logic; format in UI
  reviewers: Reviewer[];
  status: PRStatus;
}
