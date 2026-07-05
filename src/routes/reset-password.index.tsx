import { useState } from "react";
import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { resetPassword } from "@/lib/auth";
import { ApiError } from "@/lib/api";
import {
  AuthShell,
  NotchedInput,
  PrimarySubmit,
} from "@/components/auth/AuthShell";
import forgotArt from "@/assets/auth/forgot.png";

export const Route = createFileRoute("/reset-password/")({
  validateSearch: (search: Record<string, unknown>) => ({
    token: typeof search.token === "string" ? search.token : undefined,
  }),
  head: () => ({ meta: [{ title: "Create New Password — BahanMaterial.com" }] }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const { token } = useSearch({ from: "/reset-password/" });
  const [s1, setS1] = useState(false);
  const [s2, setS2] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if token is missing
  if (!token) {
    toast.error("Token reset password tidak valid atau hilang.");
    navigate({ to: "/lupa-password" });
    return null;
  }

  return (
    <AuthShell
      illustration={<img src={forgotArt} alt="" className="mx-auto w-full max-w-md" />}
    >
      <div className="mx-auto max-w-md space-y-6">
        <header className="space-y-2">
          <h1 className="text-4xl font-extrabold text-primary">Create New Password</h1>
          <p className="text-sm text-muted-foreground">
            Your new password must be different from previous password
          </p>
        </header>
        <form
          className="space-y-5"
          onSubmit={async (e) => {
            e.preventDefault();
            if (loading) return;
            
            if (!password || !passwordConfirmation) {
              toast.error("Mohon lengkapi semua field password.");
              return;
            }
            
            if (password !== passwordConfirmation) {
              toast.error("Password dan konfirmasi password tidak cocok.");
              return;
            }
            
            setLoading(true);
            try {
              await resetPassword({
                token,
                password,
                password_confirmation: passwordConfirmation,
              });
              toast.success("Password berhasil diubah.");
              await navigate({ to: "/reset-password/sukses" });
            } catch (err) {
              const message =
                err instanceof ApiError
                  ? err.message
                  : err instanceof Error
                    ? err.message
                    : "Gagal mengubah password. Silakan coba lagi.";
              toast.error(message);
              console.error("[reset-password] failed:", err);
              // Clear password fields on error
              setPassword("");
              setPasswordConfirmation("");
            } finally {
              setLoading(false);
            }
          }}
        >
          <NotchedInput
            label="New Password"
            id="np"
            type={s1 ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            trailing={
              <button type="button" onClick={() => setS1((v) => !v)} aria-label="Toggle">
                {s1 ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
              </button>
            }
          />
          <NotchedInput
            label="Confirm Password"
            id="cp"
            type={s2 ? "text" : "password"}
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
            trailing={
              <button type="button" onClick={() => setS2((v) => !v)} aria-label="Toggle">
                {s2 ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
              </button>
            }
          />
          <PrimarySubmit disabled={loading}>
            {loading ? "Saving…" : "Save"}
          </PrimarySubmit>
        </form>
      </div>
    </AuthShell>
  );
}