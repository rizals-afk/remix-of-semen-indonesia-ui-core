import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import {
  AuthShell,
  NotchedInput,
  PrimarySubmit,
} from "@/components/auth/AuthShell";
import forgotArt from "@/assets/auth/forgot.png.asset.json";

export const Route = createFileRoute("/reset-password/")({
  head: () => ({ meta: [{ title: "Create New Password — BahanMaterial.com" }] }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [s1, setS1] = useState(false);
  const [s2, setS2] = useState(false);
  return (
    <AuthShell
      illustration={<img src={forgotArt.url} alt="" className="mx-auto w-full max-w-md" />}
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
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ to: "/reset-password/sukses" });
          }}
        >
          <NotchedInput
            label="New Password"
            id="np"
            type={s1 ? "text" : "password"}
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
            trailing={
              <button type="button" onClick={() => setS2((v) => !v)} aria-label="Toggle">
                {s2 ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
              </button>
            }
          />
          <PrimarySubmit>Save</PrimarySubmit>
        </form>
      </div>
    </AuthShell>
  );
}