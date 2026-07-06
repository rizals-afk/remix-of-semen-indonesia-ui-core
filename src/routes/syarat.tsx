import { createFileRoute } from "@tanstack/react-router";
import { LegalPageLayout } from "@/components/common/LegalPageLayout";

export const Route = createFileRoute("/syarat")({
  head: () => ({ meta: [{ title: "Syarat & Ketentuan — BahanMaterial.com" }] }),
  component: TermsPage,
});

const SECTIONS: { id: string; title: string; items: string[] }[] = [
  {
    id: "ketentuan-umum",
    title: "1. Ketentuan Umum",
    items: [
      "Aplikasi ini digunakan untuk transaksi pembelian bahan material bangunan.",
      "Syarat dan ketentuan dapat berubah sewaktu-waktu tanpa pemberitahuan sebelumnya.",
      "Pengguna diharapkan membaca pembaruan secara berkala.",
    ],
  },
  {
    id: "pendaftaran-akun",
    title: "2. Persyaratan Pendaftaran Akun",
    items: [
      "Pengguna wajib memberikan data yang benar, lengkap, dan terbaru saat registrasi.",
      "Data yang wajib diisi antara lain: nama, email, nomor telepon, password, dan informasi lain yang diperlukan.",
      "Satu pengguna hanya diperbolehkan memiliki satu akun, kecuali diizinkan oleh pihak pengelola aplikasi.",
    ],
  },
  {
    id: "keamanan-akun",
    title: "3. Kerahasiaan Akun",
    items: [
      "Pengguna bertanggung jawab untuk menjaga kerahasiaan email, username, dan password.",
      "Segala aktivitas yang terjadi melalui akun pengguna merupakan tanggung jawab penuh pemilik akun.",
      "Pengelola aplikasi tidak bertanggung jawab atas penyalahgunaan akun akibat kelalaian pengguna.",
    ],
  },
  {
    id: "privasi",
    title: "4. Pengelolaan Data Pribadi",
    items: [
      "Data yang diberikan pengguna akan digunakan untuk keperluan verifikasi akun, proses transaksi, dan peningkatan layanan.",
      "Pengelola akan menjaga kerahasiaan data sesuai kebijakan privasi yang berlaku.",
      "Pengguna menyetujui bahwa sebagian data dapat digunakan untuk keperluan analisis dan pengembangan aplikasi.",
    ],
  },
  {
    id: "persetujuan",
    title: "5. Persetujuan",
    items: [
      "Dengan menekan tombol Daftar, pengguna menyatakan menyetujui seluruh Syarat dan Ketentuan ini.",
      "Menyetujui Kebijakan Privasi aplikasi.",
      "Bersedia bertanggung jawab atas seluruh aktivitas akun yang terdaftar.",
    ],
  },
];

function TermsPage() {
  const tableOfContents = SECTIONS.map((section) => ({
    id: section.id,
    title: section.title,
  }));

  return (
    <LegalPageLayout
      title="Syarat & Ketentuan"
      lastUpdated="July 5, 2026"
      breadcrumbPath={[
        { label: "Home", href: "/" },
        { label: "Terms & Conditions", href: "/syarat" },
      ]}
      showTableOfContents
      tableOfContents={tableOfContents}
    >
      <section className="mb-12">
        <h2 className="text-xl font-bold text-foreground mb-4">
          Syarat dan Ketentuan Pendaftaran Akun
        </h2>
        <p className="text-base leading-relaxed text-muted-foreground">
          Dengan melakukan pendaftaran akun pada aplikasi ini, pengguna dianggap telah membaca,
          memahami, dan menyetujui seluruh syarat dan ketentuan berikut:
        </p>
      </section>

      <div className="space-y-12">
        {SECTIONS.map((sec) => (
          <section key={sec.id} id={sec.id} className="scroll-mt-24">
            <h3 className="text-xl font-bold text-foreground mb-4">{sec.title}</h3>
            <ul className="space-y-3 pl-6">
              {sec.items.map((it) => (
                <li key={it} className="text-base leading-relaxed text-muted-foreground">
                  {it}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </LegalPageLayout>
  );
}