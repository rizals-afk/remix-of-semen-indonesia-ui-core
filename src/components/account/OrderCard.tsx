import { Link } from "@tanstack/react-router";
import { Coins } from "lucide-react";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { formatRupiah } from "@/lib/format";
import { orderTotal, type Order, type OrderWarehouseGroup } from "@/data/orders";

/** Status-driven footer copy on the left of the card footer row. */
function footerNote(order: Order): string | null {
  switch (order.status) {
    case "menunggu-verifikasi":
    case "menunggu-pembayaran":
      return order.deadline ? `Bayar Sekarang sebelum ${order.deadline}` : null;
    case "diproses":
      return order.deadline ? `Produk akan dikirimkan sebelum ${order.deadline}` : null;
    case "dikirim":
      return order.deadline ? `Konfirmasi terima produk sebelum ${order.deadline}` : null;
    case "selesai":
      return order.coinsHint
        ? `Nilai pesanan sebelum ${order.deadline ?? "—"} untuk dapatkan ${order.coinsHint} koin`
        : null;
    case "pengembalian":
    case "dibatalkan":
      return order.deadline ? `Bayar Sekarang sebelum ${order.deadline}` : null;
  }
}

function Actions({ order }: { order: Order }) {
  const detail = (
    <Link
      to="/akun/transaksi/$id"
      params={{ id: order.id }}
      className="rounded-md bg-primary px-5 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90"
    >
      Detail Pesanan
    </Link>
  );
  const outline = (label: string) => (
    <Link
      to="/akun/transaksi/$id"
      params={{ id: order.id }}
      className="rounded-md border-2 border-primary px-5 py-2 text-sm font-bold text-primary hover:bg-primary/5"
    >
      {label}
    </Link>
  );
  const primary = (label: string, to: string = `/akun/transaksi/${order.id}`) => (
    <Link
      to={to as "/akun/transaksi/$id"}
      params={to.includes("$id") ? { id: order.id } : undefined}
      className="rounded-md bg-primary px-5 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90"
    >
      {label}
    </Link>
  );

  switch (order.status) {
    case "menunggu-verifikasi":
      return (
        <>
          {outline("Batalkan Pesanan")}
          <a
            href="https://wa.me/6281133331800"
            target="_blank"
            rel="noreferrer"
            className="rounded-md bg-primary px-5 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90"
          >
            Hubungi Admin
          </a>
        </>
      );
    case "menunggu-pembayaran":
      return (
        <>
          {outline("Batalkan Pesanan")}
          <Link
            to="/checkout/pembayaran"
            className="rounded-md bg-primary px-5 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90"
          >
            Bayar Sekarang
          </Link>
        </>
      );
    case "diproses":
      return detail;
    case "dikirim":
      return primary("Pesanan Diterima");
    case "selesai":
      return (
        <>
          {outline("Beli Lagi")}
          {primary("Nilai")}
        </>
      );
    case "pengembalian":
      return primary("Rincian Pengembalian");
    case "dibatalkan":
      return (
        <>
          {outline("Rincian Pembatalan")}
          {primary("Beli Lagi")}
        </>
      );
  }
}

/** Single-warehouse order card used in the transaction history list. */
export function OrderCard({ order }: { order: Order }) {
  const note = footerNote(order);
  return (
    <article className="rounded-2xl border border-border bg-card">
      {order.groups.map((g, idx) => (
        <WarehouseSection
          key={g.warehouse + idx}
          group={g}
          status={order.status}
          showHeader={idx === 0}
          showStatus={idx === 0}
        />
      ))}

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border px-5 py-4">
        <p className="text-sm text-muted-foreground">{note}</p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <div className="text-sm">
            <span className="text-muted-foreground">Total Pesanan: </span>
            <span className="text-base font-bold text-accent">{formatRupiah(orderTotal(order))}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2 px-5 pb-5">
        {note && order.status === "selesai" ? (
          <span className="mr-auto inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Coins className="h-4 w-4 text-accent" />
          </span>
        ) : null}
        <Actions order={order} />
      </div>
    </article>
  );
}

function WarehouseSection({
  group,
  status,
  showHeader,
  showStatus,
}: {
  group: OrderWarehouseGroup;
  status: Order["status"];
  showHeader: boolean;
  showStatus: boolean;
}) {
  return (
    <div className={showHeader ? "" : "border-t border-border"}>
      <div className="flex items-center justify-between gap-3 px-5 pt-4">
        <p className="text-sm font-bold text-foreground">{group.warehouse}</p>
        {showStatus ? <OrderStatusBadge status={status} /> : null}
      </div>
      <ul className="px-5 pb-4">
        {group.items.map((item) => (
          <li key={item.id} className="flex items-center gap-4 py-3">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
              <img src={item.image} alt={item.name} className="h-full w-full object-contain p-1" loading="lazy" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-1 text-sm font-bold text-foreground">{item.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{item.variant}</p>
            </div>
            <div className="text-right text-sm">
              <p className="text-muted-foreground">x{item.qty}</p>
              <p className="mt-1 font-bold text-foreground">{formatRupiah(item.price)}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
