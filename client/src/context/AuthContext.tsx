"use client";

import { createContext, useContext, useMemo, useReducer } from "react";
import { authReducer, initialAuthState } from "@/reducers/authReducer";
import type { AuthState, AuthAction, User } from "@/types/auth";
import { fetchMe, login as apiLogin } from "@/utils/auth";

type AuthContextValue = AuthState & {
  login: (u: string, p: string) => Promise<void>;
  logout: () => void;
  hydrateUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer<React.Reducer<AuthState, AuthAction>>(
    authReducer,
    initialAuthState
  );

  const login = async (username: string, password: string) => {
    const tokens = await apiLogin({ username, password });
    // tokens are likely set via cookies on the server; if you store anything locally, do it here
    await hydrateUser();
  };

  const logout = () => {
    // optional: call /auth/logout then clear any local state if you store tokens
    dispatch({ type: "LOGOUT" });
  };

  const hydrateUser = async () => {
    try {
      const user: User = await fetchMe();
      dispatch({ type: "SET_USER", payload: user });
    } catch {
      dispatch({ type: "LOGOUT" });
    }
  };

  const value = useMemo(
    () => ({ ...state, login, logout, hydrateUser }),
    [state]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(Au
