export type PRStateType = "open" | "closed";

export interface PRItem {
  number: number;            // PR number
  title: string;
  html_url: string;          // link to PR on GitHub
  author: string;            // login of author
  reviewers: string[];       // logins of requested/actual reviewers
  createdAt: string;         // ISO string
  lastAction: "created" | "commented" | "changes_requested" | "merged" | "closed";
  lastActionAt: string;      // ISO string of last action
}

export interface PRFilters {
  repo: string | null;       // e.g. "owner/repo"
  user: string | null;       // filter by author/reviewer login
}

export interface PRState {
  filters: PRFilters;
  open: PRItem[];
  closed: PRItem[];
  loading: boolean;
  error: string | null;
}

export type PRActions =
  | { type: "SET_REPO"; payload: string | null }
  | { type: "SET_USER"; payload: string | null }
  | { type: "CLEAR_FILTERS" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_OPEN_PRS"; payload: PRItem[] }
  | { type: "SET_CLOSED_PRS"; payload: PRItem[] };
