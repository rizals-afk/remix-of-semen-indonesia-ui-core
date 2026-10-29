import { createFileRoute, useNavigate, useLocation } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { VoucherCard } from "@/components/checkout/VoucherCard";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { MainLayout } from "@/components/layout/MainLayout";
import { VOUCHERS } from "@/data/shopping";
import { useCart } from "@/store/cart";
import { useCheckout } from "@/store/checkout";
import { fetchVouchers, type Voucher as ApiVoucher } from "@/lib/api/voucher";
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";

export const Route = createFileRoute("/checkout/voucher")({
  head: () => ({ meta: [{ title: "Pilih Voucher — BahanMaterial.com" }] }),
  component: VoucherPickerPage,
});

function VoucherPickerPage() {
  const cart = useCart();
  const checkout = useCheckout();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { type?: "voucher" | "promo" } | undefined;
  const initialTab = state?.type || "voucher";
  const [selectedIds, setSelectedIds] = useState<string[]>(checkout.vouchers.map((v) => v.id));
  const [code, setCode] = useState("");
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"voucher" | "promo">(initialTab);

  const mapApiVoucherToVoucher = (apiVoucher: ApiVoucher) => {
    // Calculate discount value
    let discount = 0;
    if (apiVoucher.discount_amount) {
      discount = parseFloat(apiVoucher.discount_amount);
    } else if (apiVoucher.discount_percentage) {
      discount = parseFloat(apiVoucher.discount_percentage);
    }

    // Format expiry date
    let expiresAt = "Tidak ada batas";
    if (apiVoucher.valid_end) {
      const date = new Date(apiVoucher.valid_end);
      expiresAt = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    }

    // Map discount_type to frontend type
    let type: "shipping" | "discount" | "cashback" = "discount";
    if (apiVoucher.discount_type === "percentage") {
      type = "discount";
    } else if (apiVoucher.discount_type === "amount" || apiVoucher.discount_type === "fixed") {
      type = "cashback";
    }

    return {
      id: String(apiVoucher.id),
      code: apiVoucher.code,
      title: apiVoucher.name,
      description: apiVoucher.description || "",
      discount: discount,
      minSpend: parseFloat(apiVoucher.min_purchase),
      expiresAt: expiresAt,
      type: type,
      // Store the backend type (voucher/promo) separately
      backendType: apiVoucher.type as "voucher" | "promo",
      isClaimable: apiVoucher.is_claim,
      isClaimed: apiVoucher.claimed,
      validEnd: apiVoucher.valid_end,
      apiVoucher: apiVoucher,
    };
  };

  const loadVouchers = useCallback(async (pageNum: number = 1, isLoadMore: boolean = false) => {
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      const response = await fetchVouchers({
        per_page: 15,
        page: pageNum,
        search: searchQuery || undefined,
        sort_by: "created_at",
        sort_order: "desc",
        applicable: true,
        type: activeTab,
      });

      // Filter out expired vouchers
      const now = new Date();
      const activeVouchers = response.data.filter((apiVoucher: ApiVoucher) => {
        if (!apiVoucher.valid_end) return true;
        const validEnd = new Date(apiVoucher.valid_end);
        return validEnd >= now;
      });

      // Map API vouchers to frontend format
      const mappedVouchers = activeVouchers.map(mapApiVoucherToVoucher);

      if (isLoadMore) {
        setVouchers((prev) => [...prev, ...mappedVouchers]);
      } else {
        setVouchers(mappedVouchers);
      }

      setHasMore(response.next_page_url !== null);
      setPage(pageNum);
    } catch (error) {
      console.error("Failed to load vouchers:", error);
      if (!isLoadMore) {
        // Fallback to static data only on initial load
        setVouchers(VOUCHERS.map((v) => ({ ...v, isClaimed: false, isClaimable: false, validEnd: null, apiVoucher: null as any })) as any);
      }
      toast.error("Gagal memuat voucher");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [searchQuery, activeTab]);

  // Fetch vouchers on mount and when tab changes
  useEffect(() => {
    loadVouchers(1, false);
  }, [loadVouchers]);

  const handleSearch = () => {
    setPage(1);
    setHasMore(true);
    loadVouchers(1, false);
  };

  const handleTabChange = (tab: "voucher" | "promo") => {
    setActiveTab(tab);
    setPage(1);
    setHasMore(true);
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      loadVouchers(page + 1, true);
    }
  };

  const eligible = (v: any) => {
    // Calculate total based on flow: buy now or cart
    const total = checkout.buyNowItem
      ? checkout.buyNowItem.price * checkout.buyNowItem.qty
      : cart.subTotal;
    return total >= v.minSpend;
  };

  const handleSelectVoucher = (v: any) => {
    if (selectedIds.includes(v.id)) {
      // Deselect
      setSelectedIds((prev) => prev.filter((id) => id !== v.id));
    } else {
      // Select
      setSelectedIds((prev) => [...prev, v.id]);
    }
  };

  const confirm = () => {
    // Get all selected vouchers from the current checkout state plus newly selected ones
    const existingVouchers = checkout.vouchers;
    const newSelectedVouchers = vouchers.filter((v) => selectedIds.includes(v.id));

    // Combine existing vouchers with new selections, avoiding duplicates
    const allVouchers = [...existingVouchers];
    newSelectedVouchers.forEach((newV) => {
      if (!allVouchers.some((v) => v.id === newV.id)) {
        allVouchers.push(newV);
      }
    });

    checkout.setVouchers(allVouchers);
    navigate({ to: "/checkout" });
  };

  return (
    <MainLayout>
      <div className="container mx-auto max-w-3xl px-4 py-6">
        <Breadcrumbs
          items={[
            { label: "Home", to: "/" },
            { label: "Checkout", to: "/checkout" },
            { label: activeTab === "voucher" ? "Voucher Saya" : "Promo Saya" },
          ]}
        />
        <h1 className="mt-6 text-2xl font-bold text-foreground">
          {activeTab === "voucher" ? "Voucher Saya" : "Promo Saya"}
        </h1>

        {/* Tab buttons */}
        <div className="mt-4 flex gap-2 border-b border-border">
          <button
            onClick={() => handleTabChange("voucher")}
            className={`px-4 py-2.5 text-sm font-semibold transition-colors ${
              activeTab === "voucher"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Voucher
          </button>
          <button
            onClick={() => handleTabChange("promo")}
            className={`px-4 py-2.5 text-sm font-semibold transition-colors ${
              activeTab === "promo"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Promo
          </button>
        </div>

        <div className="mt-4 flex gap-2">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Cari ${activeTab}...`}
            className="flex-1 rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
          />
          <button
            onClick={handleSearch}
            className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Cari
          </button>
        </div>

        {loading ? (
          <div className="mt-5 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        ) : vouchers.length === 0 ? (
          <div className="mt-5 text-center text-sm text-muted-foreground">
            {searchQuery ? "Tidak ada voucher yang cocok dengan pencarian Anda" : "Tidak ada voucher tersedia"}
          </div>
        ) : (
          <>
            {/* Show selected vouchers summary */}
            {selectedIds.length > 0 && (
              <div className="mt-5 rounded-xl bg-primary-soft/50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-primary">
                    {selectedIds.length} {activeTab} dipilih
                  </span>
                  <button
                    onClick={() => setSelectedIds([])}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            <div className="mt-5 space-y-3">
              {vouchers.map((v) => (
                <VoucherCard
                  key={v.id}
                  voucher={v}
                  selected={selectedIds.includes(v.id)}
                  disabled={!eligible(v)}
                  onSelect={() => handleSelectVoucher(v)}
                  isClaimed={v.isClaimed}
                />
              ))}
            </div>
            {hasMore && (
              <div className="mt-5 flex justify-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="rounded-md border-2 border-primary px-8 py-2.5 text-sm font-bold text-primary hover:bg-primary/5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Memuat...
                    </>
                  ) : (
                    "Muat Lebih Banyak"
                  )}
                </button>
              </div>
            )}
          </>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => { setSelectedIds([]); checkout.setVouchers([]); navigate({ to: "/checkout" }); }}
            className="rounded-md border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-muted"
          >
            Tanpa Voucher
          </button>
          <button
            onClick={confirm}
            disabled={selectedIds.length === 0}
            className="rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            Gunakan {selectedIds.length} {activeTab}
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
