import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from "@/lib/api";

export const Route = createFileRoute("/auth/google-callback")({
  component: GoogleCallback,
});

function GoogleCallback() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get all query parameters from the URL
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        const token = params.get("token") || params.get("access_token");
        const userParam = params.get("user");

        // If we have a code, forward to backend
        if (code) {
          const scope = params.get("scope");
          const iss = params.get("iss");
          const authuser = params.get("authuser");
          const hd = params.get("hd");
          const prompt = params.get("prompt");

          const backendUrl = `${import.meta.env.VITE_API_BASE_URL}/auth/google/callback`;
          const callbackUrl = `${backendUrl}?code=${encodeURIComponent(code)}&scope=${encodeURIComponent(scope || "")}&iss=${encodeURIComponent(iss || "")}&authuser=${encodeURIComponent(authuser || "")}&hd=${encodeURIComponent(hd || "")}&prompt=${encodeURIComponent(prompt || "")}`;

          const response = await fetch(callbackUrl, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
            },
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Google authentication failed.");
          }

          const data = await response.json();

          // Extract token and user from response
          const finalToken = data.token ?? data.access_token ?? data.data?.token ?? data.data?.access_token ?? null;
          const user = data.user ?? data.data?.user ?? null;

          if (!finalToken) {
            throw new Error("Google authentication succeeded but no token received.");
          }

          // Save token and user to localStorage
          if (typeof window !== "undefined") {
            window.localStorage.setItem(TOKEN_STORAGE_KEY, finalToken);
            if (user !== null && user !== undefined) {
              window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
            }
          }

          toast.success("Login dengan Google berhasil");
          navigate({ to: "/" });
          return;
        }

        // If we have token directly in URL (backend override), use it
        if (token) {
          if (typeof window !== "undefined") {
            window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
            if (userParam) {
              try {
                const user = JSON.parse(decodeURIComponent(userParam));
                window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
              } catch {
                console.error("Failed to parse user data from URL");
              }
            }
          }

          toast.success("Login dengan Google berhasil");
          navigate({ to: "/" });
          return;
        }

        throw new Error("No authorization code or token received from Google callback.");
      } catch (err) {
        console.error("Google callback failed:", err);
        toast.error("Gagal login dengan Google. Silakan coba lagi.");
        navigate({ to: "/masuk" });
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
