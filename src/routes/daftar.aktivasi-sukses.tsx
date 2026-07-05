import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Mail, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/akun/aktivasi-sukses")({
  head: () => ({ meta: [{ title: "Aktivasi Berhasil — BahanMaterial.com" }] }),
  component: ActivationSuccessPage,
});

function ActivationSuccessPage() {
  return (
    <div className="relative overflow-hidden bg-background">
      {/* Decorative background blobs */}
      <div className="pointer-events-none absolute -left-16 top-10 h-56 w-56 rounded-full bg-emerald-100/60 blur-2xl" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-emerald-100/50 blur-2xl" />

      <div className="container mx-auto flex min-h-[calc(100vh-160px)] max-w-2xl flex-col items-center justify-center px-6 py-16 text-center">
        {/* Check circle with decorative dots */}
        <div className="relative mb-8">
          <span className="absolute -left-6 top-2 h-2 w-2 rounded-full bg-emerald-400" />
          <span className="absolute -right-4 -top-1 h-2.5 w-2.5 rounded-full bg-emerald-400" />
          <span className="absolute -left-10 bottom-2 h-2 w-2 rounded-full border-2 border-emerald-400" />
          <span className="absolute -right-8 bottom-3 text-emerald-400">✦</span>
          <div className="grid h-40 w-40 place-items-center rounded-full bg-emerald-50">
            <div className="grid h-28 w-28 place-items-center rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/30">
              <Check className="h-14 w-14 text-white" strokeWidth={3} />
            </div>
          </div>
        </div>

        <h1 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
          Akun Berhasil Teraktivasi!
        </h1>
        <p className="max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
          Terima kasih! Akun Anda telah berhasil diaktivasi. Sekarang Anda
          dapat masuk dan mulai menggunakan semua fitur yang tersedia.
        </p>

        {/* Info card */}
        <div className="mt-10 flex w-full max-w-md items-center gap-4 rounded-xl border border-emerald-200 bg-emerald-50/60 px-5 py-4 text-left">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-emerald-200 bg-white">
            <Mail className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <p className="font-semibold text-emerald-700">Akun Anda sudah aktif</p>
            <p className="text-sm text-muted-foreground">
              Nikmati pengalaman terbaik bersama kami.
            </p>
          </div>
        </div>

        {/* CTA */}
        <Link
          to="/masuk"
          className="mt-10 inline-flex w-full max-w-md items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-600"
        >
          Masuk ke Akun
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}