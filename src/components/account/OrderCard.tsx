import { Link } from "@tanstack/react-router";
import { Warehouse, Truck, Store } from "lucide-react";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { formatRupiah } from "@/lib/format";
import { orderTotal, type Order } from "@/data/orders";

export function OrderCard({ order }: { order: Order }) {
  const totalItems = order.groups.reduce((s, g) => s + g.items.length, 0);
  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/40 px-5 py-3 text-sm">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
            {order.mode === "dikirim" ? <Truck className="h-4 w-4 text-primary" /> : <Store className="h-4 w-4 text-primary" />}
            {order.mode === "dikirim" ? "Dikirim" : "Diambil"}
          </span>
          <span className="text-muted-foreground">·</span>
          <span className="font-mono text-xs font-semibold text-muted-foreground">{order.id}</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-xs text-muted-foreground">{order.createdAt}</span>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="space-y-3 px-5 py-4">
        {order.groups.map((g) => (
          <div key={g.warehouse} className="flex items-center gap-3">
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
              <img src={g.items[0]?.image} alt={g.items[0]?.name} className="h-full w-full object-contain p-1" loading="lazy" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                <Warehouse className="h-3.5 w-3.5" /> {g.warehouse}
              </p>
              <p className="mt-0.5 line-clamp-1 text-sm font-semibold text-foreground">
                {g.items[0]?.name}
                {g.items.length > 1 ? <span className="text-muted-foreground"> +{g.items.length - 1} produk lain</span> : null}
              </p>
              <p className="text-xs text-muted-foreground">
                {g.items[0]?.qty} {g.items[0]?.unit} · {g.items[0]?.variant}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-4">
        <div className="text-sm">
          <p className="text-xs text-muted-foreground">Total Pembayaran ({totalItems} produk)</p>
          <p className="text-lg font-bold text-accent">{formatRupiah(orderTotal(order))}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {order.status === "menunggu-pembayaran" ? (
            <Link
              to="/checkout/pembayaran"
              className="rounded-md bg-accent px-5 py-2 text-sm font-bold text-accent-foreground hover:bg-accent/90"
            >
              Bayar Sekarang
            </Link>
          ) : null}
          {order.status === "selesai" ? (
            <button type="button" className="rounded-md border-2 border-primary px-5 py-2 text-sm font-bold text-primary hover:bg-primary/5">
              Beli Lagi
            </button>
          ) : null}
          <Link
            to="/akun/transaksi/$id"
            params={{ id: order.id }}
            className="rounded-md border border-border px-5 py-2 text-sm font-bold text-foreground hover:bg-muted"
          >
            Lihat Detail
          </Link>
        </div>
      </div>
    </article>
  );
}
