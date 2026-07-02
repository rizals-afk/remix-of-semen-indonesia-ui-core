import { apiFetch, TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from "./api";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token?: string;
  access_token?: string;
  data?: {
    token?: string;
    access_token?: string;
    user?: unknown;
  };
  user?: unknown;
  [key: string]: unknown;
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const res = await apiFetch<LoginResponse>("/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const token =
    res.token ??
    res.access_token ??
    res.data?.token ??
    res.data?.access_token ??
    null;
  const user = res.user ?? res.data?.user ?? null;

  if (!token) {
    throw new Error("Login berhasil tapi token tidak diterima dari server.");
  }
  saveSession(token, user);
  return res;
}

export function saveSession(token: string, user?: unknown) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
  if (user !== undefined && user !== null) {
    window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  }
}

export function logout() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  window.localStorage.removeItem(USER_STORAGE_KEY);
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function getUser<T = unknown>(): T | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(USER_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}