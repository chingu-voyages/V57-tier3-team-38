// src/reducers/authReducer.ts
import type { AuthState, AuthAction } from "@/types/auth";

export const initialAuthState: AuthState = {
  // With cookie-based auth, we start unauthenticated and flip true after /auth/me succeeds
  isAuthenticated: false,
  tokens: { access: null, refresh: null }, // kept for compatibility; fine to ignore with cookies
  user: null,
};

export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "SET_TOKENS": {
      const tokens = action.payload;
      return {
        ...state,
        tokens,
        // If you do ever store access tokens client-side, this line will auto-mark auth true
        isAuthenticated: Boolean(tokens.access) || state.isAuthenticated,
      };
    }

    case "SET_USER": {
      const user = action.payload;
      return {
        ...state,
        user,
        // Treat having a valid user as authenticated (works well with cookie sessions)
        isAuthenticated: Boolean(user) || state.isAuthenticated,
      };
    }

    case "LOGOUT": {
      return initialAuthState;
    }

    default:
      return state;
  }
}
