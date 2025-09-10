import type { PRState, PRActions } from "@/types/pr";

export const initialPRState: PRState = {
  filters: { repo: null, user: null },
  open: [],
  closed: [],
  loading: false,
  error: null,
};

export function prReducer(state: PRState, action: PRActions): PRState {
  switch (action.type) {
    case "SET_REPO":
      return { ...state, filters: { ...state.filters, repo: action.payload } };
    case "SET_USER":
      return { ...state, filters: { ...state.filters, user: action.payload } };
    case "CLEAR_FILTERS":
      return { ...state, filters: { repo: null, user: null } };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_OPEN_PRS":
      return { ...state, open: action.payload };
    case "SET_CLOSED_PRS":
      return { ...state, closed: action.payload };
    default:
      return state;
  }
}
