import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { Pagination } from "@/components/common/Pagination";
import { MainLayout } from "@/components/layout/MainLayout";
import { FilterSidebar } from "@/components/product/FilterSidebar";
import { ProductCard } from "@/components/product/ProductCard";
import { ALL_PRODUCTS, CATEGORIES } from "@/data/catalog";

const searchSchema = z.object({
  q: z.string().optional(),
  page: z.coerce.number().int().min(1).optional(),
  sort: z.enum(["terbaru", "termurah", "termahal", "terlaris"]).optional(),
});

export const Route = createFileRoute("/produk")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Cari Produk — BahanMaterial.com" },
      { name: "description", content: "Cari dan filter ribuan material bangunan berkualitas dari distributor resmi PT Semen Indonesia." },
    ],
  }),
  component: ProductListingPage,
});

const PAGE_SIZE = 9;

function ProductListingPage() {
  const { q = "", page = 1, sort = "terbaru" } = Route.useSearch();
  const navigate = useNavigate({ from: "/produk" });

  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(1_000_000);
  const [appliedPrice, setAppliedPrice] = useState({ min: 0, max: 1_000_000 });

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    let items = ALL_PRODUCTS.filter((p) => {
      if (term && !p.name.toLowerCase().includes(term)) return false;
      if (p.price < appliedPrice.min || p.price > appliedPrice.max) return false;
      return true;
    });
    if (sort === "termurah") items = [...items].sort((a, b) => a.price - b.price);
    if (sort === "termahal") items = [...items].sort((a, b) => b.price - a.price);
    return items;
  }, [q, sort, appliedPrice]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);

  return (
    <MainLayout user={{ name: "Auliya Gita Ananda" }}>
      <div className="container mx-auto max-w-7xl px-4 py-6">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Produk" }]} />

        <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
          <FilterSidebar
            categories={CATEGORIES}
            selected={selectedCats}
            onToggleCategory={(slug) =>
              setSelectedCats((cur) =>
                cur.includes(slug) ? cur.filter((s) => s !== slug) : [...cur, slug],
              )
            }
            priceMin={priceMin}
            priceMax={priceMax}
            onPriceMinChange={setPriceMin}
            onPriceMaxChange={setPriceMax}
            onApply={() => setAppliedPrice({ min: priceMin, max: priceMax })}
          />

          <section>
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
              <p className="text-sm text-muted-foreground">
                Menampilkan {pageItems.length} dari {filtered.length} produk
                {q ? ` untuk "${q}"` : ""}
              </p>
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                Urutkan:
                <select
                  value={sort}
                  onChange={(e) => {
                    const next = e.target.value as NonNullable<z.infer<typeof searchSchema>["sort"]>;
                    navigate({
                      search: (prev: z.infer<typeof searchSchema>) => ({
                        ...prev,
                        sort: next,
                        page: 1,
                      }),
                    });
                  }}
                  className="rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="terbaru">Terbaru</option>
                  <option value="terlaris">Terlaris</option>
                  <option value="termurah">Harga Terendah</option>
                  <option value="termahal">Harga Tertinggi</option>
                </select>
              </label>
            </div>

            {pageItems.length === 0 ? (
              <div className="grid place-items-center rounded-xl border border-dashed border-border py-20 text-sm text-muted-foreground">
                Tidak ada produk yang cocok dengan filter Anda.
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {pageItems.map((p) => (
                  <ProductCard key={p.id} product={p} compact />
                ))}
              </div>
            )}

            {totalPages > 1 ? (
              <div className="mt-8">
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onChange={(p) =>
                    navigate({ search: (prev: z.infer<typeof searchSchema>) => ({ ...prev, page: p }) })
                  }
                />
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </MainLayout>
  );
}
