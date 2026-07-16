import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Bookmark, Heart, MapPin, Share2, Star, Truck } from "lucide-react";
import { useCart } from "@/store/cart";
import { useWarehouse } from "@/store/warehouse";
import { useState, useEffect } from "react";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { Pagination } from "@/components/common/Pagination";
import { QuantityStepper } from "@/components/common/QuantityStepper";
import { SectionTitle } from "@/components/common/SectionTitle";
import { UnderlineTabs } from "@/components/common/Tabs";
import { MainLayout } from "@/components/layout/MainLayout";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductGallery } from "@/components/product/ProductGallery";
import { SpecsTable } from "@/components/product/SpecsTable";
import { ReviewItem } from "@/components/review/ReviewItem";
import { ReviewSummary } from "@/components/review/ReviewSummary";
import { fetchProductById, getProductPrice, getProductImages, transformProductToCard } from "@/lib/api/product";
import { fetchProducts } from "@/lib/api/product";
import type { Product } from "@/lib/api/product";
import { formatRupiah } from "@/lib/format";

export const Route = createFileRoute("/produk/$slug")({
  component: ProductDetailPage,
});

const TABS = ["Spesifikasi", "Deskripsi", "Ulasan"] as const;
type Tab = (typeof TABS)[number];

function ProductDetailPage() {
  const { slug } = Route.useParams();
  const { selectedWarehouse } = useWarehouse();
  const [tab, setTab] = useState<Tab>("Deskripsi");
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>();
  const [qty, setQty] = useState(200);
  const [reviewPage, setReviewPage] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const cart = useCart();
  const navigate = useNavigate();

  // Fetch product on mount
  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const data = await fetchProductById(slug, selectedWarehouse?.id);
        console.log("Product Detail - API response:", data);
        console.log("Product Detail - product.media:", data.media);
        console.log("Product Detail - product.variants:", data.variants);
        setProduct(data);
        // Set first variant as default
        if (data.variants.length > 0) {
          setSelectedVariantId(data.variants[0].id);
        }
      } catch (error) {
        console.error("Failed to load product:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [slug, selectedWarehouse]);

  // Fetch related products
  useEffect(() => {
    const loadRelated = async () => {
      if (!product) return;
      try {
        const response = await fetchProducts({ page: 1, per_page: 5, branch_id: selectedWarehouse?.id });
        const filtered = response.data.filter((p) => p.id !== product.id).slice(0, 5);
        const transformed = filtered.map((p) =>
          transformProductToCard(p, selectedWarehouse?.name, undefined, selectedWarehouse?.id)
        );
        setRelatedProducts(transformed);
      } catch (error) {
        console.error("Failed to load related products:", error);
      }
    };

    loadRelated();
  }, [product, selectedWarehouse]);

  const selectedVariant = product?.variants.find((v) => v.id === selectedVariantId) || product?.variants[0];
  const price = product ? getProductPrice(product, selectedVariantId, selectedWarehouse?.id) : null;
  const images = product ? getProductImages(product, selectedVariantId) : [];
  const subTotal = price ? qty * price : 0;

  const addToCart = () => {
    if (!product || !price) return;
    cart.addItem({
      id: product.id,
      name: product.name + (selectedVariant?.name ? ` ${selectedVariant.name}` : ""),
      price,
      image: images[0] || "",
      warehouse: selectedWarehouse?.name || "Gudang Utama",
      qty,
      unit: "Sak",
    });
  };

  const buyNow = () => { addToCart(); navigate({ to: "/keranjang" }); };

  if (loading || !product) {
    return (
      <MainLayout user={{ name: "Auliya Gita Ananda" }}>
        <div className="container mx-auto max-w-7xl px-4 py-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="rounded-2xl border border-border bg-card p-5 md:p-6">
              <div className="h-96 animate-pulse bg-muted rounded-xl" />
            </div>
            <div className="h-fit rounded-2xl border border-border bg-card p-5">
              <div className="h-8 animate-pulse bg-muted rounded mb-4" />
              <div className="h-6 animate-pulse bg-muted rounded mb-2" />
              <div className="h-6 animate-pulse bg-muted rounded mb-4" />
              <div className="h-12 animate-pulse bg-muted rounded" />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout user={{ name: "Auliya Gita Ananda" }}>
      <div className="container mx-auto max-w-7xl px-4 py-6">
        <Breadcrumbs
          items={[
            { label: "Home", to: "/" },
            { label: "Kategori", to: "/kategori" },
            { label: product.category_name || "Umum" },
            { label: product.name },
          ]}
        />

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Gallery + summary */}
          <div className="rounded-2xl border border-border bg-card p-5 md:p-6">
            <div className="grid gap-6 md:grid-cols-2">
              <ProductGallery
                images={images}
                alt={product.name}
                ribbon={product.variants?.map((v) => v.name).join(" & ")}
              />
              <div className="space-y-4">
                <h1 className="text-2xl font-bold text-foreground md:text-3xl">{product.name}</h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1 font-semibold text-foreground">
                    <Star className="h-4 w-4 fill-rating text-rating" />
                    {(product.rating ?? 4.8).toFixed(1)}
                  </span>
                  <span>|</span>
                  <span>{product.reviewCount || 0} penilaian</span>
                  <span>|</span>
                  <span>{product.sold || 0} terjual</span>
                </div>

                <div className="space-y-2">
                  {price ? (
                    <p className="text-3xl font-bold text-accent">{formatRupiah(price)}</p>
                  ) : (
                    <p className="text-3xl font-bold text-muted-foreground">Harga tidak tersedia</p>
                  )}
                </div>

                {product.variants && product.variants.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariantId(v.id)}
                        className={
                          "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors " +
                          (v.id === selectedVariantId
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background text-foreground hover:border-primary")
                        }
                      >
                        {v.name}
                      </button>
                    ))}
                  </div>
                ) : null}

                {product.shippingFrom ? (
                  <div className="rounded-lg border border-border p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex gap-3">
                        <MapPin className="mt-0.5 h-5 w-5 text-primary" />
                        <div>
                          <p className="font-semibold text-foreground">
                            Dikirim dari {product.shippingFrom}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Jarak: {product.shippingDistanceKm || 0}km dari lokasimu
                          </p>
                        </div>
                      </div>
                      <button className="text-sm font-semibold text-primary hover:underline">
                        Ubah &gt;
                      </button>
                    </div>
                  </div>
                ) : null}

                {product.shippingMethod ? (
                  <div className="rounded-lg border border-primary/30 bg-primary-soft/50 p-4">
                    <div className="flex items-start gap-3">
                      <Truck className="mt-0.5 h-5 w-5 text-primary" />
                      <div>
                        <p className="font-semibold text-foreground">{product.shippingMethod}</p>
                        <p className="text-xs text-muted-foreground">{product.shippingEta}</p>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* Purchase panel */}
          <aside className="h-fit rounded-2xl border border-border bg-card p-5">
            <h2 className="text-base font-bold text-foreground">Jumlah Pembelian</h2>
            <div className="mt-3">
              <QuantityStepper value={qty} onChange={setQty} min={1} />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Stok Tersedia: <span className="font-semibold text-foreground">{product.stock || 0} Sak</span>
            </p>
            <div className="mt-5">
              <p className="text-sm font-semibold text-foreground">Sub Total</p>
              <p className="text-2xl font-bold text-accent">{formatRupiah(subTotal)}</p>
            </div>
            <div className="mt-5 space-y-2">
              <button onClick={buyNow} className="w-full rounded-md bg-primary py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
                Beli Sekarang
              </button>
              <button onClick={addToCart} className="w-full rounded-md border border-primary py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/5">
                Masukkan Keranjang
              </button>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
              <button className="inline-flex items-center gap-1 hover:text-primary">
                <Heart className="h-4 w-4" /> Favorit
              </button>
              <button className="inline-flex items-center gap-1 hover:text-primary">
                <Bookmark className="h-4 w-4" /> Wishlist
              </button>
              <button className="inline-flex items-center gap-1 hover:text-primary">
                <Share2 className="h-4 w-4" /> Share
              </button>
            </div>
          </aside>
        </div>

        {/* Tabs */}
        <div className="mt-6 rounded-2xl border border-border bg-card p-5 md:p-8">
          <UnderlineTabs tabs={TABS} value={tab} onChange={setTab} />
          <div className="mt-6">
            {tab === "Deskripsi" && (
              <div className="space-y-4 whitespace-pre-line text-sm leading-relaxed text-foreground/85">
                {product.description}
              </div>
            )}
            {tab === "Spesifikasi" && <SpecsTable items={product.specs || []} />}
            {tab === "Ulasan" && (
              <div>
                <div className="flex items-center justify-between">
                  <ReviewSummary
                    average={product.rating ?? 4.8}
                    count={product.reviewCount || 0}
                    satisfactionPercent={product.satisfactionPercent || 98}
                  />
                  <Link to="/produk/$slug" params={{ slug: product.id }} className="text-sm font-semibold text-primary hover:underline">
                    Lihat Semua Ulasan
                  </Link>
                </div>
                <div className="mt-4 divide-y divide-border">
                  {(product.reviews || []).map((r: import("@/components/review/ReviewItem").Review) => (
                    <ReviewItem key={r.id} review={r} />
                  ))}
                </div>
                <div className="mt-6">
                  <Pagination page={reviewPage} totalPages={5} onChange={setReviewPage} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related */}
        <section className="mt-12">
          <SectionTitle>Produk Terkait</SectionTitle>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {relatedProducts.map((p: any) => (
              <ProductCard key={p.id} product={p} compact />
            ))}
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
