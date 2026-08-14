import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { AccountSidebar } from "@/components/account/AccountSidebar";
import { ProductCard } from "@/components/product/ProductCard";
import { SectionTitle } from "@/components/common/SectionTitle";
import { Pagination } from "@/components/common/Pagination";
import { useWarehouse } from "@/store/warehouse";
import { useState, useEffect } from "react";
import { fetchFavourites, type Favourite } from "@/lib/api/favourite";
import { transformProductToCard } from "@/lib/api/product";
import { toast } from "sonner";
import { getToken } from "@/lib/auth";
import { getCurrentUser } from "@/lib/auth";

export const Route = createFileRoute("/favorite")({
  head: () => ({ meta: [{ title: "Produk Favorit — BahanMaterial.com" }] }),
  component: FavoriteProductsPage,
});

function FavoriteProductsPage() {
  const { selectedWarehouse } = useWarehouse();
  const [favourites, setFavourites] = useState<Favourite[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [userData, setUserData] = useState<{ name: string; email?: string } | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getCurrentUser<{ name: string; email?: string }>();
        setUserData(user);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUserData();
  }, []);

  const loadFavourites = async (currentPage: number) => {
    setLoading(true);
    try {
      const token = getToken();
      if (!token) {
        setFavourites([]);
        setTotal(0);
        setLoading(false);
        return;
      }

      const response = await fetchFavourites({ page: currentPage, per_page: 12 });
      setFavourites(response.data);
      setTotalPages(response.last_page);
      setTotal(response.total);
    } catch (error) {
      console.error("Failed to load favourites:", error);
      toast.error("Gagal memuat produk favorit. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavourites(page);
  }, [page]);

  const transformedProducts = favourites.map((fav) =>
    transformProductToCard(fav.product, selectedWarehouse?.name, undefined, selectedWarehouse?.id)
  );

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto max-w-7xl px-4 py-6">
          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            {userData && <AccountSidebar user={userData} />}
            <div className="min-w-0">
              <SectionTitle>Produk Favorit</SectionTitle>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="rounded-2xl border border-border bg-card p-4">
                    <div className="h-48 animate-pulse bg-muted rounded-xl mb-4" />
                    <div className="h-6 animate-pulse bg-muted rounded mb-2" />
                    <div className="h-4 animate-pulse bg-muted rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {userData && <AccountSidebar user={userData} />}
          <div className="min-w-0">
            <SectionTitle>Produk Favorit</SectionTitle>
            <p className="mt-2 text-sm text-muted-foreground">
              {total} produk favorit Anda
            </p>

            {favourites.length === 0 ? (
              <div className="mt-16 flex flex-col items-center text-center">
                <div className="grid h-24 w-24 place-items-center rounded-full bg-muted text-muted-foreground">
                  <Heart className="h-10 w-10" />
                </div>
                <h2 className="mt-5 text-lg font-bold text-foreground">Belum ada produk favorit</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Mulai tambahkan produk favorit Anda dengan menekan tombol Favorit di halaman produk.
                </p>
                <Link
                  to="/produk"
                  className="mt-6 rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  Jelajahi Produk
                </Link>
              </div>
            ) : (
              <>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {transformedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <Pagination page={page} totalPages={totalPages} onChange={setPage} />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
