import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { PrimarySubmit } from "@/components/auth/AuthShell";

export const Route = createFileRoute("/reset-password/sukses")({
  head: () => ({ meta: [{ title: "Password Updated — BahanMaterial.com" }] }),
  component: SuccessPage,
});

function SuccessPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      <header className="px-6 pt-8 md:px-12">
        <BrandLogo />
      </header>
      <div className="container mx-auto flex max-w-xl flex-col items-center px-6 py-12 text-center">
        <h1 className="text-3xl font-extrabold text-primary">Congratulations</h1>
        <p className="mt-3 text-sm text-primary">
          You have updated the password
          <br />
          Please login again with your latest password
        </p>
        <div className="my-10 grid h-48 w-48 place-items-center rounded-full bg-accent-soft text-accent">
          <CheckCircle2 className="h-24 w-24" strokeWidth={1.5} />
        </div>
        <div className="w-full max-w-md">
          <PrimarySubmit type="button" onClick={() => navigate({ to: "/masuk" })}>
            Login
          </PrimarySubmit>
        </div>
      </div>
    </div>
  );
}