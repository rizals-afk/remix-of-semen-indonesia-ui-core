import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { X, Clock, Mail } from "lucide-react";
import { OtpDialog } from "@/components/auth/OtpDialog";

export const Route = createFileRoute("/akun/aktivasi-gagal")({
  head: () => ({ meta: [{ title: "Aktivasi Gagal — BahanMaterial.com" }] }),
  component: ActivationFailedPage,
});

function ActivationFailedPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"idle" | "verify" | "otp">("idle");

  return (
    <div className="relative overflow-hidden bg-background">
      <div className="pointer-events-none absolute -left-16 top-10 h-56 w-56 rounded-full bg-rose-100/60 blur-2xl" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-rose-100/50 blur-2xl" />

      <div className="container mx-auto flex min-h-[calc(100vh-160px)] max-w-2xl flex-col items-center justify-center px-6 py-16 text-center">
        <div className="relative mb-8">
          <span className="absolute -left-6 top-2 h-2 w-2 rounded-full bg-rose-400" />
          <span className="absolute -right-4 -top-1 h-2.5 w-2.5 rounded-full bg-rose-400" />
          <span className="absolute -left-10 bottom-2 h-2 w-2 rounded-full border-2 border-rose-400" />
          <span className="absolute -right-8 bottom-3 text-rose-400">✕</span>
          <div className="grid h-40 w-40 place-items-center rounded-full bg-rose-50">
            <div className="grid h-28 w-28 place-items-center rounded-full bg-rose-500 shadow-lg shadow-rose-500/30">
              <X className="h-14 w-14 text-white" strokeWidth={3} />
            </div>
          </div>
        </div>

        <h1 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
          Aktivasi Gagal
        </h1>
        <p className="max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
          Link aktivasi ini sudah kedaluwarsa atau tidak valid. Silakan minta
          link aktivasi baru untuk melanjutkan.
        </p>

        <div className="mt-10 flex w-full max-w-md items-center gap-4 rounded-xl border border-rose-200 bg-rose-50/60 px-5 py-4 text-left">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-rose-200 bg-white">
            <Clock className="h-5 w-5 text-rose-600" />
          </div>
          <div>
            <p className="font-semibold text-rose-700">Link Expired</p>
            <p className="text-sm text-muted-foreground">
              Link aktivasi ini telah kedaluwarsa. Demi keamanan, link hanya
              berlaku selama 24 jam sejak email dikirim.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setStep("verify")}
          className="mt-8 inline-flex w-full max-w-md items-center justify-center gap-2 rounded-xl bg-rose-500 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-rose-500/30 transition hover:bg-rose-600"
        >
          <Mail className="h-5 w-5" />
          Kirim Ulang Link Aktivasi
        </button>

        <div className="my-5 flex w-full max-w-md items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          <span>atau</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <Link
          to="/masuk"
          className="inline-flex w-full max-w-md items-center justify-center rounded-xl border-2 border-rose-500 bg-background px-6 py-4 text-base font-semibold text-rose-500 transition hover:bg-rose-50"
        >
          Kembali ke Halaman Login
        </Link>
      </div>

      <OtpDialog
        open={step === "verify"}
        onOpenChange={(v) => !v && setStep("idle")}
        title="Verify your email"
        description="Please enter your the verification code that we have sent to your email"
        submitLabel="Verify"
        onSubmit={() => setStep("otp")}
      />

      <OtpDialog
        open={step === "otp"}
        onOpenChange={(v) => !v && setStep("idle")}
        title="OTP Verification"
        description="We sent a verification code to your email"
        submitLabel="Continue"
        onSubmit={() => {
          setStep("idle");
          navigate({ to: "/masuk" });
        }}
      />
    </div>
  );
}