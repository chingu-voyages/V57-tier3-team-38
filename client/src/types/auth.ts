export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  username: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface RegisterResponse {
  username: string;
}

export interface MeResponse {
  username: string;
}

export type User = { username: string };

export type Tokens = { access: string | null; refresh: string | null };

export type AuthState = {
  isAuthenticated: boolean;
  tokens: Tokens;
  user: User | null;
};

export type AuthAction =
  | { type: "SET_TOKENS"; payload: Tokens }
  | { type: "SET_USER"; payload: User | null }
  | { type: "LOGOUT" };

export type auth = {
username: string;
password: string;
};