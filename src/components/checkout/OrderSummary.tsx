import { formatRupiah } from "@/lib/format";

export interface SummaryRow {
  label: string;
  value: number;
  hint?: string;
  emphasize?: boolean;
  isDiscount?: boolean;
}

interface OrderSummaryProps {
  rows: SummaryRow[];
  total: number;
  totalLabel?: string;
  cta?: { label: string; onClick: () => void; disabled?: boolean };
  secondary?: React.ReactNode;
  title?: string;
}

/** Sticky right-rail summary box used in cart + checkout + payment screens. */
export function OrderSummary({
  rows,
  total,
  totalLabel = "Total Pembayaran",
  cta,
  secondary,
  title = "Ringkasan Belanja",
}: OrderSummaryProps) {
  return (
    <aside className="h-fit rounded-2xl border border-border bg-card p-5 lg:sticky lg:top-24">
      <h2 className="text-base font-bold text-foreground">{title}</h2>
      <dl className="mt-4 space-y-3 text-sm">
        {rows.map((row) => (
          <div key={row.label} className="flex items-start justify-between gap-3">
            <dt className="text-muted-foreground">
              {row.label}
              {row.hint ? <span className="block text-xs">{row.hint}</span> : null}
            </dt>
            <dd
              className={
                "text-right font-semibold " +
                (row.isDiscount ? "text-success" : "text-foreground")
              }
            >
              {row.isDiscount ? "- " : ""}
              {formatRupiah(Math.abs(row.value))}
            </dd>
          </div>
        ))}
      </dl>
      <div className="mt-4 border-t border-border pt-4">
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-semibold text-foreground">{totalLabel}</span>
          <span className="text-xl font-bold text-accent">{formatRupiah(total)}</span>
        </div>
      </div>
      {cta ? (
        <button
          onClick={cta.onClick}
          disabled={cta.disabled}
          className="mt-5 w-full rounded-md bg-primary py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {cta.label}
        </button>
      ) : null}
      {secondary}
    </aside>
  );
}
