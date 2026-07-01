## Goal

Connect the Sign In page (`/masuk`) to the real backend API at `https://2d4gssn7-8000.asse.devtunnels.ms/api`, store the token in `localStorage`, and show API errors as toast notifications.

## Scope

Only the login endpoint. Register, forgot-password, and other modules stay on their current mock flows and will be wired up later.

## Changes

1. **API base config** — `src/lib/api.ts` (new)
   - Export `API_BASE_URL = "https://2d4gssn7-8000.asse.devtunnels.ms/api"` (via `import.meta.env.VITE_API_BASE_URL` with the value above as fallback so it can be overridden later).
   - Export `apiFetch(path, init)` helper that:
     - Prefixes base URL, sets `Content-Type: application/json`.
     - Attaches `Authorization: Bearer <token>` from `localStorage` if present.
     - On non-2xx, throws an `ApiError` carrying `status` and the server `message` (falls back to generic text).
   - Export `TOKEN_STORAGE_KEY = "bm_auth_token"` and `USER_STORAGE_KEY = "bm_auth_user"`.

2. **Auth service** — `src/lib/auth.ts` (new)
   - `login({ email, password })` → `POST /login` with JSON body, returns parsed data.
   - `saveSession(token, user?)` → writes to `localStorage`.
   - `logout()` → clears both keys.
   - `getToken()`, `getUser()` helpers.

3. **Sign In page** — edit `src/routes/masuk.tsx`
   - Convert inputs to controlled state (`email`, `password`), add `isLoading` state.
   - Prefill remains `testadmin@email.com` / `testadmin` for convenience.
   - On submit: call `login(...)`, on success save token + user then `navigate({ to: "/" })` and show success toast.
   - On failure: `toast.error(err.message)` using `sonner` (already used in project via `Toaster` in root).
   - Disable the submit button while loading and show "Signing in…" label.

4. **Toaster** — verify `<Toaster />` from `sonner` is mounted in `src/routes/__root.tsx`; if missing, add it. (Sonner is already a dependency per `src/components/ui/sonner.tsx`.)

## Out of scope

- No changes to Sign Up, Forgot Password, Reset Password, or any other module.
- No route guard / protected routes yet — just token storage.
- No refresh-token handling.
- No CORS proxy; assumes the dev-tunnel backend allows the preview origin. If CORS blocks, we'll address in a follow-up.

## Notes for the user

- The dev-tunnel URL (`*.devtunnels.ms`) must have CORS enabled for the Lovable preview origin, otherwise the browser will block the request. If you see a CORS error in the console after this ships, we'll need to whitelist the origin on the backend.
