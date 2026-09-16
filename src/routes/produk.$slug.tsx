import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Bookmark, Heart, MapPin, Share2, Star, Truck, Building2, Loader2 } from "lucide-react";
import { useCart } from "@/store/cart";
import { useWarehouse } from "@/store/warehouse";
import { useCheckout } from "@/store/checkout";
import { useState, useEffect } from "react";
import { toast } from "sonner";
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
import { WarehouseSelectorModal } from "@/components/warehouse/WarehouseSelectorModal";
import type { Warehouse } from "@/lib/api/warehouse";
import { fetchProductById, getProductPrice, getProductImages, getProductStock, transformProductToCard } from "@/lib/api/product";
import { fetchProducts } from "@/lib/api/product";
import type { Product } from "@/lib/api/product";
import { formatRupiah } from "@/lib/format";
import { toggleFavourite } from "@/lib/api/favourite";
import { getToken } from "@/lib/auth";
import { getUserLocation, type UserLocation } from "@/lib/location";

export const Route = createFileRoute("/produk/$slug")({
  component: ProductDetailPage,
});

const TABS = ["Spesifikasi", "Deskripsi", "Ulasan"] as const;
type Tab = (typeof TABS)[number];

function ProductDetailPage() {
  const { slug } = Route.useParams();
  const { selectedWarehouse: headerWarehouse } = useWarehouse();
  const checkout = useCheckout();
  const [tab, setTab] = useState<Tab>("Deskripsi");
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>();
  const [selectedBranchId, setSelectedBranchId] = useState<string | undefined>();
  const [qty, setQty] = useState(1);
  const [reviewPage, setReviewPage] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [warehouseModalOpen, setWarehouseModalOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isFavourited, setIsFavourited] = useState(false);
  const [isTogglingFavourite, setIsTogglingFavourite] = useState(false);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const cart = useCart();
  const navigate = useNavigate();
  const { setSelectedWarehouse: setHeaderWarehouse } = useWarehouse();

  const handleWarehouseSelect = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    setSelectedBranchId(warehouse.id);
    setHeaderWarehouse(warehouse); // Sync with header warehouse
    setWarehouseModalOpen(false);
  };

  // Format user location for display
  const userLocationDisplay = userLocation
    ? `${userLocation.lat}, ${userLocation.long}`
    : "";

  // Generate WhatsApp URL with product and warehouse info
  const whatsappUrl = product && selectedWarehouse
    ? `https://wa.me/6281133331800?text=${encodeURIComponent(
        `Saya ingin menanyakan ${product.name}${selectedVariantId ? ` (${product.variants.find(v => v.id === selectedVariantId)?.variant_name || ''})` : ''} pada gudang ${selectedWarehouse.name}`
      )}`
    : undefined;

  // Fetch product on mount
  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const data = await fetchProductById(slug, headerWarehouse?.id);
        console.log("Product Detail - API response:", data);
        console.log("Product Detail - product.media:", data.media);
        console.log("Product Detail - product.variants:", data.variants);
        setProduct(data);
        setIsFavourited(data.is_favourite || false);
        // Set first variant as default
        if (data.variants.length > 0) {
          setSelectedVariantId(data.variants[0].id);
        }
        // Initialize selectedBranchId from header warehouse
        if (headerWarehouse?.id) {
          setSelectedBranchId(headerWarehouse.id);
        }
      } catch (error) {
        console.error("Failed to load product:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [slug, headerWarehouse]);

  // Get user location on mount
  useEffect(() => {
    const loadUserLocation = async () => {
      const location = await getUserLocation();
      setUserLocation(location);
    };
    loadUserLocation();
  }, []);

  // Set selected warehouse based on header warehouse or user location
  useEffect(() => {
    if (headerWarehouse) {
      setSelectedWarehouse(headerWarehouse);
      setSelectedBranchId(headerWarehouse.id);
    }
  }, [headerWarehouse]);

  // Fetch related products
  useEffect(() => {
    const loadRelated = async () => {
      if (!product) return;
      try {
        const response = await fetchProducts({ page: 1, per_page: 5, branch_id: headerWarehouse?.id });
        const filtered = response.data.filter((p) => p.id !== product.id).slice(0, 5);
        const transformed = filtered.map((p) =>
          transformProductToCard(p, headerWarehouse?.name, undefined, headerWarehouse?.id)
        );
        setRelatedProducts(transformed);
      } catch (error) {
        console.error("Failed to load related products:", error);
      }
    };

    loadRelated();
  }, [product, headerWarehouse]);

  const selectedVariant = product?.variants.find((v) => v.id === selectedVariantId) || product?.variants[0];
  const price = product ? getProductPrice(product, selectedVariantId, selectedBranchId) : null;
  const images = product ? getProductImages(product, selectedVariantId) : [];
  const stock = product ? getProductStock(product, selectedVariantId, selectedBranchId) : 0;
  
  // Check if selected variant has a pricelist for the selected branch
  const hasPrice = selectedVariant?.pricelists?.some(p => p.branch_id === selectedBranchId) ?? false;
  const subTotal = (hasPrice && price) ? qty * price : 0;

  // Build specs from API data
  const specs = product ? [
    { label: "Weight", value: selectedVariant?.weight || "-" },
    { label: "Brand", value: product.brand?.name || product.brand_name || "-" },
    { label: "Category", value: product.category?.name || product.category_name || "-" },
  ] : [];

  const addToCart = async () => {
    const token = getToken();
    if (!token) {
      toast.error("Silahkan Login Terlebih Dahulu");
      return;
    }

    if (!product || !price) {
      toast.error("Produk ini tidak tersedia untuk gudang yang dipilih. Silakan pilih gudang lain.");
      return;
    }
    if (!hasPrice) {
      toast.error("Produk ini tidak tersedia untuk gudang yang dipilih. Silakan pilih gudang lain.");
      return;
    }
    
    setIsAddingToCart(true);
    setIsAnimating(true);
    
    // Reset animation after it completes
    setTimeout(() => setIsAnimating(false), 500);
    
    try {
      await cart.addItem({
        id: product.id,
        name: product.name + (selectedVariant?.name ? ` ${selectedVariant.name}` : ""),
        price,
        image: images[0] || "",
        warehouse: selectedWarehouse?.name || "Gudang Utama",
        qty,
        unit: "Sak",
      }, parseInt(product.id), selectedVariantId ? parseInt(selectedVariantId) : undefined, selectedBranchId ? parseInt(selectedBranchId) : undefined);
      toast.success("Produk berhasil ditambahkan ke keranjang.");
    } catch (error) {
      toast.error("Gagal menambahkan produk ke keranjang. Silakan coba lagi.");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const buyNow = async () => {
    const token = getToken();
    if (!token) {
      toast.error("Silahkan Login Terlebih Dahulu");
      return;
    }

    if (!product || !price) {
      toast.error("Produk ini tidak tersedia untuk gudang yang dipilih. Silakan pilih gudang lain.");
      return;
    }
    if (!hasPrice) {
      toast.error("Produk ini tidak tersedia untuk gudang yang dipilih. Silakan pilih gudang lain.");
      return;
    }
    if (!selectedVariantId || !selectedBranchId) {
      toast.error("Silakan pilih varian dan gudang terlebih dahulu.");
      return;
    }
    if (price <= 0) {
      toast.error("Harga tidak valid untuk produk ini.");
      return;
    }
    if (stock <= 0) {
      toast.error("Stok tidak tersedia untuk produk ini.");
      return;
    }

    // Set buyNowItem in checkout store
    checkout.setBuyNowItem({
      productId: product.id,
      variantId: selectedVariantId,
      branchId: selectedBranchId,
      name: product.name,
      variantName: selectedVariant?.variant_name || selectedVariant?.name || "",
      price,
      qty,
      image: images[0] || "",
      warehouse: selectedWarehouse?.name || "Gudang Utama",
      weightKg: parseFloat(selectedVariant?.weight || "0") || 0,
      division: selectedVariant?.division,
      branch_latitude: selectedWarehouse?.lat,
      branch_longitude: selectedWarehouse?.long,
    });

    // Navigate directly to checkout
    navigate({ to: "/checkout" });
  };

  const handleToggleFavourite = async () => {
    const token = getToken();
    if (!token) {
      toast.error("Silakan login terlebih dahulu untuk menambahkan favorit.");
      return;
    }

    if (!product) return;

    setIsTogglingFavourite(true);
    try {
      await toggleFavourite(product.id);
      setIsFavourited(!isFavourited);
      toast.success(isFavourited ? "Produk dihapus dari favorit." : "Produk ditambahkan ke favorit.");
    } catch (error) {
      console.error("Failed to toggle favourite:", error);
      toast.error("Gagal mengubah status favorit. Silakan coba lagi.");
    } finally {
      setIsTogglingFavourite(false);
    }
  };

  const handleShare = async () => {
    if (!product) return;

    const shareData = {
      title: product.name,
      text: `Cek produk ini: ${product.name}`,
      url: window.location.href,
    };

    // Try Web Share API first (mobile devices)
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success("Produk berhasil dibagikan.");
        return;
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error("Error sharing:", error);
        }
      }
    }

    // Fallback: Copy to clipboard
    try {
      // Check if clipboard API is available
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link produk berhasil disalin ke clipboard.");
      } else {
        // Fallback for older browsers or non-HTTPS contexts
        const textArea = document.createElement("textarea");
        textArea.value = window.location.href;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand('copy');
          toast.success("Link produk berhasil disalin ke clipboard.");
        } catch (err) {
          console.error("Failed to copy using execCommand:", err);
          toast.error("Gagal membagikan produk. Silakan coba lagi.");
        } finally {
          document.body.removeChild(textArea);
        }
      }
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      toast.error("Gagal membagikan produk. Silakan coba lagi.");
    }
  };

  if (loading || !product) {
    return (
      <MainLayout>
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
    <MainLayout whatsappUrl={whatsappUrl}>
      <div className="container mx-auto max-w-7xl px-4 py-6">
        <Breadcrumbs
          items={[
            { label: "Home", to: "/" },
            { label: "Produk", to: "/produk" },
            //{ label: product.category_id.name || "Umum" },
            { label: product.name },
          ]}
        />

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Gallery + summary */}
          <div className="rounded-2xl border border-border bg-card p-5 md:p-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className={isAnimating ? "animate-fly-to-cart" : ""}>
                <ProductGallery
                  images={images}
                  alt={product.name}
                  ribbon={product.variants?.map((v) => v.name).join(" & ")}
                />
              </div>
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
                  {hasPrice && price ? (
                    <p className="text-3xl font-bold text-accent">{formatRupiah(price)}</p>
                  ) : (
                    <p className="text-3xl font-bold text-muted-foreground">Harga tidak tersedia untuk gudang ini</p>
                  )}
                </div>

                {product.variants && product.variants.length > 0 ? (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">Variant</label>
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
                          {v.variant_name || v.name}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}

                {selectedWarehouse ? (
                  <div className="rounded-lg border border-border p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex gap-3">
                        <Building2 className="mt-0.5 h-5 w-5 text-primary" />
                        <div>
                          <p className="font-semibold text-foreground">
                            Dikirim dari {selectedWarehouse.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {selectedWarehouse.address || "Gudang tersedia"}
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setWarehouseModalOpen(true)}
                        className="text-sm font-semibold text-primary hover:underline"
                      >
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
              Stok Online: <span className="font-semibold text-foreground">{Math.floor(stock)}</span>
            </p>
            <div className="mt-5">
              <p className="text-sm font-semibold text-foreground">Sub Total</p>
              <p className="text-2xl font-bold text-accent">{formatRupiah(subTotal)}</p>
            </div>
            <div className="mt-5 space-y-2">
              <button 
                onClick={buyNow} 
                disabled={!hasPrice || isAddingToCart}
                className="w-full rounded-md bg-primary py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary"
              >
                Beli Sekarang
              </button>
              <button 
                onClick={addToCart} 
                disabled={!hasPrice || isAddingToCart}
                className="w-full rounded-md border border-primary py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-background flex items-center justify-center gap-2"
              >
                {isAddingToCart ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Menambahkan...
                  </>
                ) : (
                  "Masukkan Keranjang"
                )}
              </button>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
              <button
                onClick={handleToggleFavourite}
                disabled={isTogglingFavourite}
                className="inline-flex items-center gap-1 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Heart className={`h-4 w-4 ${isFavourited ? "fill-red-500 text-red-500" : ""}`} />
                Favorit
              </button>
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1 hover:text-primary"
              >
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
            {tab === "Spesifikasi" && <SpecsTable items={specs} />}
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
      
      {/* Warehouse Selector Modal */}
      <WarehouseSelectorModal
        open={warehouseModalOpen}
        onOpenChange={setWarehouseModalOpen}
        selectedWarehouse={selectedWarehouse}
        onSelectWarehouse={handleWarehouseSelect}
        userLocation={userLocationDisplay}
      />
    </MainLayout>
  );
}
