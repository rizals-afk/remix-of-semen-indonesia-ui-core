import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ChevronRight, MapPin, Percent, Zap } from "lucide-react";
import flashSaleMaterials from "@/assets/flash-sale-materials.png";
import { MainLayout } from "@/components/layout/MainLayout";
import { ProductCard, type Product } from "@/components/product/ProductCard";
import { Pagination } from "@/components/common/Pagination";
import { FEATURED_PRODUCTS } from "@/data/catalog";
import { getCurrentUserFromStorage } from "@/lib/auth";

export const Route = createFileRoute("/flashsale")({
  head: () => ({
    meta: [
      { title: "Flash Sale Material Bangunan — BahanMaterial.com" },
      {
        name: "description",
        content: "Temukan harga spesial material bangunan pilihan selama persediaan flash sale masih tersedia.",
      },
      { property: "og:title", content: "Flash Sale Material Bangunan — BahanMaterial.com" },
      {
        property: "og:description",
        content: "Harga spesial untuk berbagai kebutuhan material bangunan.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FlashSalePage,
});

const PAGE_SIZE = 8;
const SALE_PRODUCTS: Product[] = [
  { ...FEATURED_PRODUCTS[0], id: "flash-semen-gresik", name: "Semen Gresik", price: 59800, originalPrice: 74800, discountPercent: 20, warehouse: "Gudang Gresik" },
  { ...FEATURED_PRODUCTS[1], id: "flash-closet-minimalis", name: "Closet Duduk Minimalis", price: 72233, originalPrice: 84000, discountPercent: 14, warehouse: "Gudang Surabaya" },
  { ...FEATURED_PRODUCTS[2], id: "flash-mortar-perekat", name: "Mortar Perekat", price: 63185, originalPrice: 76100, discountPercent: 17, warehouse: "Gudang Madiun" },
  { ...FEATURED_PRODUCTS[3], id: "flash-atap-upvc", name: "Atap UPVC", price: 63185, originalPrice: 65800, discountPercent: 4, warehouse: "Gudang Madiun" },
  { ...FEATURED_PRODUCTS[4], id: "flash-kanal-c", name: "Kanal C", price: 59800, originalPrice: 65700, discountPercent: 9, warehouse: "Gudang Gresik" },
  { ...FEATURED_PRODUCTS[6], id: "flash-semen-merdeka", name: "Semen Merdeka", price: 72233, originalPrice: 77780, discountPercent: 7, warehouse: "Gudang Surabaya" },
  { ...FEATURED_PRODUCTS[1], id: "flash-bata-merah", name: "Bata Merah", price: 63185, originalPrice: 64470, discountPercent: 2, warehouse: "Gudang Madiun" },
  { ...FEATURED_PRODUCTS[5], id: "flash-besi-meteran", name: "Besi Meteran", price: 63185, originalPrice: 71000, discountPercent: 11, warehouse: "Gudang Madiun" },
  { ...FEATURED_PRODUCTS[0], id: "flash-semen-pcc", name: "Semen Portland Komposit", price: 61500, originalPrice: 73800, discountPercent: 17, warehouse: "Gudang Sidoarjo" },
  { ...FEATURED_PRODUCTS[3], id: "flash-lem-bata-ringan", name: "Perekat Bata Ringan", price: 68500, originalPrice: 76000, discountPercent: 10, warehouse: "Gudang Surabaya" },
  { ...FEATURED_PRODUCTS[4], id: "flash-baja-ringan", name: "Baja Ringan Kanal C", price: 87500, originalPrice: 99500, discountPercent: 12, warehouse: "Gudang Gresik" },
  { ...FEATURED_PRODUCTS[2], id: "flash-mortar-plester", name: "Mortar Plester", price: 59000, originalPrice: 69500, discountPercent: 15, warehouse: "Gudang Madiun" },
];

const FLASH_SALES = [
  { id: "material-pilihan", title: "Material Pilihan", endsIn: 22 * 60 * 60 + 44 * 60 + 8, discount: "Hemat hingga 20%" },
  { id: "kebutuhan-proyek", title: "Kebutuhan Proyek", endsIn: 9 * 60 * 60 + 12 * 60 + 38, discount: "Harga spesial terbatas" },
];

function FlashSalePage() {
  const user = getCurrentUserFromStorage();

  return (
    <MainLayout user={user}>
      <div className="bg-background">
        <section className="bg-primary-soft">
          <div className="container mx-auto flex min-h-[250px] max-w-7xl items-center justify-between gap-4 overflow-hidden px-4 py-8 md:min-h-[280px] md:px-8">
            <div className="relative z-10 max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-background/80 px-3 py-1.5 text-sm font-semibold text-primary">
                <Percent className="h-4 w-4 text-accent" /> Promo spesial bulan ini
              </div>
              <h1 className="max-w-xl text-3xl font-bold leading-tight text-primary md:text-4xl">
                Promo Spesial Bahan Material
              </h1>
              <p className="mt-3 max-w-2xl text-base text-primary md:text-lg">
                Dapatkan potongan harga hingga 40% untuk berbagai jenis semen dan kebutuhan material lainnya. Hanya berlaku bulan ini!
              </p>
            </div>
            <img
              src={flashSaleMaterials}
              alt="Pilihan material bangunan untuk flash sale"
              width={1104}
              height={640}
              className="hidden w-[42%] shrink-0 object-contain md:block"
            />
          </div>
        </section>

        <nav aria-label="Breadcrumb" className="container mx-auto max-w-7xl px-4 pt-6 text-sm text-muted-foreground">
          <ol className="flex items-center gap-2">
            <li><Link to="/" className="hover:text-primary">Beranda</Link></li>
            <li aria-hidden="true"><ChevronRight className="h-4 w-4" /></li>
            <li className="font-medium text-foreground">Flash Sale</li>
          </ol>
        </nav>

        <div className="container mx-auto max-w-7xl space-y-12 px-4 py-7 md:py-10">
          {FLASH_SALES.map((sale, index) => (
            <FlashSaleSection key={sale.id} sale={sale} productOffset={index * 2} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}

function FlashSaleSection({
  sale,
  productOffset,
}: {
  sale: (typeof FLASH_SALES)[number];
  productOffset: number;
}) {
  const [page, setPage] = useState(1);
  const [secondsLeft, setSecondsLeft] = useState(sale.endsIn);
  const saleProducts = useMemo(
    () => [...SALE_PRODUCTS.slice(productOffset), ...SALE_PRODUCTS.slice(0, productOffset)],
    [productOffset],
  );
  const pageCount = Math.ceil(saleProducts.length / PAGE_SIZE);
  const visibleProducts = saleProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsLeft((current) => Math.max(current - 1, 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const hours = Math.floor(secondsLeft / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;

  return (
    <section aria-labelledby={`${sale.id}-title`}>
      <div className="mb-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-3 text-primary md:justify-start">
        <Zap className="h-8 w-8 fill-warning text-warning md:h-10 md:w-10" />
        <h2 id={`${sale.id}-title`} className="text-2xl font-bold md:text-3xl">Flash Sale</h2>
        <span className="text-sm font-medium md:text-base">Berakhir dalam</span>
        <div className="flex items-center gap-1.5" aria-label={`${hours} jam ${minutes} menit ${seconds} detik`}>
          <TimeUnit value={hours} />
          <span className="text-xl font-bold">:</span>
          <TimeUnit value={minutes} />
          <span className="text-xl font-bold">:</span>
          <TimeUnit value={seconds} />
        </div>
      </div>

      <div className="mb-5 flex items-center justify-between gap-3 border-b border-border pb-3">
        <div>
          <h3 className="text-lg font-bold text-foreground">{sale.title}</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">{sale.discount}</p>
        </div>
        <span className="hidden items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1.5 text-xs font-semibold text-accent sm:inline-flex">
          <MapPin className="h-3.5 w-3.5" /> Berlaku di beberapa gudang
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {visibleProducts.map((product) => <ProductCard key={product.id} product={product} compact />)}
      </div>

      {pageCount > 1 ? (
        <div className="mt-7">
          <Pagination page={page} totalPages={pageCount} onChange={setPage} />
        </div>
      ) : null}
    </section>
  );
}

function TimeUnit({ value }: { value: number }) {
  return (
    <span className="grid h-11 min-w-11 place-items-center rounded-md bg-primary px-2 text-lg font-bold tabular-nums text-primary-foreground md:h-14 md:min-w-14 md:text-2xl">
      {String(value).padStart(2, "0")}
    </span>
  );
}