import { createFileRoute } from "@tanstack/react-router";
import { MainLayout } from "@/components/layout/MainLayout";

export const Route = createFileRoute("/syarat")({
  head: () => ({ meta: [{ title: "Syarat & Ketentuan — BahanMaterial.com" }] }),
  component: TermsPage,
});

const SECTIONS: { title: string; items: string[] }[] = [
  {
    title: "1. Ketentuan Umum",
    items: [
      "Aplikasi ini digunakan untuk transaksi pembelian bahan material bangunan.",
      "Syarat dan ketentuan dapat berubah sewaktu-waktu tanpa pemberitahuan sebelumnya.",
      "Pengguna diharapkan membaca pembaruan secara berkala.",
    ],
  },
  {
    title: "2. Persyaratan Pendaftaran Akun",
    items: [
      "Pengguna wajib memberikan data yang benar, lengkap, dan terbaru saat registrasi.",
      "Data yang wajib diisi antara lain: nama, email, nomor telepon, password, dan informasi lain yang diperlukan.",
      "Satu pengguna hanya diperbolehkan memiliki satu akun, kecuali diizinkan oleh pihak pengelola aplikasi.",
    ],
  },
  {
    title: "3. Kerahasiaan Akun",
    items: [
      "Pengguna bertanggung jawab untuk menjaga kerahasiaan email, username, dan password.",
      "Segala aktivitas yang terjadi melalui akun pengguna merupakan tanggung jawab penuh pemilik akun.",
      "Pengelola aplikasi tidak bertanggung jawab atas penyalahgunaan akun akibat kelalaian pengguna.",
    ],
  },
  {
    title: "4. Pengelolaan Data Pribadi",
    items: [
      "Data yang diberikan pengguna akan digunakan untuk keperluan verifikasi akun, proses transaksi, dan peningkatan layanan.",
      "Pengelola akan menjaga kerahasiaan data sesuai kebijakan privasi yang berlaku.",
      "Pengguna menyetujui bahwa sebagian data dapat digunakan untuk keperluan analisis dan pengembangan aplikasi.",
    ],
  },
  {
    title: "5. Persetujuan",
    items: [
      "Dengan menekan tombol Daftar, pengguna menyatakan menyetujui seluruh Syarat dan Ketentuan ini.",
      "Menyetujui Kebijakan Privasi aplikasi.",
      "Bersedia bertanggung jawab atas seluruh aktivitas akun yang terdaftar.",
    ],
  },
];

function TermsPage() {
  return (
    <MainLayout user={{ name: "Auliya Gita Ananda" }}>
      <section className="container mx-auto max-w-4xl px-4 py-10">
        <div className="rounded-2xl border border-border bg-card p-6 md:p-10">
          <h1 className="text-center text-2xl font-extrabold text-primary md:text-3xl">
            Syarat &amp; Ketentuan
          </h1>
          <div className="mt-6 space-y-5">
            <div>
              <h2 className="text-base font-bold text-primary">Syarat dan Ketentuan Pendaftaran Akun</h2>
              <p className="mt-1 text-sm text-primary">
                Dengan melakukan pendaftaran akun pada aplikasi ini, pengguna dianggap telah membaca,
                memahami, dan menyetujui seluruh syarat dan ketentuan berikut:
              </p>
            </div>
            {SECTIONS.map((sec) => (
              <section key={sec.title}>
                <h3 className="text-sm font-bold text-primary">{sec.title}</h3>
                <ul className="mt-2 list-disc space-y-1 pl-6 text-sm text-primary/90">
                  {sec.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}