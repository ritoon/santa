import { apiFetch } from "./client";
import type { AuthResponse } from "./types";

export interface RegisterPayload {
  email: string;
  password: string;
  childName: string;
  age?: number;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export function register(payload: RegisterPayload): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/api/register", {
    method: "POST",
    body: payload,
  });
}

export function login(payload: LoginPayload): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/api/login", {
    method: "POST",
    body: payload,
  });
}
