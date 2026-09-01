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

const STEPS: Step[] = [
  { key: "dibuat", label: "Pesanan Dibuat", icon: pesananDibuatIcon },
  { key: "verifikasi", label: "Pesanan Diverifikasi", icon: pesananDiverfikasiIcon },
  { key: "pembayaran", label: "Pembayaran", icon: pembayaranIcon },
  { key: "dikirim", label: "Pesanan Dikirimkan", icon: pesananDikirimIcon },
  { key: "selesai", label: "Pesanan Selesai", icon: pesananSelesaiIcon },
];

/** Map an order status to the index of the LAST completed step. */
function activeIndex(status: OrderStatus): number {
  switch (status) {
    case "menunggu-verifikasi":
      return 0;
    case "menunggu-pembayaran":
      return 1;
    case "diproses":
      return 2;
    case "dikirim":
      return 3;
    case "selesai":
      return 4;
    case "pengembalian":
      return 4;
    case "dibatalkan":
      return 0;
  }
}

export function OrderStatusStepper({
  status,
  timestamps,
}: {
  status: OrderStatus;
  /** Optional per-step timestamp shown below the step label. */
  timestamps?: Partial<Record<Step["key"], string>>;
}) {
  const active = activeIndex(status);
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <ol className="flex items-start justify-between gap-2">
        {STEPS.map((step, idx) => {
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