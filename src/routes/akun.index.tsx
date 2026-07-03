import { createFileRoute } from "@tanstack/react-router";
import { User, Mail, Phone, MapPin, Pencil } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/akun/")({
  head: () => ({ meta: [{ title: "Profil Saya — BahanMaterial.com" }] }),
  component: ProfilePage,
});

function ProfilePage() {
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
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, []);

  const userData = user || { name: "Guest", email: "", phone: null, created_at: "", role: "" };

  const joinedDate = userData.created_at
    ? new Date(userData.created_at).toLocaleDateString("id-ID", { month: "long", year: "numeric" })
    : "-";

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-border bg-card p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="grid h-20 w-20 place-items-center rounded-full bg-primary-soft text-primary">
              <User className="h-10 w-10" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-foreground">{userData.name}</h2>
              <p className="text-sm text-muted-foreground">Bergabung sejak {joinedDate}</p>
            </div>
          </div>
          <button className="inline-flex items-center gap-2 rounded-md border-2 border-primary px-4 py-2 text-sm font-bold text-primary hover:bg-primary/5">
            <Pencil className="h-4 w-4" /> Ubah Foto
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-foreground">Informasi Pribadi</h3>
          <button className="text-sm font-semibold text-primary hover:underline">Edit Profil</button>
        </div>
        <dl className="mt-5 grid gap-5 sm:grid-cols-2">
          <Field icon={User} label="Nama Lengkap" value={userData.name} />
          <Field icon={Mail} label="Email" value={userData.email} />
          <Field icon={Phone} label="Nomor HP" value={userData.phone || "-"} />
          <Field icon={MapPin} label="Role" value={userData.role || "-"} />
        </dl>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6">
        <h3 className="text-base font-bold text-foreground">Keamanan Akun</h3>
        <div className="mt-4 space-y-3">
          <Row label="Kata Sandi" value="Terakhir diubah 2 bulan lalu" action="Ubah" />
          <Row label="Verifikasi Nomor HP" value="Terverifikasi" action="Ganti Nomor" />
        </div>
      </section>
    </div>
  );
}

function Field({ icon: Icon, label, value }: { icon: typeof User; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 grid h-8 w-8 place-items-center rounded-md bg-muted text-muted-foreground">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
        <dd className="mt-0.5 text-sm font-semibold text-foreground">{value}</dd>
      </div>
    </div>
  );
}

function Row({ label, value, action }: { label: string; value: string; action: string }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-border px-4 py-3">
      <div>
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{value}</p>
      </div>
      <button className="text-sm font-semibold text-primary hover:underline">{action}</button>
    </div>
  );
}
