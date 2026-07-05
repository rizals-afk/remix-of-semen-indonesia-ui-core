import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { forgotPassword } from "@/lib/auth";
import { ApiError } from "@/lib/api";
import {
  AuthShell,
  NotchedInput,
  PrimarySubmit,
} from "@/components/auth/AuthShell";
import forgotArt from "@/assets/auth/forgot.png";

export const Route = createFileRoute("/lupa-password")({
  head: () => ({ meta: [{ title: "Forgot Password — BahanMaterial.com" }] }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <AuthShell
      illustration={<img src={forgotArt} alt="" className="mx-auto w-full max-w-md" />}
    >
      <div className="mx-auto max-w-md space-y-6">
        <header className="space-y-2">
          <h1 className="text-4xl font-extrabold text-primary">Forgot your password?</h1>
          <p className="text-sm text-muted-foreground">
            Please enter your recovery email and follows the steps to complete
          </p>
        </header>

        <form
          className="space-y-5"
          onSubmit={async (e) => {
            e.preventDefault();
            if (loading) return;
            
            if (!email) {
              toast.error("Mohon masukkan email Anda.");
              return;
            }
            
            setLoading(true);
            try {
              await forgotPassword({ email });
              toast.success("Link reset password telah dikirim ke email Anda.");
              await navigate({ to: "/reset-password/cek-email" });
            } catch (err) {
              const message =
                err instanceof ApiError
                  ? err.message
                  : err instanceof Error
                    ? err.message
                    : "Gagal mengirim link reset password. Silakan coba lagi.";
              toast.error(message);
              console.error("[forgot-password] failed:", err);
            } finally {
              setLoading(false);
            }
          }}
        >
          <NotchedInput
            label="Email"
            id="recovery-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <PrimarySubmit disabled={loading}>
            {loading ? "Sending…" : "Send"}
          </PrimarySubmit>
        </form>
      </div>
    </AuthShell>
  );
}