"use client";

import { createContext, useContext, useMemo, useReducer } from "react";
import { authReducer, initialAuthState } from "@/reducer/authReducer";
import type { AuthState, AuthAction, User } from "@/types/auth";
import { fetchMe, login as apiLogin } from "@/utils/auth";

type AuthContextValue = AuthState & {
  login: (u: string, p: string) => Promise<void>;
  logout: () => void;
  hydrateUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Let TS infer from the typed reducer; avoids the “Expected 2 type arguments” error
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  const login = async (username: string, password: string) => {
    await apiLogin({ username, password });
    await hydrateUser();
  };

  const logout = () => {
    // call /auth/logout if your server has it, then:
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

  // IMPORTANT: include the state fields in the context value
  const value: AuthContextValue = useMemo(
    () => ({ ...state, login, logout, hydrateUser }),
    [state]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
