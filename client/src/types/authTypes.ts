// what the server expects
export interface LoginRequest {
  username: string;
  password: string;
}

// what the server returns
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
