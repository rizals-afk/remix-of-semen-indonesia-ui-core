import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, KeyRound } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";

export const Route = createFileRoute("/reset-password/cek-email")({
  head: () => ({ meta: [{ title: "Cek Email — BahanMaterial.com" }] }),
  component: ResetCheckEmailPage,
});

function ResetCheckEmailPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="px-6 pt-8 md:px-12">
        <BrandLogo />
      </header>
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-16 top-10 h-56 w-56 rounded-full bg-emerald-100/60 blur-2xl" />
        <div className="pointer-events-none absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-emerald-100/50 blur-2xl" />
        <div className="container mx-auto flex min-h-[calc(100vh-200px)] max-w-2xl flex-col items-center justify-center px-6 py-16 text-center">
          <div className="relative mb-8">
            <span className="absolute -left-6 top-2 h-2 w-2 rounded-full bg-emerald-400" />
            <span className="absolute -right-4 -top-1 h-2.5 w-2.5 rounded-full bg-emerald-400" />
            <div className="grid h-40 w-40 place-items-center rounded-full bg-emerald-50">
              <div className="grid h-28 w-28 place-items-center rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/30">
                <Mail className="h-14 w-14 text-white" strokeWidth={2.5} />
              </div>
            </div>
          </div>

          <h1 className="mb-4 text-3xl font-bold text-primary md:text-4xl">
            Email Reset Password Telah Dikirim
          </h1>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
            Kami telah mengirim link untuk mereset password ke email Anda.
            Silakan cek inbox (atau folder spam) dan klik link tersebut untuk
            membuat password baru.
          </p>

          {/*<div className="mt-10 w-full max-w-md space-y-3">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Simulasi klik link dari email
            </p>
            <Link
              to="/reset-password/"
              search={{ token: "demo-token" }}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-600"
            >
              <KeyRound className="h-5 w-5" />
              Buat Password Baru
            </Link>
          </div>*/}
        </div>
      </div>
    </div>
  );
}