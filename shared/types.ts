export interface Reviewer { name: string; role: string }
export type PRStatus = "Need Review" | "In Review" | "Draft" | "Closed" | "Merged";

export interface PullRequest {
  id: number;                        // internal unique ID
  number: number;                    // visible PR number (#123)
  title: string;
  html_url: string;
  state: "open" | "closed";          // GitHub states
  user?: { login?: string };         // PR author info
  created_at: string;                // ISO date strings
  updated_at: string;
  draft?: boolean;                   // true if PR is draft
  base?: { ref?: string };           // target branch (e.g. main)
  head?: { ref?: string };           // source branch (e.g. feature-x)
}
