import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronRight, MapPin, Percent, Zap, Loader2 } from "lucide-react";
import flashSaleMaterials from "@/assets/flash-sale-materials.png";
import { MainLayout } from "@/components/layout/MainLayout";
import { ProductCard, type Product } from "@/components/product/ProductCard";
import { Pagination } from "@/components/common/Pagination";
import { useWarehouse } from "@/store/warehouse";
import { fetchVouchers, type Voucher } from "@/lib/api/voucher";
import { fetchProducts, transformProductToCard } from "@/lib/api/product";
import { getCurrentUserFromStorage } from "@/lib/auth";
import { toast } from "sonner";

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

function FlashSalePage() {
  const user = getCurrentUserFromStorage();
  const { selectedWarehouse } = useWarehouse();
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFlashsaleVouchers = async () => {
      try {
        const response = await fetchVouchers({
          per_page: 100,
          page: 1,
          type: "flashsale",
        });

        // Filter active vouchers (valid_end > today)
        const now = new Date();
        const activeVouchers = response.data.filter((voucher) => {
          if (!voucher.valid_end) return false;
          const validEnd = new Date(voucher.valid_end);
          return validEnd >= now;
        });

        setVouchers(activeVouchers);
      } catch (error) {
        console.error("Failed to load flashsale vouchers:", error);
        toast.error("Gagal memuat data flash sale");
      } finally {
        setLoading(false);
      }
    };

    loadFlashsaleVouchers();
  }, []);

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
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : vouchers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Tidak ada flash sale aktif saat ini.
            </div>
          ) : (
            vouchers.map((voucher) => (
              <FlashSaleSection key={voucher.id} voucher={voucher} warehouseName={selectedWarehouse?.name} branchId={selectedWarehouse?.id} />
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
}

function FlashSaleSection({
  voucher,
  warehouseName,
  branchId,
}: {
  voucher: Voucher;
  warehouseName?: string;
  branchId?: string;
}) {
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  // Countdown logic
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  // Parse flashsale time
  const parseTime = (timeStr: string | null | undefined): Date | null => {
    if (!timeStr) return null;
    const [hours, minutes, seconds] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, seconds || 0, 0);
    return date;
  };

  const startTime = parseTime(voucher.flashsale_time_start);
  const endTime = parseTime(voucher.flashsale_time_end);

  // Calculate time status
  let timeStatus: 'not_started' | 'active' | 'ended' = 'active';
  let timeDisplay: string = '';
  let countdownSeconds = 0;

  if (startTime && endTime) {
    if (currentTime < startTime) {
      timeStatus = 'not_started';
      const diff = startTime.getTime() - currentTime.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      timeDisplay = `Mulai dalam ${hours}j ${minutes}m`;
    } else if (currentTime >= endTime) {
      timeStatus = 'ended';
      timeDisplay = 'Berakhir';
    } else {
      timeStatus = 'active';
      const diff = endTime.getTime() - currentTime.getTime();
      countdownSeconds = Math.floor(diff / 1000);
    }
  }

  // Fetch products for this voucher
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const response = await fetchProducts({
          page,
          per_page: PAGE_SIZE,
          branch_id: branchId,
          is_flashsale: true,
          voucher_id: voucher.id,
        });

        const transformedProducts = response.data.map((product) =>
          transformProductToCard(product, warehouseName, undefined, branchId)
        );

        setProducts(transformedProducts);
        setTotalPages(Math.max(1, Math.ceil(response.total / PAGE_SIZE)));
      } catch (error) {
        console.error("Failed to load products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [page, voucher.id, branchId, warehouseName]);

  const hours = Math.floor(countdownSeconds / 3600);
  const minutes = Math.floor((countdownSeconds % 3600) / 60);
  const seconds = countdownSeconds % 60;

  // Hide section if loading is complete and there are no products
  if (!loading && products.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby={`voucher-${voucher.id}-title`}>
      <div className="mb-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-3 text-primary md:justify-start">
        <Zap className="h-8 w-8 fill-warning text-warning md:h-10 md:w-10" />
        <h2 id={`voucher-${voucher.id}-title`} className="text-2xl font-bold md:text-3xl">Flash Sale</h2>
        {timeStatus === 'not_started' && (
          <span className="text-sm font-medium md:text-base">{timeDisplay}</span>
        )}
        {timeStatus === 'active' && (
          <>
            <span className="text-sm font-medium md:text-base">Berakhir dalam</span>
            <div className="flex items-center gap-1.5" aria-label={`${hours} jam ${minutes} menit ${seconds} detik`}>
              <TimeUnit value={hours} />
              <span className="text-xl font-bold">:</span>
              <TimeUnit value={minutes} />
              <span className="text-xl font-bold">:</span>
              <TimeUnit value={seconds} />
            </div>
          </>
        )}
        {timeStatus === 'ended' && (
          <span className="text-sm font-medium text-muted-foreground md:text-base">{timeDisplay}</span>
        )}
      </div>

      <div className="mb-5 flex items-center justify-between gap-3 border-b border-border pb-3">
        <div>
          <h3 className="text-lg font-bold text-foreground">{voucher.name}</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">{voucher.description || 'Harga spesial terbatas'}</p>
        </div>
        <span className="hidden items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1.5 text-xs font-semibold text-accent sm:inline-flex">
          <MapPin className="h-3.5 w-3.5" /> Berlaku di beberapa gudang
        </span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {products.map((product) => {
              console.log("Flashsale - Product card product:", product);
              console.log("Flashsale - Voucher ID:", voucher.id);
              console.log("Flashsale - Passing voucher_id to ProductCard:", voucher.id);
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  compact
                  search={{ voucher_id: voucher.id }}
                />
              );
            })}
          </div>

          {totalPages > 1 ? (
            <div className="mt-7">
              <Pagination page={page} totalPages={totalPages} onChange={setPage} />
            </div>
          ) : null}
        </>
      )}
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
