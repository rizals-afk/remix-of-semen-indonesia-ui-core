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
import { Loader2, X, ChevronDown, ChevronUp } from "lucide-react";

export const Route = createFileRoute("/checkout/voucher")({
  head: () => ({ meta: [{ title: "Pilih Voucher — BahanMaterial.com" }] }),
  component: VoucherPickerPage,
});

const MAX_VOUCHERS = 3;

function VoucherPickerPage() {
  const cart = useCart();
  const checkout = useCheckout();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { type?: "voucher" | "promo" } | undefined;
  const initialType = state?.type || "voucher";
  const [selectedIds, setSelectedIds] = useState<string[]>(checkout.vouchers.map((v) => v.id));
  const [code, setCode] = useState("");
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [promos, setPromos] = useState<any[]>([]);
  const [loadingVouchers, setLoadingVouchers] = useState(true);
  const [loadingPromos, setLoadingPromos] = useState(true);
  const [loadingMoreVouchers, setLoadingMoreVouchers] = useState(false);
  const [loadingMorePromos, setLoadingMorePromos] = useState(false);
  const [pageVouchers, setPageVouchers] = useState(1);
  const [pagePromos, setPagePromos] = useState(1);
  const [hasMoreVouchers, setHasMoreVouchers] = useState(true);
  const [hasMorePromos, setHasMorePromos] = useState(true);
  const [searchQueryVouchers, setSearchQueryVouchers] = useState("");
  const [searchQueryPromos, setSearchQueryPromos] = useState("");
  const [isVoucherExpanded, setIsVoucherExpanded] = useState(initialType === "voucher");
  const [isPromoExpanded, setIsPromoExpanded] = useState(initialType === "promo");

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
      setLoadingMoreVouchers(true);
    } else {
      setLoadingVouchers(true);
    }

    try {
      const response = await fetchVouchers({
        per_page: 15,
        page: pageNum,
        search: searchQueryVouchers || undefined,
        sort_by: "created_at",
        sort_order: "desc",
        applicable: true,
        type: "voucher",
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

      setHasMoreVouchers(response.next_page_url !== null);
      setPageVouchers(pageNum);
    } catch (error) {
      console.error("Failed to load vouchers:", error);
      if (!isLoadMore) {
        // Fallback to static data only on initial load
        setVouchers(VOUCHERS.map((v) => ({ ...v, isClaimed: false, isClaimable: false, validEnd: null, apiVoucher: null as any })) as any);
      }
      toast.error("Gagal memuat voucher");
    } finally {
      setLoadingVouchers(false);
      setLoadingMoreVouchers(false);
    }
  }, [searchQueryVouchers]);

  const loadPromos = useCallback(async (pageNum: number = 1, isLoadMore: boolean = false) => {
    if (isLoadMore) {
      setLoadingMorePromos(true);
    } else {
      setLoadingPromos(true);
    }

    try {
      const response = await fetchVouchers({
        per_page: 15,
        page: pageNum,
        search: searchQueryPromos || undefined,
        sort_by: "created_at",
        sort_order: "desc",
        applicable: true,
        type: "promo",
      });

      // Filter out expired promos
      const now = new Date();
      const activePromos = response.data.filter((apiVoucher: ApiVoucher) => {
        if (!apiVoucher.valid_end) return true;
        const validEnd = new Date(apiVoucher.valid_end);
        return validEnd >= now;
      });

      // Map API promos to frontend format
      const mappedPromos = activePromos.map(mapApiVoucherToVoucher);

      if (isLoadMore) {
        setPromos((prev) => [...prev, ...mappedPromos]);
      } else {
        setPromos(mappedPromos);
      }

      setHasMorePromos(response.next_page_url !== null);
      setPagePromos(pageNum);
    } catch (error) {
      console.error("Failed to load promos:", error);
      if (!isLoadMore) {
        setPromos([]);
      }
      toast.error("Gagal memuat promo");
    } finally {
      setLoadingPromos(false);
      setLoadingMorePromos(false);
    }
  }, [searchQueryPromos]);

  // Fetch vouchers and promos on mount
  useEffect(() => {
    loadVouchers(1, false);
    loadPromos(1, false);
  }, [loadVouchers, loadPromos]);

  const handleSearchVouchers = () => {
    setPageVouchers(1);
    setHasMoreVouchers(true);
    loadVouchers(1, false);
  };

  const handleSearchPromos = () => {
    setPagePromos(1);
    setHasMorePromos(true);
    loadPromos(1, false);
  };

  const handleLoadMoreVouchers = () => {
    if (!loadingMoreVouchers && hasMoreVouchers) {
      loadVouchers(pageVouchers + 1, true);
    }
  };

  const handleLoadMorePromos = () => {
    if (!loadingMorePromos && hasMorePromos) {
      loadPromos(pagePromos + 1, true);
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
      // Select — cap at MAX_VOUCHERS combined (includes auto-applied flashsale vouchers)
      if (selectedIds.length >= MAX_VOUCHERS) {
        toast.error(`Maksimal ${MAX_VOUCHERS} voucher/promo/flashsale yang dapat digabungkan per transaksi.`);
        return;
      }
      setSelectedIds((prev) => [...prev, v.id]);
    }
  };

  const confirm = () => {
    const allItems = [...vouchers, ...promos];
    const pickerIds = new Set(allItems.map((v) => v.id));

    // Vouchers not manageable on this screen (e.g. auto-applied flashsale)
    // are carried over; voucher/promo selections are rebuilt from selectedIds
    // so deselecting a card actually removes it.
    const isPickerManaged = (v: any) =>
      v.backendType === "voucher" ||
      v.backendType === "promo" ||
      (!v.backendType && pickerIds.has(v.id));

    const carriedOver = checkout.vouchers.filter((v) => !isPickerManaged(v));

    // Resolve each selected id to the freshest object available — prefer the
    // loaded picker item, fall back to the already-applied voucher (covers
    // selections that aren't on the currently loaded page).
    const selectedItems = selectedIds
      .map((id) => allItems.find((v) => v.id === id) ?? checkout.vouchers.find((v) => v.id === id))
      .filter((v): v is NonNullable<typeof v> => Boolean(v));

    // Combine carried-over vouchers with current selections, avoiding duplicates
    const allVouchers = [...carriedOver];
    selectedItems.forEach((newV) => {
      if (!allVouchers.some((v) => v.id === newV.id)) {
        allVouchers.push(newV);
      }
    });

    // Enforce the combined voucher/promo/flashsale limit
    let finalVouchers = allVouchers;
    if (allVouchers.length > MAX_VOUCHERS) {
      finalVouchers = allVouchers.slice(0, MAX_VOUCHERS);
      toast.error(`Maksimal ${MAX_VOUCHERS} voucher/promo/flashsale per transaksi. Beberapa pilihan tidak diterapkan.`);
    }

    // Clear calculated discounts before setting new vouchers so they get recalculated
    checkout.clearCalculatedDiscounts();
    checkout.setVouchers(finalVouchers);

    // Set flag to indicate this is a user-initiated voucher change
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('userVoucherChange', 'true');
    }

    navigate({ to: "/checkout" });
  };

  return (
    <MainLayout>
      <div className="container mx-auto max-w-3xl px-4 py-6">
        <Breadcrumbs
          items={[
            { label: "Home", to: "/" },
            { label: "Checkout", to: "/checkout" },
            { label: "Voucher & Promo" },
          ]}
        />
        <h1 className="mt-6 text-2xl font-bold text-foreground">
          Voucher & Promo
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Maksimal {MAX_VOUCHERS} voucher, promo, atau flashsale yang dapat digabungkan per transaksi.
        </p>

        {/* Show selected items summary */}
        {selectedIds.length > 0 && (
          <div className="mt-5 rounded-xl bg-primary-soft/50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-primary">
                {selectedIds.length} item dipilih
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

        {/* Voucher Section */}
        <div className="mt-5 rounded-xl border border-border bg-card">
          <button
            onClick={() => setIsVoucherExpanded(!isVoucherExpanded)}
            className="flex w-full items-center justify-between px-5 py-4 text-left"
          >
            <span className="text-base font-semibold text-foreground">Voucher</span>
            {isVoucherExpanded ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </button>

          {isVoucherExpanded && (
            <div className="border-t border-border">
              <div className="p-4">
                <div className="flex gap-2">
                  <input
                    value={searchQueryVouchers}
                    onChange={(e) => setSearchQueryVouchers(e.target.value)}
                    placeholder="Cari voucher..."
                    className="flex-1 rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
                  />
                  <button
                    onClick={handleSearchVouchers}
                    className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                  >
                    Cari
                  </button>
                </div>
              </div>

              {loadingVouchers ? (
                <div className="px-5 pb-5 space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-24 animate-pulse rounded-xl bg-muted" />
                  ))}
                </div>
              ) : vouchers.length === 0 ? (
                <div className="px-5 pb-5 text-center text-sm text-muted-foreground">
                  {searchQueryVouchers ? "Tidak ada voucher yang cocok dengan pencarian Anda" : "Tidak ada voucher tersedia"}
                </div>
              ) : (
                <>
                  <div className="px-5 pb-5 space-y-3">
                    {vouchers.map((v) => (
                      <VoucherCard
                        key={v.id}
                        voucher={v}
                        selected={selectedIds.includes(v.id)}
                        disabled={!eligible(v) || (!selectedIds.includes(v.id) && selectedIds.length >= MAX_VOUCHERS)}
                        onSelect={() => handleSelectVoucher(v)}
                        isClaimed={v.isClaimed}
                      />
                    ))}
                  </div>
                  {hasMoreVouchers && (
                    <div className="px-5 pb-5 flex justify-center">
                      <button
                        onClick={handleLoadMoreVouchers}
                        disabled={loadingMoreVouchers}
                        className="rounded-md border-2 border-primary px-8 py-2.5 text-sm font-bold text-primary hover:bg-primary/5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {loadingMoreVouchers ? (
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
            </div>
          )}
        </div>

        {/* Promo Section */}
        <div className="mt-5 rounded-xl border border-border bg-card">
          <button
            onClick={() => setIsPromoExpanded(!isPromoExpanded)}
            className="flex w-full items-center justify-between px-5 py-4 text-left"
          >
            <span className="text-base font-semibold text-foreground">Promo</span>
            {isPromoExpanded ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </button>

          {isPromoExpanded && (
            <div className="border-t border-border">
              <div className="p-4">
                <div className="flex gap-2">
                  <input
                    value={searchQueryPromos}
                    onChange={(e) => setSearchQueryPromos(e.target.value)}
                    placeholder="Cari promo..."
                    className="flex-1 rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
                  />
                  <button
                    onClick={handleSearchPromos}
                    className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                  >
                    Cari
                  </button>
                </div>
              </div>

              {loadingPromos ? (
                <div className="px-5 pb-5 space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-24 animate-pulse rounded-xl bg-muted" />
                  ))}
                </div>
              ) : promos.length === 0 ? (
                <div className="px-5 pb-5 text-center text-sm text-muted-foreground">
                  {searchQueryPromos ? "Tidak ada promo yang cocok dengan pencarian Anda" : "Tidak ada promo tersedia"}
                </div>
              ) : (
                <>
                  <div className="px-5 pb-5 space-y-3">
                    {promos.map((v) => (
                      <VoucherCard
                        key={v.id}
                        voucher={v}
                        selected={selectedIds.includes(v.id)}
                        disabled={!eligible(v) || (!selectedIds.includes(v.id) && selectedIds.length >= MAX_VOUCHERS)}
                        onSelect={() => handleSelectVoucher(v)}
                        isClaimed={v.isClaimed}
                      />
                    ))}
                  </div>
                  {hasMorePromos && (
                    <div className="px-5 pb-5 flex justify-center">
                      <button
                        onClick={handleLoadMorePromos}
                        disabled={loadingMorePromos}
                        className="rounded-md border-2 border-primary px-8 py-2.5 text-sm font-bold text-primary hover:bg-primary/5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {loadingMorePromos ? (
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
            </div>
          )}
        </div>

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
            Gunakan {selectedIds.length} item
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
