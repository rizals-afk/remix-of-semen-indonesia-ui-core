import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useCallback, useRef } from "react";
import { ClipboardList, Search, Loader2 } from "lucide-react";
import { UnderlineTabs } from "@/components/common/Tabs";
import { TrxCard } from "@/components/account/TrxCard";
import { fetchTrx, type Trx, type FetchTrxParams } from "@/lib/api/trx";
import { toast } from "sonner";

export const Route = createFileRoute("/akun/transaksi/")({
  head: () => ({ meta: [{ title: "Riwayat Pesanan — BahanMaterial.com" }] }),
  component: TransactionsPage,
});

const TABS = [
  "Menunggu Verifikasi",
  "Menunggu Pembayaran",
  "Diproses",
  "Dikirim",
  "Selesai",
  "Dibatalkan",
] as const;
type Tab = (typeof TABS)[number];

const TAB_TO_STATUS: Record<Tab, string> = {
  "Menunggu Verifikasi": "pending",
  "Menunggu Pembayaran": "approve",
  Diproses: "proses",
  Dikirim: "delivery",
  Selesai: "done",
  Dibatalkan: "cancel",
};

function TransactionsPage() {
  const [tab, setTab] = useState<Tab>("Menunggu Pembayaran");
  const [transactions, setTransactions] = useState<Trx[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const loadTransactions = useCallback(async (pageNum: number = 1, isLoadMore: boolean = false) => {
    if (isLoadMore) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
      setError(null);
    }

    try {
      const params: FetchTrxParams = {
        page: pageNum,
        per_page: 10,
        status: TAB_TO_STATUS[tab],
        search: searchQuery,
      };

      const response = await fetchTrx(params);

      if (isLoadMore) {
        setTransactions((prev) => [...prev, ...response.data]);
      } else {
        setTransactions(response.data);
      }

      setHasMore(response.next_page_url !== null);
      setPage(pageNum);
    } catch (err) {
      console.error("Failed to load transactions:", err);
      setError("Gagal memuat transaksi. Silakan coba lagi.");
      toast.error("Gagal memuat transaksi");
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [tab, searchQuery]);

  // Reset to page 1 when tab or search changes
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    loadTransactions(1, false);
  }, [tab, searchQuery, loadTransactions]);

  // Infinite scroll
  useEffect(() => {
    if (isLoadingMore || !hasMore) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadTransactions(page + 1, true);
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isLoadingMore, hasMore, page, loadTransactions]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleTabChange = (newTab: Tab) => {
    setTab(newTab);
    setPage(1);
    setHasMore(true);
  };

  return (
    <div className="space-y-5 rounded-2xl border border-border bg-card p-5">
      <div className="overflow-x-auto">
        <UnderlineTabs tabs={TABS} value={tab} onChange={handleTabChange} tone="primary" />
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Cari nomor pesanan..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full rounded-md border border-border bg-background pl-10 pr-4 py-2 text-sm focus:border-primary focus:outline-none"
        />
      </div>

      {isLoading && !isLoadingMore ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border border-border bg-card p-5">
              <div className="h-6 w-1/3 animate-pulse rounded bg-muted" />
              <div className="mt-4 space-y-3">
                <div className="h-4 w-full animate-pulse rounded bg-muted" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
          <p className="text-sm text-muted-foreground">{error}</p>
          <button
            onClick={() => loadTransactions(1, false)}
            className="mt-4 rounded-md bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90"
          >
            Coba Lagi
          </button>
        </div>
      ) : transactions.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-muted text-muted-foreground">
            <ClipboardList className="h-8 w-8" />
          </span>
          <h3 className="mt-4 text-base font-bold text-foreground">
            {searchQuery ? "Tidak ada transaksi yang cocok" : "Belum ada transaksi"}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {searchQuery
              ? "Coba kata kunci pencarian lain."
              : "Pesanan dengan status ini belum tersedia."}
          </p>
          {!searchQuery && (
            <Link
              to="/produk"
              className="mt-5 rounded-md bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90"
            >
              Mulai Belanja
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map((trx) => (
            <TrxCard key={trx.id} trx={trx} />
          ))}
          {isLoadingMore && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          )}
          <div ref={loadMoreRef} className="h-4" />
        </div>
      )}
    </div>
  );
}
