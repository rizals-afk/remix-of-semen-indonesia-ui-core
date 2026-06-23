import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/akun/ubah-password")({
  head: () => ({ meta: [{ title: "Ubah Password — BahanMaterial.com" }] }),
  component: ChangePasswordPage,
});

function ChangePasswordPage() {
  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-border bg-card p-6 md:p-8">
        <h2 className="text-base font-bold text-foreground">Ubah Password</h2>
        <form
          className="mt-6 space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <PasswordField id="old" label="Password Lama" />
          <PasswordField id="new" label="Password Baru" />
          <PasswordField id="confirm" label="Konfirmasi Password Baru" />

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="rounded-md bg-primary px-8 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90"
            >
              Simpan
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function PasswordField({ id, label }: { id: string; label: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-semibold text-foreground">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          className="h-11 w-full rounded-md border border-border bg-background px-3 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <button
          type="button"
          aria-label="Toggle password"
          onClick={() => setShow((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        >
          {show ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
}