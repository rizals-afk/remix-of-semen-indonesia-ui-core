import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { formatRupiah } from "@/lib/format";

export interface FilterCategory {
  slug: string;
  label: string;
}

interface FilterSidebarProps {
  categories: FilterCategory[];
  selected: string[];
  onToggleCategory: (slug: string) => void;
  priceMin: number;
  priceMax: number;
  onPriceMinChange: (n: number) => void;
  onPriceMaxChange: (n: number) => void;
  onApply: () => void;
}

/** Listing sidebar with category accordion + price range, matching "Cari Produk" screen. */
export function FilterSidebar({
  categories,
  selected,
  onToggleCategory,
  priceMin,
  priceMax,
  onPriceMinChange,
  onPriceMaxChange,
  onApply,
}: FilterSidebarProps) {
  const [open, setOpen] = useState(true);
  return (
    <aside className="rounded-xl border border-border bg-card p-5">
      <h2 className="text-lg font-bold text-foreground">Filter</h2>
      <div className="mt-4">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between text-base font-semibold text-foreground"
        >
          Kategori
          <ChevronDown className={`h-4 w-4 transition-transform ${open ? "" : "-rotate-90"}`} />
        </button>
        {open ? (
          <ul className="mt-3 space-y-2">
            {categories.map((c) => {
              const isOn = selected.includes(c.slug);
              return (
                <li key={c.slug}>
                  <label className="flex cursor-pointer items-center justify-between gap-2 rounded-md py-1.5 text-sm text-foreground/90 hover:text-primary">
                    <span className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isOn}
                        onChange={() => onToggleCategory(c.slug)}
                        className="h-4 w-4 accent-primary"
                      />
                      {c.label}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
      <div className="mt-6 border-t border-border pt-4">
        <h3 className="text-base font-semibold text-foreground">Rentang Harga</h3>
        <div className="mt-3 space-y-3">
          <PriceField label="Min" value={priceMin} onChange={onPriceMinChange} />
          <PriceField label="Max" value={priceMax} onChange={onPriceMaxChange} />
          <button
            type="button"
            onClick={onApply}
            className="w-full rounded-md bg-muted py-2.5 text-sm font-semibold text-foreground hover:bg-muted/70"
          >
            Terapkan
          </button>
        </div>
      </div>
    </aside>
  );
}

function PriceField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <label className="block rounded-md border border-border px-3 py-2">
      <span className="block text-xs text-muted-foreground">{label}</span>
      <input
        inputMode="numeric"
        value={formatRupiah(value)}
        onChange={(e) => onChange(Number(e.target.value.replace(/\D/g, "")) || 0)}
        className="w-full bg-transparent text-sm font-medium text-foreground focus:outline-none"
      />
    </label>
  );
}
