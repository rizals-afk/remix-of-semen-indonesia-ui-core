import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { changePassword } from "@/lib/auth";
import { toast } from "sonner";
import { ApiError } from "@/lib/api";

export const Route = createFileRoute("/akun/ubah-password")({
  head: () => ({ meta: [{ title: "Ubah Password — BahanMaterial.com" }] }),
  component: ChangePasswordPage,
});

function ChangePasswordPage() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!oldPassword.trim()) {
      toast.error("Password lama harus diisi");
      return;
    }
    if (!newPassword.trim()) {
      toast.error("Password baru harus diisi");
      return;
    }
    if (!confirmPassword.trim()) {
      toast.error("Konfirmasi password harus diisi");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Password baru dan konfirmasi password tidak cocok");
      return;
    }

    setIsSubmitting(true);
    try {
      await changePassword({
        old_password: oldPassword,
        new_password: newPassword,
      });
      toast.success("Password berhasil diubah");
      // Clear all password fields
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Gagal mengubah password. Silakan coba lagi.";
      toast.error(message);
      console.error("Change password failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-border bg-card p-6 md:p-8">
        <h2 className="text-base font-bold text-foreground">Ubah Password</h2>
        <form
          className="mt-6 space-y-5"
          onSubmit={handleSubmit}
        >
          <PasswordField
            id="old"
            label="Password Lama"
            value={oldPassword}
            onChange={setOldPassword}
          />
          <PasswordField
            id="new"
            label="Password Baru"
            value={newPassword}
            onChange={setNewPassword}
          />
          <PasswordField
            id="confirm"
            label="Konfirmasi Password Baru"
            value={confirmPassword}
            onChange={setConfirmPassword}
          />

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-md bg-primary px-8 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan"
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function PasswordField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
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
          value={value}
          onChange={(e) => onChange(e.target.value)}
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