import { createFileRoute } from "@tanstack/react-router";
import { Award, HeartHandshake, ShieldCheck, Truck } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";

export const Route = createFileRoute("/tentang")({
  head: () => ({ meta: [{ title: "Tentang Kami — BahanMaterial.com" }] }),
  component: AboutPage,
});

const VALUES = [
  { icon: ShieldCheck, title: "Produk Asli & Bergaransi", text: "Semua material berasal langsung dari distributor resmi PT. Semen Indonesia Distributor." },
  { icon: Truck, title: "Pengiriman Terjadwal", text: "Armada terintegrasi mengirim dari gudang terdekat untuk efisiensi waktu dan biaya." },
  { icon: Award, title: "Kualitas Konsisten", text: "Standar kualitas terjaga, sesuai spesifikasi proyek perumahan hingga infrastruktur." },
  { icon: HeartHandshake, title: "Dukungan Profesional", text: "Tim sales dan admin siap membantu kebutuhan kontraktor, toko, dan konsumen akhir." },
];

function AboutPage() {
  return (
    <MainLayout user={{ name: "Auliya Gita Ananda" }}>
      <section className="container mx-auto max-w-7xl px-4 py-10">
        <div className="rounded-3xl bg-gradient-to-r from-primary to-[oklch(0.22_0.08_264)] p-8 text-primary-foreground md:p-12">
          <p className="text-xs font-bold uppercase tracking-widest text-accent">Tentang Kami</p>
          <h1 className="mt-2 text-3xl font-extrabold md:text-4xl">Mitra Material Bangunan Terpercaya</h1>
          <p className="mt-4 max-w-2xl text-sm text-primary-foreground/85">
            BahanMaterial.com adalah platform belanja material bangunan yang didukung oleh
            PT. Semen Indonesia Distributor. Kami menghadirkan pengalaman belanja material yang
            mudah, transparan, dan terpercaya — dari semen, bata, hingga kebutuhan finishing.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-bold text-primary">Visi Kami</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Menjadi marketplace material bangunan #1 di Indonesia yang menghubungkan distributor,
              toko, dan konsumen dengan layanan terbaik.
            </p>
          </article>
          <article className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-bold text-primary">Misi Kami</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              <li>Menyediakan material asli dengan harga distributor.</li>
              <li>Mengoptimalkan pengiriman dari gudang terdekat.</li>
              <li>Memberikan layanan pelanggan yang cepat dan profesional.</li>
            </ul>
          </article>
        </div>

        <h2 className="mt-12 text-center text-2xl font-extrabold text-primary">Mengapa BahanMaterial.com?</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v) => (
            <div key={v.title} className="rounded-2xl border border-border bg-card p-6 text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-accent-soft text-accent">
                <v.icon className="h-7 w-7" />
              </span>
              <h3 className="mt-4 text-base font-bold text-foreground">{v.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{v.text}</p>
            </div>
          ))}
        </div>
      </section>
    </MainLayout>
  );
}