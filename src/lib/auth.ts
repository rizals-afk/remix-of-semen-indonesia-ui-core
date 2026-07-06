import { apiFetch, TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from "./api";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
  password_confirmation: string;
}

export interface SignupPayload {
  name: string;
  nik_ktp?: string;
  phone: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface ActivateAccountPayload {
  token: string;
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

export async function loginAdmin(payload: LoginPayload): Promise<LoginResponse> {
  const res = await apiFetch<LoginResponse>("/login-admin", {
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

export async function forgotPassword(payload: ForgotPasswordPayload): Promise<void> {
  await apiFetch<void>("/forgot-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function resetPassword(payload: ResetPasswordPayload): Promise<void> {
  await apiFetch<void>("/reset-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function signup(payload: SignupPayload): Promise<{ message: string }> {
  const res = await apiFetch<{ message: string }>("/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return res;
}

export async function activateAccount(payload: ActivateAccountPayload): Promise<{ message: string }> {
  const res = await apiFetch<{ message: string }>("/activate-account", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return res;
}

export function saveSession(token: string, user?: unknown) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
  if (user !== undefined && user !== null) {
    window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  }
}

export async function logout(): Promise<void> {
  try {
    await apiFetch<void>("/logout", {
      method: "POST",
    });
  } catch (err) {
    // Ignore logout API errors and proceed with local cleanup
    console.error("Logout API call failed:", err);
  }
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

export async function getCurrentUser<T = unknown>(): Promise<T> {
  return await apiFetch<T>("/me");
}