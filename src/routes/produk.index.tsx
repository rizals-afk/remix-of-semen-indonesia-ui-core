import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { z } from "zod";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { Pagination } from "@/components/common/Pagination";
import { MainLayout } from "@/components/layout/MainLayout";
import { FilterSidebar } from "@/components/product/FilterSidebar";
import { ProductCard } from "@/components/product/ProductCard";
import { fetchCategories, buildCategoryTree } from "@/lib/api/product-category";
import { fetchProducts, transformProductToCard } from "@/lib/api/product";
import type { CategoryNode } from "@/lib/api/product-category";
import { useWarehouse } from "@/store/warehouse";
import { getUser } from "@/lib/auth";

const searchSchema = z.object({
  q: z.string().optional(),
  page: z.coerce.number().int().min(1).optional(),
  sort: z.enum(["terbaru", "termurah", "termahal", "terlaris"]).optional(),
  category: z.union([z.string(), z.number()]).optional().transform(val => val ? String(val) : undefined),
});

export const Route = createFileRoute("/produk/")({
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
  const { q = "", page = 1, sort = "terbaru", category } = Route.useSearch();
  const navigate = useNavigate({ from: "/produk/" });
  const { selectedWarehouse } = useWarehouse();
  const user = getUser<{ name: string }>();

  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetchCategories({ per_page: 999, page: 1 });
        const categoryTree = buildCategoryTree(response.data);
        setCategories(categoryTree);
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };

    loadCategories();
  }, []);

  // Fetch products when filters change
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const response = await fetchProducts({
          page,
          per_page: PAGE_SIZE,
          product_category_id: category,
          branch_id: selectedWarehouse?.id,
          search: q || undefined,
          sort,
        });
        
        console.log("Product List - API response:", response);
        console.log("Product List - first product media:", response.data[0]?.media);
        
        const transformedProducts = response.data.map((product) =>
          transformProductToCard(product, selectedWarehouse?.name, undefined, selectedWarehouse?.id)
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
  }, [page, category, selectedWarehouse, q, sort]);

  // Expand parent category when category is selected
  useEffect(() => {
    if (category) {
      // Find and expand parent category
      const findAndExpandParent = (nodes: CategoryNode[]): boolean => {
        for (const node of nodes) {
          if (node.children.some(child => child.id === category)) {
            setExpandedCategories(prev => new Set([...prev, node.id]));
            return true;
          }
          if (findAndExpandParent(node.children)) {
            return true;
          }
        }
        return false;
      };
      findAndExpandParent(categories);
    } else {
      // URL has no category, collapse all
      setExpandedCategories(new Set());
    }
  }, [category, categories]);

  // Sync category selection changes to URL
  const handleToggleCategory = (id: string) => {
    // Calculate new selection based on current URL state
    const isCurrentlySelected = String(category) === String(id);
    const newCategory = isCurrentlySelected ? undefined : String(id);
    
    // Update URL
    navigate({
      search: (prev: z.infer<typeof searchSchema>) => {
        const newSearch = { ...prev };
        if (newCategory) {
          newSearch.category = newCategory;
        } else {
          delete newSearch.category;
        }
        newSearch.page = 1;
        return newSearch;
      },
    });
  };

  // Toggle category expand/collapse
  const handleToggleExpand = (id: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <MainLayout user={user}>
      <div className="container mx-auto max-w-7xl px-4 py-6">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Produk" }]} />

        <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
          <FilterSidebar
            categories={categories}
            selected={category ? [String(category)] : []}
            onToggleCategory={handleToggleCategory}
            priceMin={0}
            priceMax={0}
            onPriceMinChange={() => {}}
            onPriceMaxChange={() => {}}
            onApply={() => {}}
            expandedCategories={expandedCategories}
            onToggleExpand={handleToggleExpand}
          />

          <section>
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
              <p className="text-sm text-muted-foreground">
                {loading ? "Memuat produk..." : `Menampilkan ${products.length} produk`}
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

            {loading ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="aspect-square rounded-xl border border-border bg-muted animate-pulse" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="grid place-items-center rounded-xl border border-dashed border-border py-20 text-sm text-muted-foreground">
                Tidak ada produk yang cocok dengan filter Anda.
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((p: any) => (
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
