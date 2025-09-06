import { apiFetch } from "./api";
import type { LoginRequest, LoginResponse } from "@/types/auth";

export async function login(data: LoginRequest) {
  console.log("[login] sending credentials:", data.username);
  const response = await apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
  console.log("[login] server response:", response);
  return response;
}


export async function fetchMe() {
  console.log("[fetchMe] fetching current user");
  const response = await apiFetch<{ username: string }>("/auth/me");
  console.log("[fetchMe] server response:", response);
  return response;
}