import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { PrimarySubmit } from "@/components/auth/AuthShell";
import successImage from "@/assets/auth/reset-password-sukses.png";


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
        <div className="my-10 flex justify-center">
          <img
            src={successImage}
            alt="Password Updated Successfully"
            className="h-48 w-48 object-contain"
          />
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