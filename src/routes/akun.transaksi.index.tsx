import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ClipboardList, Search } from "lucide-react";
import { UnderlineTabs } from "@/components/common/Tabs";
import { OrderCard } from "@/components/account/OrderCard";
import { ORDERS, type OrderStatus } from "@/data/orders";

export const Route = createFileRoute("/akun/transaksi/")({
  head: () => ({ meta: [{ title: "Riwayat Transaksi — BahanMaterial.com" }] }),
  component: TransactionsPage,
});

const TABS = [
  "Semua",
  "Menunggu Verifikasi",
  "Menunggu Pembayaran",
  "Diproses",
  "Dikirim",
  "Selesai",
  "Dibatalkan",
] as const;
type Tab = (typeof TABS)[number];

const TAB_TO_STATUS: Record<Tab, OrderStatus | null> = {
  Semua: null,
  "Menunggu Verifikasi": "menunggu-verifikasi",
  "Menunggu Pembayaran": "menunggu-pembayaran",
  Diproses: "diproses",
  Dikirim: "dikirim",
  Selesai: "selesai",
  Dibatalkan: "dibatalkan",
};

function TransactionsPage() {
  const [tab, setTab] = useState<Tab>("Semua");
  const [q, setQ] = useState("");

  const orders = useMemo(() => {
    const status = TAB_TO_STATUS[tab];
    return ORDERS.filter((o) => {
      if (status && o.status !== status) return false;
      if (q.trim()) {
        const needle = q.toLowerCase();
        const matchesId = o.id.toLowerCase().includes(needle);
        const matchesName = o.groups.some((g) =>
          g.items.some((i) => i.name.toLowerCase().includes(needle)),
        );
        if (!matchesId && !matchesName) return false;
      }
      return true;
    });
  }, [tab, q]);

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-foreground">Riwayat Transaksi</h2>
          <div className="relative w-full max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari ID pesanan atau produk"
              className="w-full rounded-md border border-border bg-background py-2 pl-9 pr-3 text-sm focus:border-primary focus:outline-none"
            />
          </div>
        </div>
        <div className="mt-4 overflow-x-auto">
          <UnderlineTabs tabs={TABS} value={tab} onChange={setTab} tone="primary" />
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-muted text-muted-foreground">
            <ClipboardList className="h-8 w-8" />
          </span>
          <h3 className="mt-4 text-base font-bold text-foreground">Belum ada transaksi</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Pesanan dengan status ini belum tersedia.
          </p>
          <Link
            to="/produk"
            className="mt-5 rounded-md bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90"
          >
            Mulai Belanja
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <OrderCard key={o.id} order={o} />
          ))}
        </div>
      )}
    </div>
  );
}
