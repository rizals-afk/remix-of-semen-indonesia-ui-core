import type { OrderStatus } from "@/data/orders";
import { STATUS_LABEL } from "@/data/orders";

/**
 * In the new design statuses are rendered as a colored inline label
 * (not a pill). Most statuses are primary blue; "selesai" is green;
 * "dibatalkan" and "pengembalian" are warm (orange / red).
 */
const TONE: Record<OrderStatus, string> = {
  "menunggu-verifikasi": "text-primary",
  "menunggu-pembayaran": "text-primary",
  diproses: "text-primary",
  dikirim: "text-primary",
  selesai: "text-success",
  pengembalian: "text-accent",
  dibatalkan: "text-destructive",
};

export function OrderStatusBadge({
  status,
  variant = "link",
}: {
  status: OrderStatus;
  /** "link" = colored text (list rows); "pill" = filled chip. */
  variant?: "link" | "pill";
}) {
  if (variant === "pill") {
    return (
      <span className={"inline-flex items-center rounded-full bg-primary-soft px-3 py-1 text-xs font-bold " + TONE[status]}>
        {STATUS_LABEL[status]}
      </span>
    );
  }
  return (
    <span className={"text-sm font-semibold " + TONE[status]}>{STATUS_LABEL[status]}</span>
  );
}
