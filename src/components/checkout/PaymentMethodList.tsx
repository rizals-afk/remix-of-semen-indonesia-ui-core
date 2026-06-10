import { Check, CreditCard } from "lucide-react";
import { formatRupiah } from "@/lib/format";
import type { PaymentMethod } from "@/data/shopping";

interface PaymentMethodListProps {
  methods: PaymentMethod[];
  selectedId?: string;
  onSelect: (m: PaymentMethod) => void;
}

/** Grouped list of payment methods with single-select behaviour. */
export function PaymentMethodList({ methods, selectedId, onSelect }: PaymentMethodListProps) {
  const groups = methods.reduce<Record<string, PaymentMethod[]>>((acc, m) => {
    (acc[m.category] ||= []).push(m);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {Object.entries(groups).map(([cat, list]) => (
        <section key={cat}>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">
            {cat}
          </h3>
          <div className="space-y-2">
            {list.map((m) => {
              const isSelected = selectedId === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onSelect(m)}
                  className={
                    "flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-colors " +
                    (isSelected
                      ? "border-primary bg-primary-soft/30"
                      : "border-border bg-card hover:border-primary/60")
                  }
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-muted text-primary">
                    <CreditCard className="h-5 w-5" />
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">{m.name}</p>
                    {m.description ? (
                      <p className="text-xs text-muted-foreground">{m.description}</p>
                    ) : null}
                  </div>
                  {m.fee ? (
                    <span className="text-xs text-muted-foreground">+ {formatRupiah(m.fee)}</span>
                  ) : null}
                  <span
                    className={
                      "grid h-5 w-5 place-items-center rounded-full border-2 " +
                      (isSelected ? "border-primary bg-primary text-primary-foreground" : "border-border")
                    }
                  >
                    {isSelected ? <Check className="h-3 w-3" /> : null}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
