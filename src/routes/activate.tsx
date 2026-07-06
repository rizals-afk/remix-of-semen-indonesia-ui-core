import { useEffect, useRef } from "react";
import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { activateAccount } from "@/lib/auth";

export const Route = createFileRoute("/activate")({
  validateSearch: (search: Record<string, unknown>) => ({
    token: typeof search.token === "string" ? search.token : undefined,
  }),
  head: () => ({ meta: [{ title: "Aktivasi Akun — BahanMaterial.com" }] }),
  component: ActivatePage,
});

function ActivatePage() {
  const navigate = useNavigate();
  const { token } = useSearch({ from: "/activate" });
  const hasActivated = useRef(false);

  useEffect(() => {
    // Prevent duplicate requests in React Strict Mode
    if (hasActivated.current) return;
    hasActivated.current = true;

    const activate = async () => {
      // Redirect to failure page if no token is present
      if (!token) {
        await navigate({ to: "/akun/aktivasi-gagal" });
        return;
      }

      try {
        await activateAccount({ token });
        await navigate({ to: "/akun/aktivasi-sukses" });
      } catch (err) {
        console.error("[activate] failed:", err);
        await navigate({ to: "/akun/aktivasi-gagal" });
      }
    };

    activate();
  }, [token, navigate]);

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
            <div className="grid h-40 w-40 place-items-center rounded-full bg-emerald-50">
              <div className="grid h-28 w-28 place-items-center rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/30">
                <Loader2 className="h-14 w-14 text-white animate-spin" strokeWidth={2.5} />
              </div>
            </div>
          </div>

          <h1 className="mb-4 text-3xl font-bold text-primary md:text-4xl">
            Mengaktivasi Akun...
          </h1>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
            Mohon tunggu sebentar, kami sedang memproses aktivasi akun Anda.
          </p>
        </div>
      </div>
    </div>
  );
}
