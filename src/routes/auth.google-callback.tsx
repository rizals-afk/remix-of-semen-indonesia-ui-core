import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { apiFetch, TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from "@/lib/api";

export const Route = createFileRoute("/auth/google-callback")({
  component: GoogleCallback,
});

function GoogleCallback() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Call the backend callback endpoint
        const response = await apiFetch<{
          token?: string;
          access_token?: string;
          user?: unknown;
          data?: {
            token?: string;
            access_token?: string;
            user?: unknown;
          };
        }>("/auth/google/callback");

        // Extract token and user from response
        const token =
          response.token ??
          response.access_token ??
          response.data?.token ??
          response.data?.access_token ??
          null;
        const user = response.user ?? response.data?.user ?? null;

        if (!token) {
          throw new Error("Google authentication succeeded but no token received.");
        }

        // Save token and user to localStorage
        if (typeof window !== "undefined") {
          window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
          if (user !== null && user !== undefined) {
            window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
          }
        }

        toast.success("Login dengan Google berhasil");
        await navigate({ to: "/" });
      } catch (err) {
        console.error("Google callback failed:", err);
        toast.error("Gagal login dengan Google. Silakan coba lagi.");
        await navigate({ to: "/masuk" });
      } finally {
        setLoading(false);
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">
          {loading ? "Memproses login Google..." : "Mengalihkan..."}
        </p>
      </div>
    </div>
  );
}
