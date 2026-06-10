import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Bookmark, Heart, MapPin, Share2, Star, Truck } from "lucide-react";
import { useCart } from "@/store/cart";
import { useState } from "react";
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
import { ALL_PRODUCTS, getProductDetail } from "@/data/catalog";
import { formatRupiah } from "@/lib/format";

export const Route = createFileRoute("/produk/$slug")({
  loader: ({ params }) => ({ product: getProductDetail(params.slug) }),
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.product.name ?? "Produk"} — BahanMaterial.com` },
      { name: "description", content: loaderData?.product.description.slice(0, 160) ?? "" },
    ],
  }),
  component: ProductDetailPage,
});

const TABS = ["Spesifikasi", "Deskripsi", "Ulasan"] as const;
type Tab = (typeof TABS)[number];

function ProductDetailPage() {
  const { product } = Route.useLoaderData();
  const [tab, setTab] = useState<Tab>("Deskripsi");
  const [variant, setVariant] = useState(product.variants?.[0] ?? "");
  const [qty, setQty] = useState(200);
  const [reviewPage, setReviewPage] = useState(1);
  const cart = useCart();
  const navigate = useNavigate();

  const subTotal = qty * product.price;
  const related = ALL_PRODUCTS.filter((p) => p.id !== product.id).slice(0, 5);

  const addToCart = () => {
    cart.addItem({
      id: product.id,
      name: product.name + (variant ? ` ${variant}` : ""),
      price: product.price,
      originalPrice: product.originalPrice,
      discountPercent: product.discountPercent,
      image: product.images[0] ?? product.image,
      warehouse: product.warehouse,
      qty,
      unit: "Sak",
    });
  };

  const buyNow = () => { addToCart(); navigate({ to: "/keranjang" }); };

  return (
    <MainLayout user={{ name: "Auliya Gita Ananda" }}>
      <div className="container mx-auto max-w-7xl px-4 py-6">
        <Breadcrumbs
          items={[
            { label: "Home", to: "/" },
            { label: "Kategori", to: "/kategori" },
            { label: product.categoryLabel },
            ...(product.subCategory ? [{ label: product.subCategory }] : []),
            { label: product.name },
          ]}
        />

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Gallery + summary */}
          <div className="rounded-2xl border border-border bg-card p-5 md:p-6">
            <div className="grid gap-6 md:grid-cols-2">
              <ProductGallery
                images={product.images}
                alt={product.name}
                ribbon={product.variants?.join(" & ")}
              />
              <div className="space-y-4">
                <h1 className="text-2xl font-bold text-foreground md:text-3xl">{product.name}</h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1 font-semibold text-foreground">
                    <Star className="h-4 w-4 fill-rating text-rating" />
                    {(product.rating ?? 4.8).toFixed(1)}
                  </span>
                  <span>|</span>
                  <span>{product.reviewCount} penilaian</span>
                  <span>|</span>
                  <span>{product.sold} terjual</span>
                </div>

                <div className="space-y-2">
                  <p className="text-3xl font-bold text-accent">{formatRupiah(product.price)}</p>
                  {product.originalPrice ? (
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-accent-soft px-2 py-1 text-xs font-bold text-accent">
                        -{product.discountPercent}%
                      </span>
                      <span className="text-sm text-muted-foreground line-through">
                        {formatRupiah(product.originalPrice)}
                      </span>
                    </div>
                  ) : null}
                </div>

                {product.variants && product.variants.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v: string) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setVariant(v)}
                        className={
                          "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors " +
                          (v === variant
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background text-foreground hover:border-primary")
                        }
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                ) : null}

                <div className="rounded-lg border border-border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex gap-3">
                      <MapPin className="mt-0.5 h-5 w-5 text-primary" />
                      <div>
                        <p className="font-semibold text-foreground">
                          Dikirim dari {product.shippingFrom}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Jarak: {product.shippingDistanceKm}km dari lokasimu
                        </p>
                      </div>
                    </div>
                    <button className="text-sm font-semibold text-primary hover:underline">
                      Ubah &gt;
                    </button>
                  </div>
                </div>

                <div className="rounded-lg border border-primary/30 bg-primary-soft/50 p-4">
                  <div className="flex items-start gap-3">
                    <Truck className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <p className="font-semibold text-foreground">{product.shippingMethod}</p>
                      <p className="text-xs text-muted-foreground">{product.shippingEta}</p>
                    </div>
                  </div>
                </div>
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
              Stok Tersedia: <span className="font-semibold text-foreground">{product.stock} Sak</span>
            </p>
            <div className="mt-5">
              <p className="text-sm font-semibold text-foreground">Sub Total</p>
              <p className="text-2xl font-bold text-accent">{formatRupiah(subTotal)}</p>
            </div>
            <div className="mt-5 space-y-2">
              <button className="w-full rounded-md bg-primary py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
                Beli Sekarang
              </button>
              <button className="w-full rounded-md border border-primary py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/5">
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
            {tab === "Spesifikasi" && <SpecsTable items={product.specs} />}
            {tab === "Ulasan" && (
              <div>
                <div className="flex items-center justify-between">
                  <ReviewSummary
                    average={product.rating ?? 4.8}
                    count={product.reviewCount}
                    satisfactionPercent={product.satisfactionPercent}
                  />
                  <Link to="/produk/$slug" params={{ slug: product.id }} className="text-sm font-semibold text-primary hover:underline">
                    Lihat Semua Ulasan
                  </Link>
                </div>
                <div className="mt-4 divide-y divide-border">
                  {product.reviews.map((r: import("@/components/review/ReviewItem").Review) => (
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
            {related.map((p) => (
              <ProductCard key={p.id} product={p} compact />
            ))}
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
