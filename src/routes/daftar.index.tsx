import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { signup } from "@/lib/auth";
import { ApiError } from "@/lib/api";
import {
  AuthShell,
  NotchedInput,
  PrimarySubmit,
  SocialAuthRow,
  AuthFooterLink,
} from "@/components/auth/AuthShell";
import signupArt from "@/assets/auth/signup.png";

export const Route = createFileRoute("/daftar/")({
  head: () => ({ meta: [{ title: "Sign Up — BahanMaterial.com" }] }),
  component: SignUpPage,
});

function SignUpPage() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  return (
    <AuthShell
      reverse
      illustration={<img src={signupArt} alt="" className="mx-auto w-full max-w-md" />}
    >
      <div className="mx-auto max-w-xl space-y-6">
        <header className="space-y-1">
          <h1 className="text-4xl font-extrabold text-primary">Sign up</h1>
          <p className="text-sm text-muted-foreground">
            Let’s get you all set up so you can access your personal account.
          </p>
        </header>

        <form
          className="space-y-5"
          onSubmit={async (e) => {
            e.preventDefault();
            if (loading) return;
            
            // Client-side validation
            if (!name || !email || !phone || !password || !passwordConfirmation) {
              toast.error("Mohon lengkapi semua field yang diperlukan.");
              return;
            }
            
            if (password !== passwordConfirmation) {
              toast.error("Password dan konfirmasi password tidak cocok.");
              return;
            }
            
            setLoading(true);
            try {
              await signup({
                name,
                phone,
                email,
                password,
                password_confirmation: passwordConfirmation,
              });
              toast.success("Pendaftaran berhasil! Silakan cek email Anda.");
              await navigate({ to: "/daftar/cek-email" });
            } catch (err) {
              const message =
                err instanceof ApiError
                  ? err.message
                  : err instanceof Error
                    ? err.message
                    : "Pendaftaran gagal. Silakan coba lagi.";
              toast.error(message);
              console.error("[signup] failed:", err);
              // Clear password fields on error (following project convention)
              setPassword("");
              setPasswordConfirmation("");
            } finally {
              setLoading(false);
            }
          }}
        >
          <NotchedInput
            label="Nama Lengkap"
            id="nama"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <NotchedInput
              label="Email"
              id="email-su"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <NotchedInput
              label="Nomor Telepon"
              id="hp"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <NotchedInput
            label="Password"
            id="pass1"
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
          <NotchedInput
            label="Konfirmasi Password"
            id="pass2"
            type={show2 ? "text" : "password"}
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
            trailing={
              <button type="button" onClick={() => setShow2((v) => !v)} aria-label="Toggle password">
                {show2 ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
              </button>
            }
          />

          <label className="flex items-center gap-2 text-sm text-foreground">
            <input type="checkbox" required className="h-4 w-4 rounded border-border accent-primary" />
            <span>
              I agree to all the{" "}
              <Link to="/syarat" className="font-bold text-accent hover:underline">
                Terms &amp; Condition
              </Link>
            </span>
          </label>

          <PrimarySubmit disabled={loading}>
            {loading ? "Signing up…" : "Sign Up"}
          </PrimarySubmit>
          <AuthFooterLink to="/masuk" prompt="Already have an account?">Sign In</AuthFooterLink>
        </form>

        <SocialAuthRow mode="signup" />
      </div>
    </AuthShell>
  );
}