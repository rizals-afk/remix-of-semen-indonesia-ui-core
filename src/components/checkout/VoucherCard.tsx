import { Ticket } from "lucide-react";
import { formatRupiah } from "@/lib/format";
import type { Voucher } from "@/data/shopping";

interface VoucherCardProps {
  voucher: Voucher;
  selected?: boolean;
  disabled?: boolean;
  onSelect?: () => void;
}

const TYPE_COLORS: Record<Voucher["type"], string> = {
  shipping: "bg-success/15 text-success",
  discount: "bg-accent-soft text-accent",
  cashback: "bg-primary-soft text-primary",
};

/** Reusable voucher tile for the voucher picker. */
export function VoucherCard({ voucher, selected, disabled, onSelect }: VoucherCardProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      className={
        "flex w-full items-stretch gap-0 overflow-hidden rounded-xl border text-left transition-colors disabled:cursor-not-allowed disabled:opacity-50 " +
        (selected ? "border-primary bg-primary-soft/30" : "border-border bg-card hover:border-primary/60")
      }
    >
      <div className={"grid w-24 shrink-0 place-items-center " + TYPE_COLORS[voucher.type]}>
        <Ticket className="h-7 w-7" />
      </div>
      <div className="flex-1 p-4">
        <p className="text-sm font-bold text-foreground">{voucher.title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{voucher.description}</p>
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="font-mono font-semibold text-primary">{voucher.code}</span>
          <span className="text-muted-foreground">Berakhir {voucher.expiresAt}</span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Hemat hingga <span className="font-semibold text-foreground">{formatRupiah(voucher.discount)}</span>
        </p>
      </div>
    </button>
  );
}
