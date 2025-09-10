"use client";

import { createContext, useCallback, useContext, useMemo, useReducer } from "react";
import { prReducer, initialPRState } from "@/reducer/prReducer";
import type { PRItem, PRState } from "@/types/pr";
import { apiFetch } from "@/utils/api";

type PRContextValue = PRState & {
  setRepo: (repo: string | null) => void;
  setUser: (user: string | null) => void;
  clearFilters: () => void;
  loadOpenPRs: () => Promise<void>;
  loadClosedPRs: () => Promise<void>;
};

const PRContext = createContext<PRContextValue | null>(null);

export function PRProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(prReducer, initialPRState);

  const setRepo = (repo: string | null) => dispatch({ type: "SET_REPO", payload: repo });
  const setUser = (user: string | null) => dispatch({ type: "SET_USER", payload: user });
  const clearFilters = () => dispatch({ type: "CLEAR_FILTERS" });

  const buildQuery = () => {
    const q = new URLSearchParams();
    if (state.filters.repo) q.set("repo", state.filters.repo);
    if (state.filters.user) q.set("user", state.filters.user);
    return q.toString() ? `?${q.toString()}` : "";
  };

  const loadOpenPRs = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });
    try {
      const data = await apiFetch<{ items: PRItem[] }>(`/api/prs${buildQuery()}${buildQuery() ? "&" : "?"}state=open`);
      dispatch({ type: "SET_OPEN_PRS", payload: data.items });
    } catch (e: any) {
      dispatch({ type: "SET_ERROR", payload: e?.message ?? "Failed to load open PRs" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [state.filters.repo, state.filters.user]);

  const loadClosedPRs = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });
    try {
      const data = await apiFetch<{ items: PRItem[] }>(`/api/prs${buildQuery()}${buildQuery() ? "&" : "?"}state=closed`);
      dispatch({ type: "SET_CLOSED_PRS", payload: data.items });
    } catch (e: any) {
      dispatch({ type: "SET_ERROR", payload: e?.message ?? "Failed to load closed PRs" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [state.filters.repo, state.filters.user]);

  const value: PRContextValue = useMemo(
    () => ({ ...state, setRepo, setUser, clearFilters, loadOpenPRs, loadClosedPRs }),
    [state, loadOpenPRs, loadClosedPRs]
  );

  return <PRContext.Provider value={value}>{children}</PRContext.Provider>;
}

export function usePR() {
  const ctx = useContext(PRContext);
  if (!ctx) throw new Error("usePR must be used within PRProvider");
  return ctx;
}
