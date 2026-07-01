import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { login } from "@/lib/auth";
import { ApiError } from "@/lib/api";
import {
  AuthShell,
  NotchedInput,
  PrimarySubmit,
  SocialAuthRow,
  AuthFooterLink,
} from "@/components/auth/AuthShell";
import loginArt from "@/assets/auth/login.png.asset.json";

export const Route = createFileRoute("/masuk")({
  head: () => ({ meta: [{ title: "Sign In — BahanMaterial.com" }] }),
  component: SignInPage,
});

function SignInPage() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("testadmin@email.com");
  const [password, setPassword] = useState("testadmin");
  const [loading, setLoading] = useState(false);

  return (
    <AuthShell illustration={<img src={loginArt.url} alt="" className="mx-auto w-full max-w-md" />}>
      <div className="mx-auto max-w-md space-y-6">
        <header className="space-y-1">
          <h1 className="text-4xl font-extrabold text-primary">Sign In</h1>
          <p className="text-sm text-muted-foreground">Login to access your account</p>
        </header>

        <form
          className="space-y-5"
          onSubmit={async (e) => {
            e.preventDefault();
            if (loading) return;
            setLoading(true);
            try {
              await login({ email, password });
              toast.success("Login berhasil");
              navigate({ to: "/" });
            } catch (err) {
              const message =
                err instanceof ApiError
                  ? err.message
                  : err instanceof Error
                    ? err.message
                    : "Login gagal. Silakan coba lagi.";
              toast.error(message);
            } finally {
              setLoading(false);
            }
          }}
        >
          <NotchedInput
            label="Email"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <NotchedInput
            label="Password"
            id="password"
            type={show ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            trailing={
              <button type="button" onClick={() => setShow((v) => !v)} aria-label="Toggle password">
                {show ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
              </button>
            }
          />

          <div className="flex items-center justify-between text-sm">
            <label className="inline-flex items-center gap-2 text-foreground">
              <input type="checkbox" className="h-4 w-4 rounded border-border accent-primary" />
              Remember me?
            </label>
            <Link to="/lupa-password" className="font-bold text-destructive hover:underline">
              Forgot Password
            </Link>
          </div>

          <PrimarySubmit disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
          </PrimarySubmit>
          <AuthFooterLink to="/daftar" prompt="Don’t have an account?">Sign up</AuthFooterLink>
        </form>

        <SocialAuthRow mode="login" />
      </div>
    </AuthShell>
  );
}