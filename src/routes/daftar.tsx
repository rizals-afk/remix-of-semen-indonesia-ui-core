import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import {
  AuthShell,
  NotchedInput,
  PrimarySubmit,
  SocialAuthRow,
  AuthFooterLink,
} from "@/components/auth/AuthShell";
import signupArt from "@/assets/auth/signup.png.asset.json";
import { OtpDialog } from "@/components/auth/OtpDialog";

export const Route = createFileRoute("/daftar")({
  head: () => ({ meta: [{ title: "Sign Up — BahanMaterial.com" }] }),
  component: SignUpPage,
});

function SignUpPage() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [step, setStep] = useState<"form" | "verify" | "otp">("form");

  return (
    <AuthShell
      reverse
      illustration={<img src={signupArt.url} alt="" className="mx-auto w-full max-w-md" />}
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
          onSubmit={(e) => {
            e.preventDefault();
            setStep("verify");
          }}
        >
          <NotchedInput label="Nama Lengkap" id="nama" defaultValue="Auliya Gita Ananda" />
          <NotchedInput label="No KTP" id="ktp" />
          <div className="grid gap-5 sm:grid-cols-2">
            <NotchedInput label="Email" id="email-su" type="email" />
            <NotchedInput label="Nomor Telepon" id="hp" />
          </div>
          <NotchedInput
            label="Password"
            id="pass1"
            type={show ? "text" : "password"}
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

          <PrimarySubmit>Sign Up</PrimarySubmit>
          <AuthFooterLink to="/masuk" prompt="Already have an account?">Sign In</AuthFooterLink>
        </form>

        <SocialAuthRow mode="signup" />
      </div>

      <OtpDialog
        open={step === "verify"}
        onOpenChange={(v) => !v && setStep("form")}
        title="Verify your email"
        description="Please enter your the verification code that we have sent to your email"
        submitLabel="Verify"
        onSubmit={() => setStep("otp")}
      />

      <OtpDialog
        open={step === "otp"}
        onOpenChange={(v) => !v && setStep("form")}
        title="OTP Verification"
        description="We sent a verification code to your email"
        submitLabel="Continue"
        onSubmit={() => {
          setStep("form");
          navigate({ to: "/masuk" });
        }}
      />
    </AuthShell>
  );
}