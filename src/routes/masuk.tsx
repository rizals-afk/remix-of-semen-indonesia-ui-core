import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import {
  AuthShell,
  AuthIllustration,
  NotchedInput,
  PrimarySubmit,
  SocialAuthRow,
  AuthFooterLink,
} from "@/components/auth/AuthShell";

export const Route = createFileRoute("/masuk")({
  head: () => ({ meta: [{ title: "Sign In — BahanMaterial.com" }] }),
  component: SignInPage,
});

function SignInPage() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  return (
    <AuthShell illustration={<AuthIllustration tone="accent"><KeyRound className="h-32 w-32" strokeWidth={1.4} /></AuthIllustration>}>
      <div className="mx-auto max-w-md space-y-6">
        <header className="space-y-1">
          <h1 className="text-4xl font-extrabold text-primary">Sign In</h1>
          <p className="text-sm text-muted-foreground">Login to access your account</p>
        </header>

        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ to: "/" });
          }}
        >
          <NotchedInput label="Email" id="email" type="email" defaultValue="auliya@gmail.com" />
          <NotchedInput
            label="Password"
            id="password"
            type={show ? "text" : "password"}
            defaultValue="password123"
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

          <PrimarySubmit>Sign In</PrimarySubmit>
          <AuthFooterLink to="/daftar" prompt="Don’t have an account?">Sign up</AuthFooterLink>
        </form>

        <SocialAuthRow mode="login" />
      </div>
    </AuthShell>
  );
}