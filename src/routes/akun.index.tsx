import { createFileRoute } from "@tanstack/react-router";
import { User, Camera, Loader2 } from "lucide-react";
import { getCurrentUser, uploadFile, updateProfile } from "@/lib/auth";
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/akun/")({
  head: () => ({ meta: [{ title: "Profil Saya — BahanMaterial.com" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [identity, setIdentity] = useState<"NIK" | "NPWP">("NIK");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [nik, setNik] = useState("");
  const [npwp1, setNpwp1] = useState("");
  const [npwp2, setNpwp2] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
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
    company: string | null;
    is_nik: boolean;
    npwp_1: string | null;
    npwp_2: string | null;
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
          company: string | null;
          is_nik: boolean;
          npwp_1: string | null;
          npwp_2: string | null;
        }>();
        console.log("User data received:", userData);
        setUser(userData);
        setName(userData.name || "");
        setCompany(userData.company || "");
        setBirthDate(userData.birth_date || "");
        setBirthPlace(userData.birth_place || "");
        setNik(userData.nik_ktp || "");
        setNpwp1(userData.npwp_1 || "");
        setNpwp2(userData.npwp_2 || "");
        setPhoto(userData.photo || null);
        setIdentity(userData.is_nik ? "NIK" : "NPWP");
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, []);

  const userData = user || { name: "", email: "", phone: null, company: null, birth_date: null, birth_place: null, is_nik: true };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const response = await uploadFile(file);
      setPhoto(response.url);
      toast.success("Foto berhasil diunggah");
    } catch (err) {
      toast.error("Gagal mengunggah foto");
      console.error("Upload failed:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await updateProfile({
        name,
        company,
        birth_date: birthDate,
        birth_place: birthPlace,
        nik_ktp: identity === "NIK" ? nik : undefined,
        npwp_1: identity === "NPWP" ? npwp1 : undefined,
        npwp_2: identity === "NPWP" ? npwp2 : undefined,
        photo: photo || undefined,
        is_nik: identity === "NIK",
      });
      toast.success("Profil berhasil diperbarui");
    } catch (err) {
      toast.error("Gagal memperbarui profil");
      console.error("Update failed:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="rounded-2xl border border-border bg-card p-6 md:p-8">
      <h2 className="text-lg font-bold text-foreground">
        Profil Pengguna (Personal atau Perusahaan)
      </h2>

      <div className="mt-6 grid gap-8 md:grid-cols-[200px_1fr]">
        <div className="flex flex-col items-center gap-3">
          <div className="relative h-36 w-36 overflow-hidden rounded-full bg-muted">
            {photo ? (
              <img
                src={photo}
                alt="Profile"
                className="h-full w-full object-contain p-2"
              />
            ) : (
              <div className="grid h-full w-full place-items-center bg-primary text-primary-foreground">
                <User className="h-20 w-20" />
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-2 rounded-md border border-border px-4 py-1.5 text-sm font-semibold text-foreground hover:bg-muted disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Mengunggah...
              </>
            ) : (
              <>
                <Camera className="h-4 w-4" />
                Pilih Gambar
              </>
            )}
          </button>
        </div>

        <form
          onSubmit={handleSave}
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

          <FormRow label="Perusahaan">
            <Input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="h-11"
              placeholder="Nama perusahaan"
            />
          </FormRow>

          <FormRow label="Tanggal Lahir">
            <Input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="h-11"
            />
          </FormRow>

          <FormRow label="Tempat Lahir">
            <Input
              value={birthPlace}
              onChange={(e) => setBirthPlace(e.target.value)}
              className="h-11"
              placeholder="Kota kelahiran"
            />
          </FormRow>

          <FormRow label="Jenis Identitas">
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
            <FormRow label="NIK">
              <Input
                value={nik}
                onChange={(e) => setNik(e.target.value)}
                className="h-11"
                placeholder="357830000000000"
              />
            </FormRow>
          ) : (
            <>
              <FormRow label="NPWP 1">
                <Input
                  value={npwp1}
                  onChange={(e) => setNpwp1(e.target.value)}
                  className="h-11"
                />
              </FormRow>
              <FormRow label="Nama NPWP">
                <Input
                  value={npwp2}
                  onChange={(e) => setNpwp2(e.target.value)}
                  className="h-11"
                />
              </FormRow>
            </>
          )}

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={isSaving} className="h-11 px-8 text-sm font-bold">
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan"
              )}
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
