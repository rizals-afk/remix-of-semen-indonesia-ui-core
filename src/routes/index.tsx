import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import pengirimanImg from "@/assets/mengapa/pengiriman-tepat-waktu.png";
import hargaImg from "@/assets/mengapa/harga-terjangkau.png";
import produkImg from "@/assets/mengapa/product-lengkap.png";
import pemesananImg from "@/assets/mengapa/pemesanan-praktis.png";
import layananImg from "@/assets/mengapa/layanan-terpercaya.png";
import cerita1 from "@/assets/cerita/rectangle-3004.png";
import cerita2 from "@/assets/cerita/rectangle-3005.png";
import cerita3 from "@/assets/cerita/rectangle-3006.png";
import cerita4 from "@/assets/cerita/rectangle-3007.png";
import mitraSig from "@/assets/mitra/sig.png";
import mitraGresik from "@/assets/mitra/semen-gresik.png";
import mitraPadang from "@/assets/mitra/semen-padang.png";
import mitraTonasa from "@/assets/mitra/semen-tonasa.png";
import mitraDynamix from "@/assets/mitra/dynamix.png";
import mitraBlesscon from "@/assets/mitra/blesscon.png";
import mitraCiticon from "@/assets/mitra/citicon.png";
import mitraAplus from "@/assets/mitra/aplus-pacific.png";
import mitraGrand from "@/assets/mitra/grand-elephant.png";
import { BlogCard } from "@/components/common/BlogCard";
import { FeaturePill } from "@/components/common/FeaturePill";
import { PromoBanner } from "@/components/common/PromoBanner";
import { SectionTitle } from "@/components/common/SectionTitle";
import { MainLayout } from "@/components/layout/MainLayout";
import { CategoryTile } from "@/components/product/CategoryTile";
import { ProductCard } from "@/components/product/ProductCard";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { FEATURED_PRODUCTS } from "@/data/catalog";
import { getCurrentUserFromStorage } from "@/lib/auth";
import { fetchCategories, getChildCategories } from "@/lib/api/product-category";
import { fetchProducts, transformProductToCard } from "@/lib/api/product";
import { fetchBlogs } from "@/lib/api/blog";
import { fetchBanners, type Banner } from "@/lib/api/banner";
import type { ProductCategory } from "@/lib/api/product-category";
import { useWarehouse } from "@/store/warehouse";

const CERITA = [
  { loc: "Gresik", img: cerita1 },
  { loc: "Surabaya", img: cerita2 },
  { loc: "Sidoarjo", img: cerita3 },
  { loc: "Pasuruan", img: cerita4 },
];

