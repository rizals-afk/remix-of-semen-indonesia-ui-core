import { createFileRoute } from "@tanstack/react-router";
import {
  BadgeCheck,
  Boxes,
  ClipboardCheck,
  ShieldCheck,
  Truck,
  Wallet,
} from "lucide-react";
import heroImage from "@/assets/hero-construction.jpg";
import { BlogCard } from "@/components/common/BlogCard";
import { FeaturePill } from "@/components/common/FeaturePill";
import { PromoBanner } from "@/components/common/PromoBanner";
import { SectionTitle } from "@/components/common/SectionTitle";
import { MainLayout } from "@/components/layout/MainLayout";
import { CategoryTile } from "@/components/product/CategoryTile";
import { ProductCard } from "@/components/product/ProductCard";
import { BLOG_POSTS, CATEGORIES, FEATURED_PRODUCTS, PARTNER_BRANDS } from "@/data/catalog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BahanMaterial.com — The Best Partner in Building Material" },
      {
        name: "description",
        content:
          "Distributor resmi material bangunan PT Semen Indonesia: semen, bata ringan, baja ringan, atap, sanitari, dan kebutuhan proyek lainnya dengan harga terjangkau dan pengiriman tepat waktu.",
      },
      { property: "og:title", content: "BahanMaterial.com" },
      { property: "og:description", content: "The Best Partner in Building Material" },
    ],
  }),
  component: HomePage,
});

const TABS = ["Terlaris", "Promo Spesial", "Baru Masuk"] as const;

function HomePage() {
  return (
    <MainLayout>
      {/* HERO */}
      <section className="relative isolate">
        <div className="container mx-auto max-w-7xl px-4 pt-4">
          <div className="relative overflow-hidden rounded-2xl">
            <img
              src={heroImage}
              alt="Tim konstruksi profesional menggunakan material bangunan berkualitas"
              width={1920}
              height={768}
              className="h-[260px] w-full object-cover md:h-[400px]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent" />
            <div className="absolute inset-0 flex items-center px-6 md:px-12">
              <div className="max-w-lg space-y-4 text-white">
                <h1 className="text-3xl font-bold leading-tight md:text-5xl">
                  The Best Partner in
                  <br />
                  Building Material
                </h1>
                <button
                  type="button"
                  className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KATEGORI PRODUK */}
      <section className="container mx-auto max-w-7xl px-4 py-12">
        <SectionTitle>Kategori Produk</SectionTitle>
        <div className="mt-8 grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9">
          {CATEGORIES.map((cat) => (
            <CategoryTile key={cat.slug} category={cat} />
          ))}
        </div>
      </section>

      {/* PROMO BANNERS */}
      <section className="container mx-auto max-w-7xl space-y-4 px-4">
        <PromoBanner
          tone="lavender"
          title="Material Bangunan Lengkap"
          description="Semen, bata ringan, pasir, dan kebutuhan proyek lainnya tersedia di sini!"
        />
        <PromoBanner
          tone="peach"
          title="Semen Berkualitas Tinggi"
          description="Pilihan terbaik untuk bangunan kokoh dan tahan lama."
        />
      </section>

      {/* MATERIAL PILIHAN */}
      <section className="container mx-auto max-w-7xl px-4 py-12">
        <SectionTitle>Material Pilihan</SectionTitle>
        <div className="mt-6 flex items-center justify-center gap-8 border-b border-border">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              type="button"
              className={
                "relative pb-3 text-sm font-semibold transition-colors " +
                (i === 0
                  ? "text-accent after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-accent"
                  : "text-muted-foreground hover:text-foreground")
              }
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED_PRODUCTS.slice(0, 6).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* MENGAPA */}
      <section className="container mx-auto max-w-7xl px-4 py-12">
        <SectionTitle>Mengapa Belanja di Bahan Material?</SectionTitle>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-5">
          <FeaturePill icon={Truck} label="Pengiriman Tepat Waktu" />
          <FeaturePill icon={Wallet} label="Harga Terjangkau" />
          <FeaturePill icon={Boxes} label="Produk Lengkap & Berkualitas" />
          <FeaturePill icon={ClipboardCheck} label="Pemesanan Praktis" />
          <FeaturePill icon={ShieldCheck} label="Layanan Terpercaya" />
        </div>
      </section>

      {/* CERITA DARI MEREKA */}
      <section className="container mx-auto max-w-7xl px-4 py-12">
        <SectionTitle>Cerita dari Mereka</SectionTitle>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {["Gresik", "Surabaya", "Sidoarjo", "Pasuruan"].map((loc) => (
            <div
              key={loc}
              className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-muted"
            >
              <img
                src="https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=600&q=70"
                alt={`Proyek ${loc}`}
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground">
                <BadgeCheck className="h-3.5 w-3.5" /> Proyek {loc}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* MITRA BRAND */}
      <section className="bg-primary-soft py-10">
        <div className="container mx-auto max-w-7xl px-4">
          <SectionTitle>Mitra Brand Terpercaya</SectionTitle>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {PARTNER_BRANDS.map((brand) => (
              <span
                key={brand}
                className="text-sm font-bold uppercase tracking-wide text-primary/70"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* BLOG */}
      <section className="container mx-auto max-w-7xl px-4 py-12">
        <SectionTitle>Blog & Inspirasi</SectionTitle>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {BLOG_POSTS.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </MainLayout>
  );
}
