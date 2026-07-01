import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  AuthShell,
  NotchedInput,
  PrimarySubmit,
} from "@/components/auth/AuthShell";
import forgotArt from "@/assets/auth/forgot.png.asset.json";
import { OtpDialog } from "@/components/auth/OtpDialog";

export const Route = createFileRoute("/lupa-password")({
  head: () => ({ meta: [{ title: "Forgot Password — BahanMaterial.com" }] }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [stage, setStage] = useState<"form" | "verify" | "otp">("form");

  return (
    <AuthShell
      illustration={<img src={forgotArt.url} alt="" className="mx-auto w-full max-w-md" />}
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
          onSubmit={(e) => {
            e.preventDefault();
            setStage("verify");
          }}
        >
          <NotchedInput label="Email" id="recovery-email" type="email" defaultValue="auliya@gmail.com" />
          <PrimarySubmit>Send</PrimarySubmit>
        </form>
      </div>

      <OtpDialog
        open={stage === "verify"}
        onOpenChange={(v) => !v && setStage("form")}
        title="Verify your email"
        description="Please enter your the verification code that we have sent to your email"
        submitLabel="Verify"
        onSubmit={() => setStage("otp")}
      />
      <OtpDialog
        open={stage === "otp"}
        onOpenChange={(v) => !v && setStage("form")}
        title="OTP Verification"
        description="We sent a verification code to your email"
        submitLabel="Continue"
        onSubmit={() => {
          setStage("form");
          navigate({ to: "/reset-password" });
        }}
      />
    </AuthShell>
  );
}