const MITRA = [
  { name: "SIG", src: mitraSig },
  { name: "Semen Gresik", src: mitraGresik },
  { name: "Semen Padang", src: mitraPadang },
  { name: "Semen Tonasa", src: mitraTonasa },
  { name: "Dynamix", src: mitraDynamix },
  { name: "Blesscon", src: mitraBlesscon },
  { name: "Citicon", src: mitraCiticon },
  { name: "Aplus Pacific", src: mitraAplus },
  { name: "Grand Elephant", src: mitraGrand },
];

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
  const user = getCurrentUserFromStorage();
  const { selectedWarehouse } = useWarehouse();
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [bannersLoading, setBannersLoading] = useState(true);
  const [api, setApi] = useState<CarouselApi>();
  const pluginIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesResponse, productsResponse, blogsResponse, bannersResponse] = await Promise.all([
          fetchCategories({ per_page: 999, page: 1 }),
          fetchProducts({ page: 1, per_page: 6, sort: "terlaris", branch_id: selectedWarehouse?.id }),
          fetchBlogs({ page: 1, per_page: 3 }),
          fetchBanners({ per_page: 99, page: 1, is_website: 1, active: true }),
        ]);

        const childCategories = getChildCategories(categoriesResponse.data);
        setCategories(childCategories);

        const transformedProducts = productsResponse.data.map((product) =>
          transformProductToCard(product, selectedWarehouse?.name, undefined, selectedWarehouse?.id)
        );
        setFeaturedProducts(transformedProducts);

        setBlogs(blogsResponse.data);
        setBanners(bannersResponse.data);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
        setBannersLoading(false);
      }
    };

    loadData();
  }, [selectedWarehouse]);

  // Manual autoplay implementation
  useEffect(() => {
    if (!api || banners.length <= 1) return;

    pluginIntervalRef.current = setInterval(() => {
      api.scrollNext();
    }, 5000);

    return () => {
      if (pluginIntervalRef.current) {
        clearInterval(pluginIntervalRef.current);
      }
    };
  }, [api, banners.length]);

  return (
    <MainLayout user={user}>
      {/* HERO */}
      {bannersLoading ? (
        <section className="relative isolate">
          <div className="relative w-full overflow-hidden">
            <div className="h-[360px] w-full bg-muted animate-pulse md:h-[520px] lg:h-[600px]" />
          </div>
        </section>
      ) : banners.length > 0 ? (
        <section className="relative isolate">
          {banners.length === 1 ? (
            <div className="relative w-full overflow-hidden">
              <img
                src={banners[0].photo}
                alt={banners[0].title}
                width={1920}
                height={768}
                className="h-[360px] w-full object-cover md:h-[520px] lg:h-[600px]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />
              <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto max-w-7xl px-6 md:px-12">
                  <div className="max-w-xl space-y-5 text-white">
                    <h1 className="text-4xl font-bold leading-tight md:text-6xl">
                      {banners[0].title}
                    </h1>
                    <Link
                      to="/produk"
                      className="inline-block rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 md:text-base"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Carousel
              className="relative w-full"
              opts={{
                loop: true,
              }}
              setApi={setApi}
            >
              <CarouselContent>
                {banners.map((banner) => (
                  <CarouselItem key={banner.id}>
                    <div className="relative w-full overflow-hidden">
                      <img
                        src={banner.photo}
                        alt={banner.title}
                        width={1920}
                        height={768}
                        className="h-[360px] w-full object-cover md:h-[520px] lg:h-[600px]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />
                      <div className="absolute inset-0 flex items-center">
                        <div className="container mx-auto max-w-7xl px-6 md:px-12">
                          <div className="max-w-xl space-y-5 text-white">
                            <h1 className="text-4xl font-bold leading-tight md:text-6xl">
                              {banner.title}
                            </h1>
                            <Link
                              to="/produk"
                              className="inline-block rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 md:text-base"
                            >
                              Learn More
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-4 top-1/2 -translate-y-1/2" />
              <CarouselNext className="hidden md:flex -right-4 top-1/2 -translate-y-1/2" />
            </Carousel>
          )}
        </section>
      ) : null}

      {/* KATEGORI PRODUK */}
      <section className="container mx-auto max-w-7xl px-4 py-12">
        <SectionTitle>Kategori Produk</SectionTitle>
        {loading ? (
          <div className="mt-8 grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <div key={i} className="aspect-square rounded-xl border border-border bg-muted animate-pulse" />
            ))}
          </div>
        ) : categories.length > 0 ? (
          <div className="mt-8 grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9">
            {categories.map((cat) => (
              <CategoryTile key={cat.id} category={cat} />
            ))}
          </div>
        ) : (
          <div className="mt-8 text-center text-sm text-muted-foreground">
            Tidak ada kategori tersedia.
          </div>
        )}
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
        <div className="flex items-center justify-between">
          <SectionTitle>Material Pilihan</SectionTitle>
          <Link
            to="/produk"
            search={{ sort: "terlaris" }}
            className="text-sm font-semibold text-primary hover:text-primary/80"
          >
            Lihat Selengkapnya →
          </Link>
        </div>
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
          {loading ? (
            [1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-[4/3] rounded-xl border border-border bg-muted animate-pulse" />
            ))
          ) : featuredProducts.length > 0 ? (
            featuredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))
          ) : (
            <div className="col-span-full text-center text-sm text-muted-foreground">
              Tidak ada produk tersedia.
            </div>
          )}
        </div>
      </section>

      {/* MENGAPA */}
      <section className="container mx-auto max-w-7xl px-4 py-12">
        <SectionTitle>Mengapa Belanja di Bahan Material?</SectionTitle>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-5">
          <FeaturePill image={pengirimanImg} label="Pengiriman Tepat Waktu" />
          <FeaturePill image={hargaImg} label="Harga Terjangkau" />
          <FeaturePill image={produkImg} label="Produk Lengkap & Berkualitas" />
          <FeaturePill image={pemesananImg} label="Pemesanan Praktis" />
          <FeaturePill image={layananImg} label="Layanan Terpercaya" />
        </div>
      </section>

      {/* CERITA DARI MEREKA */}
      <section className="container mx-auto max-w-7xl px-4 py-12">
        <SectionTitle>Cerita dari Mereka</SectionTitle>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {CERITA.map(({ loc, img }) => (
            <div
              key={loc}
              className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-muted"
            >
              <img
                src={img}
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
          <div className="mt-6 grid grid-cols-3 items-center justify-items-center gap-6 sm:grid-cols-5 md:grid-cols-9">
            {MITRA.map((m) => (
              <img
                key={m.name}
                src={m.src}
                alt={m.name}
                loading="lazy"
                className="h-14 w-auto max-w-[110px] object-contain"
              />
            ))}
          </div>
        </div>
      </section>

      {/* BLOG */}
      <section className="container mx-auto max-w-7xl px-4 py-12">
        <div className="flex items-center justify-between">
          <SectionTitle>Blog & Inspirasi</SectionTitle>
          <Link to="/blog" search={{ q: undefined, page: 1 }} className="text-sm font-semibold text-primary hover:text-primary/80">
            Selengkapnya →
          </Link>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {loading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="aspect-[16/10] rounded-xl border border-border bg-muted animate-pulse" />
            ))
          ) : blogs.length > 0 ? (
            blogs.map((blog) => (
              <BlogCard key={blog.id} post={blog} />
            ))
          ) : (
            <div className="col-span-full text-center text-sm text-muted-foreground">
              Tidak ada blog tersedia.
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
}
