import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  AuthShell,
  NotchedInput,
  PrimarySubmit,
} from "@/components/auth/AuthShell";
import forgotArt from "@/assets/auth/forgot.png.asset.json";

export const Route = createFileRoute("/lupa-password")({
  head: () => ({ meta: [{ title: "Forgot Password — BahanMaterial.com" }] }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const navigate = useNavigate();

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
            navigate({ to: "/reset-password/cek-email" });
          }}
        >
          <NotchedInput label="Email" id="recovery-email" type="email" defaultValue="auliya@gmail.com" />
          <PrimarySubmit>Send</PrimarySubmit>
        </form>
      </div>
    </AuthShell>
  );
}