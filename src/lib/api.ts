export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  "https://2d4gssn7-8000.asse.devtunnels.ms/api";

export const TOKEN_STORAGE_KEY = "bm_auth_token";
export const USER_STORAGE_KEY = "bm_auth_user";

export class ApiError extends Error {
  status: number;
  data: unknown;
  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_STORAGE_KEY);
}

export async function apiFetch<T = unknown>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type") && init.body) {
    headers.set("Content-Type", "application/json");
  }
  headers.set("Accept", "application/json");
  const token = getStoredToken();
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });
  } catch (err) {
    throw new ApiError(
      "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.",
      0,
      err,
    );
  }

  const text = await readResponseText(res);
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    let message: string | undefined;
    if (data && typeof data === "object") {
      const d = data as Record<string, unknown>;
      if (typeof d.message === "string") message = d.message;
      else if (typeof d.error === "string") message = d.error;
      if (d.errors && typeof d.errors === "object") {
        const errs = d.errors as Record<string, unknown>;
        const first = Object.values(errs)[0];
        if (Array.isArray(first) && typeof first[0] === "string") {
          message = message ?? first[0];
        } else if (typeof first === "string") {
          message = message ?? first;
        }
      }
    }
    message = message || `Request failed with status ${res.status}`;
    throw new ApiError(message, res.status, data);
  }

  return data as T;
}

async function readResponseText(res: Response): Promise<string> {
  if (!res.body) return res.text();

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let text = "";

  while (true) {
    const read = reader.read();
    const result = await Promise.race([
      read,
      new Promise<"idle">((resolve) => {
        window.setTimeout(resolve, text ? 1200 : 15000, "idle");
      }),
    ]);

    if (result === "idle") {
      try {
        await reader.cancel();
      } catch {
        // Ignore cancellation failures; we already have the response body text.
      }
      return text;
    }

    if (result.done) {
      return text + decoder.decode();
    }

    text += decoder.decode(result.value, { stream: true });
  }
}