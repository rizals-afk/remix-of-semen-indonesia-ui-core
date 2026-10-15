import type { OrderStatus } from "@/data/orders";
import pesananDibuatIcon from "@/assets/transaksi/Pesanan_Dibuat.png";
import pesananDiverfikasiIcon from "@/assets/transaksi/Pesanan_Diverfikasi.png";
import pembayaranIcon from "@/assets/transaksi/Pembayaran.png";
import pesananDikirimIcon from "@/assets/transaksi/Pesanan_Dikirim.png";
import pesananSelesaiIcon from "@/assets/transaksi/Pesanan_Selesai.png";

interface Step {
  key: "dibuat" | "verifikasi" | "pembayaran" | "dikirim" | "selesai";
  label: string;
  icon: string;
}

const ORDER_STEPS: Step[] = [
  { key: "dibuat", label: "Pesanan Dibuat", icon: pesananDibuatIcon },
  { key: "verifikasi", label: "Pesanan Diverifikasi", icon: pesananDiverfikasiIcon },
  { key: "pembayaran", label: "Pembayaran", icon: pembayaranIcon },
  { key: "dikirim", label: "Pesanan Dikirimkan", icon: pesananDikirimIcon },
  { key: "selesai", label: "Pesanan Selesai", icon: pesananSelesaiIcon },
];

const RETUR_STEPS: Step[] = [
  { key: "dibuat", label: "Pengembalian Diajukan", icon: pesananDibuatIcon },
  { key: "verifikasi", label: "Pengembalian Diverifikasi", icon: pesananDiverfikasiIcon },
  { key: "dikirim", label: "Pengembalian Dikirimkan", icon: pesananDikirimIcon },
  { key: "selesai", label: "Pengembalian Selesai", icon: pesananSelesaiIcon },
];

/** Map an order status to the index of the LAST completed step. */
function activeIndex(status: OrderStatus, isRetur: boolean = false): number {
  switch (status) {
    case "menunggu-verifikasi":
      return 0;
    case "menunggu-pembayaran":
      return isRetur ? 1 : 1; // For retur, this maps to verifikasi step
    case "diproses":
      return isRetur ? 1 : 2;
    case "dikirim":
      return isRetur ? 2 : 3;
    case "selesai":
      return isRetur ? 3 : 4;
    case "pengembalian":
      return isRetur ? 3 : 4;
    case "dibatalkan":
      return 0;
  }
}

export function OrderStatusStepper({
  status,
  timestamps,
  isRetur = false,
}: {
  status: OrderStatus;
  /** Optional per-step timestamp shown below the step label. */
  timestamps?: Partial<Record<Step["key"], string>>;
  /** Whether this is a retur transaction (removes pembayaran step) */
  isRetur?: boolean;
}) {
  const active = activeIndex(status, isRetur);
  const steps = isRetur ? RETUR_STEPS : ORDER_STEPS;
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <ol className="flex items-start justify-between gap-2">
        {steps.map((step, idx) => {
          const done = idx <= active;
          const current = idx === active;
          return (
            <li key={step.key} className="flex flex-1 flex-col items-center text-center">
              <span
                className={
                  "grid h-16 w-16 place-items-center rounded-full border-2 " +
                  (current
                    ? "border-primary bg-primary"
                    : done
                    ? "border-primary bg-primary/10"
                    : "border-border")
                }
              >
                <img
                  src={step.icon}
                  alt={step.label}
                  className={`h-8 w-8 ${current ? "brightness-0 invert" : ""}`}
                />
              </span>
              <p
                className={
                  "mt-2 text-xs font-semibold leading-tight " +
                  (done ? "text-foreground" : "text-muted-foreground")
                }
              >
                {step.label}
              </p>
              {timestamps?.[step.key] && done ? (
                <p className="mt-0.5 text-[11px] text-muted-foreground">{timestamps[step.key]}</p>
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}