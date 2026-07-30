import { Link } from "@tanstack/react-router";
import { formatRupiah } from "@/lib/format";
import { type Trx } from "@/lib/api/trx";

const STATUS_LABELS: Record<Trx["status"], string> = {
  pending: "Menunggu Verifikasi",
  approve: "Menunggu Pembayaran",
  proses: "Diproses",
  delivery: "Dikirim",
  done: "Selesai",
  cancel: "Dibatalkan",
};

const STATUS_COLORS: Record<Trx["status"], string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approve: "bg-blue-100 text-blue-800",
  proses: "bg-purple-100 text-purple-800",
  delivery: "bg-orange-100 text-orange-800",
  done: "bg-green-100 text-green-800",
  cancel: "bg-red-100 text-red-800",
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function TrxCard({ trx }: { trx: Trx }) {
  return (
    <article className="rounded-2xl border border-border bg-card">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-5 pt-4">
        <div className="flex-1">
          <p className="text-sm font-bold text-foreground">{trx.code}</p>
          <p className="mt-1 text-xs text-muted-foreground">{formatDate(trx.created_at)}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_COLORS[trx.status]}`}>
          {STATUS_LABELS[trx.status]}
        </span>
      </div>

      {/* Shipping Address */}
      {trx.customer_location && (
        <div className="px-5 pt-4">
          <div className="rounded-md bg-muted/50 px-4 py-3">
            <p className="text-xs font-semibold text-foreground">
              {trx.customer_location.name}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {trx.customer_location.phone}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {trx.customer_location.address}
            </p>
          </div>
        </div>
      )}

      {/* Product List */}
      <ul className="px-5 pb-4 pt-4">
        {trx.lines.map((line, idx) => (
          <li 
            key={`${line.product_id}-${line.product_variant_id}-${idx}`} 
            className="flex items-center gap-4 py-3"
          >
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
              <img 
                src={line.product?.photo || "/placeholder.png"} 
                alt={line.product?.name || "Produk"} 
                className="h-full w-full object-contain p-1" 
                loading="lazy" 
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-1 text-sm font-bold text-foreground">
                {line.product?.name || "Produk"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {line.product_variant?.variant_name || ""}
              </p>
            </div>
            <div className="text-right text-sm">
              <p className="text-muted-foreground">x{line.qty}</p>
              <p className="mt-1 font-bold text-foreground">{formatRupiah(line.price)}</p>
            </div>
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border px-5 py-4">
        <div className="text-sm">
          <span className="text-muted-foreground">Total Pesanan: </span>
          <span className="text-base font-bold text-accent">{formatRupiah(trx.total)}</span>
        </div>
        <Link
          to="/akun/transaksi/$id"
          params={{ id: trx.id.toString() }}
          className="rounded-md bg-primary px-5 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90"
        >
          Detail Pesanan
        </Link>
      </div>
    </article>
  );
}
