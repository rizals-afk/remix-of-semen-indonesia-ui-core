import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { VoucherCard } from "@/components/checkout/VoucherCard";
import { VOUCHERS } from "@/data/shopping";
import { fetchVouchers, claimVoucher, type Voucher as ApiVoucher } from "@/lib/api/voucher";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/akun/voucher")({
  head: () => ({ meta: [{ title: "Voucher Saya — BahanMaterial.com" }] }),
  component: AccountVoucherPage,
});

function AccountVoucherPage() {
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [claimingIds, setClaimingIds] = useState<Set<number>>(new Set());

  const mapApiVoucherToVoucher = (apiVoucher: ApiVoucher): typeof VOUCHERS[0] & { isClaimed: boolean; validEnd: string | null; apiVoucher: ApiVoucher } => {
    // Calculate discount value
    let discount = 0;
    if (apiVoucher.discount_amount) {
      discount = parseFloat(apiVoucher.discount_amount);
    } else if (apiVoucher.discount_percentage) {
      // For percentage, we'll show the percentage value
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
        type: "voucher",
        search: searchQuery || undefined,
        sort_by: "created_at",
        sort_order: "desc",
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
  }, [searchQuery]);

  // Fetch vouchers on mount
  useEffect(() => {
    loadVouchers(1, false);
  }, [loadVouchers]);

  const handleSearch = () => {
    setPage(1);
    setHasMore(true);
    loadVouchers(1, false);
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      loadVouchers(page + 1, true);
    }
  };

  const handleClaim = async (voucherId: number) => {
    setClaimingIds((prev) => new Set(prev).add(voucherId));
    try {
      await claimVoucher(voucherId);
      toast.success("Voucher berhasil diklaim");

      // Refresh the voucher list to get updated claimed status
      loadVouchers(1, false);
    } catch (error) {
      console.error("Failed to claim voucher:", error);
      toast.error("Gagal mengklaim voucher. Silakan coba lagi.");
    } finally {
      setClaimingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(voucherId);
        return newSet;
      });
    }
  };

  return (
    <section className="rounded-2xl border border-border bg-card p-6 md:p-8">
      <h2 className="text-lg font-bold text-foreground">Voucher Saya</h2>

      <div className="mt-4 flex gap-2">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari voucher..."
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
          <div className="mt-5 space-y-3">
            {vouchers.map((v) => (
              <VoucherCard
                key={v.id}
                voucher={v}
                isClaimed={v.isClaimed}
                isClaimable={v.isClaimable}
                isClaiming={claimingIds.has(parseInt(v.id))}
                onClaim={() => handleClaim(parseInt(v.id))}
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
    </section>
  );
}
