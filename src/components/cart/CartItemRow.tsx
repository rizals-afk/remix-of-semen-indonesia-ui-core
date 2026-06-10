import { MapPin, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { QuantityStepper } from "@/components/common/QuantityStepper";
import { formatRupiah } from "@/lib/format";
import type { CartProduct } from "@/data/shopping";

interface CartItemRowProps {
  item: CartProduct;
  selected: boolean;
  onToggle: () => void;
  onQtyChange: (qty: number) => void;
  onRemove: () => void;
  readOnly?: boolean;
}

/** Single cart line: checkbox + thumbnail + name + qty stepper + line total. */
export function CartItemRow({ item, selected, onToggle, onQtyChange, onRemove, readOnly }: CartItemRowProps) {
  return (
    <div className="flex gap-4 py-4">
      {!readOnly ? (
        <Checkbox checked={selected} onCheckedChange={onToggle} className="mt-2" aria-label="Pilih item" />
      ) : null}
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
        <img src={item.image} alt={item.name} className="h-full w-full object-contain p-2" loading="lazy" />
      </div>
      <div className="flex flex-1 flex-col gap-1.5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 text-sm font-semibold text-foreground">{item.name}</h3>
          {!readOnly ? (
            <button
              onClick={onRemove}
              aria-label="Hapus"
              className="text-muted-foreground transition-colors hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          ) : null}
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" /> {item.warehouse}
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-base font-bold text-accent">{formatRupiah(item.price)}</span>
          {item.originalPrice ? (
            <span className="text-xs text-muted-foreground line-through">{formatRupiah(item.originalPrice)}</span>
          ) : null}
          <span className="text-xs text-muted-foreground">/ {item.unit}</span>
        </div>
        <div className="mt-1 flex items-center justify-between">
          {readOnly ? (
            <span className="text-sm font-medium text-foreground">
              {item.qty} {item.unit}
            </span>
          ) : (
            <QuantityStepper value={item.qty} onChange={onQtyChange} min={1} />
          )}
          <span className="text-sm font-bold text-foreground">
            {formatRupiah(item.price * item.qty)}
          </span>
        </div>
      </div>
    </div>
  );
}
