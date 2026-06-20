import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ClipboardList } from "lucide-react";
import { UnderlineTabs } from "@/components/common/Tabs";
import { OrderCard } from "@/components/account/OrderCard";
import { ORDERS, type OrderStatus } from "@/data/orders";

export const Route = createFileRoute("/akun/transaksi/")({
  head: () => ({ meta: [{ title: "Riwayat Pesanan — BahanMaterial.com" }] }),
  component: TransactionsPage,
});

const TABS = [
  "Diverifikasi",
  "Belum Bayar",
  "Diproses",
  "Dikirim",
  "Selesai",
  "Pengembalian",
  "Dibatalkan",
] as const;
type Tab = (typeof TABS)[number];

const TAB_TO_STATUS: Record<Tab, OrderStatus> = {
  Diverifikasi: "menunggu-verifikasi",
  "Belum Bayar": "menunggu-pembayaran",
  Diproses: "diproses",
  Dikirim: "dikirim",
  Selesai: "selesai",
  Pengembalian: "pengembalian",
  Dibatalkan: "dibatalkan",
};

function TransactionsPage() {
  const [tab, setTab] = useState<Tab>("Belum Bayar");

  const orders = useMemo(() => {
    const status = TAB_TO_STATUS[tab];
    return ORDERS.filter((o) => o.status === status);
  }, [tab]);

  return (
    <div className="space-y-5 rounded-2xl border border-border bg-card p-5">
      <div className="overflow-x-auto">
        <UnderlineTabs tabs={TABS} value={tab} onChange={setTab} tone="primary" />
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
