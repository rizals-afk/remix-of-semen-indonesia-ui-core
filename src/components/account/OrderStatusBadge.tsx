import type { OrderStatus } from "@/data/orders";
import { STATUS_LABEL } from "@/data/orders";

const STYLES: Record<OrderStatus, string> = {
  "menunggu-verifikasi": "bg-amber-100 text-amber-700",
  "menunggu-pembayaran": "bg-orange-100 text-orange-700",
  diproses: "bg-blue-100 text-blue-700",
  dikirim: "bg-indigo-100 text-indigo-700",
  selesai: "bg-emerald-100 text-emerald-700",
  dibatalkan: "bg-rose-100 text-rose-700",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={"inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold " + STYLES[status]}>
      {STATUS_LABEL[status]}
    </span>
  );
}
