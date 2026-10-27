import { Ticket } from "lucide-react";
import { formatRupiah } from "@/lib/format";
import type { Voucher } from "@/data/shopping";

interface VoucherCardProps {
  voucher: Voucher;
  selected?: boolean;
  disabled?: boolean;
  onSelect?: () => void;
  isClaimed?: boolean;
  isClaimable?: boolean;
  onClaim?: () => void;
  isClaiming?: boolean;
}

const TYPE_COLORS: Record<Voucher["type"], string> = {
  shipping: "bg-success/15 text-success",
  discount: "bg-accent-soft text-accent",
  cashback: "bg-primary-soft text-primary",
};

/** Reusable voucher tile for the voucher picker. */
export function VoucherCard({ voucher, selected, disabled, onSelect, isClaimed, isClaimable, onClaim, isClaiming }: VoucherCardProps) {
  const content = (
    <>
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
          {voucher.type === "discount" ? (
            <>Diskon <span className="font-semibold text-foreground">{voucher.discount}%</span></>
          ) : (
            <>Hemat hingga <span className="font-semibold text-foreground">{formatRupiah(voucher.discount)}</span></>
          )}
        </p>
        {onClaim && isClaimable && !isClaimed && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClaim();
            }}
            disabled={isClaiming}
            className="mt-2 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isClaiming ? "Memproses..." : "Pakai"}
          </button>
        )}
        {isClaimed && (
          <span className="mt-2 inline-block rounded-md bg-success/15 px-3 py-1.5 text-xs font-semibold text-success">
            Sudah Dipakai
          </span>
        )}
      </div>
    </>
  );

  if (onSelect) {
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
        {content}
      </button>
    );
  }

  return (
    <div
      className={
        "flex w-full items-stretch gap-0 overflow-hidden rounded-xl border text-left transition-colors " +
        (selected ? "border-primary bg-primary-soft/30" : "border-border bg-card")
      }
    >
      {content}
    </div>
  );
}
