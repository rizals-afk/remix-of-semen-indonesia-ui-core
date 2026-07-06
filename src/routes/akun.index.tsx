import { createFileRoute } from "@tanstack/react-router";
import { User } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/akun/")({
  head: () => ({ meta: [{ title: "Profil Saya — BahanMaterial.com" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const [identity, setIdentity] = useState<"NIK" | "NPWP">("NIK");
  const [name, setName] = useState("");
  const [nik, setNik] = useState("");
  const [npwp1, setNpwp1] = useState("");
  const [npwp2, setNpwp2] = useState("");
  const [user, setUser] = useState<{
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    role: string;
    is_active: boolean;
    branch_id: number | null;
    nik_ktp: string | null;
    birth_date: string | null;
    birth_place: string | null;
    phone: string | null;
    nip: string | null;
    photo: string | null;
    department: string | null;
    unit: string | null;
    last_login: string;
  } | null>(null);

  useEffect(() => {
    console.log("ProfilePage mounted, fetching user...");
    const fetchUser = async () => {
      try {
        console.log("Calling getCurrentUser...");
        const userData = await getCurrentUser<{
          id: number;
          name: string;
          email: string;
          email_verified_at: string | null;
          created_at: string;
          updated_at: string;
          role: string;
          is_active: boolean;
          branch_id: number | null;
          nik_ktp: string | null;
          birth_date: string | null;
          birth_place: string | null;
          phone: string | null;
          nip: string | null;
          photo: string | null;
          department: string | null;
          unit: string | null;
          last_login: string;
        }>();
        console.log("User data received:", userData);
        setUser(userData);
        setName(userData.name || "");
        setNik(userData.nik_ktp || "");
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, []);

  const userData = user || { name: "", email: "", phone: null };

  return (
    <section className="rounded-2xl border border-border bg-card p-6 md:p-8">
      <h2 className="text-lg font-bold text-foreground">
        Profil Pengguna (Personal atau Perusahaan)
      </h2>

      <div className="mt-6 grid gap-8 md:grid-cols-[200px_1fr]">
        <div className="flex flex-col items-center gap-3">
          <div className="grid h-36 w-36 place-items-center rounded-full bg-primary text-primary-foreground">
            <User className="h-20 w-20" />
          </div>
          <button
            type="button"
            className="rounded-md border border-border px-4 py-1.5 text-sm font-semibold text-foreground hover:bg-muted"
          >
            Pilih Gambar
          </button>
        </div>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="space-y-5"
        >
          <FormRow label="Nama Pengguna">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11"
            />
          </FormRow>

          <FormRow label="Email">
            <p className="pt-2 text-sm text-foreground">{userData.email || "-"}</p>
          </FormRow>

          <FormRow label="Nomor Telepon">
            <p className="pt-2 text-sm text-foreground">{userData.phone || "-"}</p>
          </FormRow>

          <FormRow label="Pilih Identitas">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIdentity("NIK")}
                aria-pressed={identity === "NIK"}
                className={
                  "grid h-6 w-6 place-items-center rounded border-2 " +
                  (identity === "NIK"
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-border bg-background")
                }
              >
                {identity === "NIK" ? "✓" : ""}
              </button>
              <div className="flex h-10 min-w-24 items-center rounded-md border border-input px-3 text-sm">
                NIK
              </div>
              <button
                type="button"
                onClick={() => setIdentity("NPWP")}
                aria-pressed={identity === "NPWP"}
                className={
                  "ml-3 grid h-6 w-6 place-items-center rounded border-2 " +
                  (identity === "NPWP"
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-border bg-background")
                }
              >
                {identity === "NPWP" ? "✓" : ""}
              </button>
              <div className="flex h-10 min-w-24 items-center rounded-md border border-input px-3 text-sm">
                NPWP
              </div>
            </div>
          </FormRow>

          {identity === "NIK" ? (
            <FormRow label={<>NIK<span className="text-destructive">*</span></>}>
              <Input
                value={nik}
                onChange={(e) => setNik(e.target.value)}
                className="h-11"
                placeholder="357830000000000"
              />
            </FormRow>
          ) : (
            <>
              <FormRow label={<>NPWP 1<span className="text-destructive">*</span></>}>
                <Input
                  value={npwp1}
                  onChange={(e) => setNpwp1(e.target.value)}
                  className="h-11"
                />
              </FormRow>
              <FormRow label="NPWP 2 (Jika ada)">
                <Input
                  value={npwp2}
                  onChange={(e) => setNpwp2(e.target.value)}
                  className="h-11"
                />
              </FormRow>
            </>
          )}

          <div className="flex justify-end pt-2">
            <Button type="submit" className="h-11 px-8 text-sm font-bold">
              Simpan
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}

function FormRow({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="grid items-start gap-2 sm:grid-cols-[160px_1fr] sm:gap-6">
      <label className="pt-2.5 text-sm font-medium text-foreground">{label}</label>
      <div>{children}</div>
    </div>
  );
}
