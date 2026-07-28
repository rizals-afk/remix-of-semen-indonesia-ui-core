import { ChevronDown, Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { QuantityStepper } from "@/components/common/QuantityStepper";
import { formatRupiah } from "@/lib/format";
import type { CartProduct } from "@/data/shopping";
import type { CartWarehouseGroup } from "@/store/cart";

interface CartWarehouseGroupCardProps {
  group: CartWarehouseGroup;
  selectedIds: Set<string>;
  updatingIds: Set<string>;
  deletingIds: Set<string>;
  onToggleItem: (id: string) => void;
  onToggleGroup: (warehouse: string, select: boolean) => void;
  onQtyChange: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}

/** Cart table — items grouped under a warehouse header with bulk-select checkbox. */
export function CartWarehouseGroupCard({
  group, selectedIds, updatingIds, deletingIds, onToggleItem, onToggleGroup, onQtyChange, onRemove,
}: CartWarehouseGroupCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <label className="flex items-center gap-3 border-b border-border px-5 py-4 text-sm font-bold text-foreground">
        <Checkbox
          checked={group.allSelected}
          onCheckedChange={(v) => onToggleGroup(group.warehouse, Boolean(v))}
        />
        {group.warehouse}
      </label>
      <div className="divide-y divide-border">
        {group.items.map((item) => (
          <CartTableRow
            key={item.id}
            item={item}
            selected={selectedIds.has(item.id)}
            isUpdating={updatingIds.has(item.id)}
            isDeleting={deletingIds.has(item.id)}
            onToggle={() => onToggleItem(item.id)}
            onQtyChange={(q) => onQtyChange(item.id, q)}
            onRemove={() => onRemove(item.id)}
          />
        ))}
      </div>
    </div>
  );
}

interface CartTableRowProps {
  item: CartProduct;
  selected: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  onToggle: () => void;
  onQtyChange: (qty: number) => void;
  onRemove: () => void;
}

function CartTableRow({ item, selected, isUpdating, isDeleting, onToggle, onQtyChange, onRemove }: CartTableRowProps) {
  return (
    <div className={`grid grid-cols-[auto_minmax(0,2.2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 transition-opacity ${isDeleting ? "opacity-50" : ""}`}>
      <Checkbox checked={selected} onCheckedChange={onToggle} aria-label="Pilih item" disabled={isDeleting} />
      <div className="flex items-center gap-4 min-w-0">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
          <img src={item.image} alt={item.name} loading="lazy" className="h-full w-full object-contain p-1.5" />
        </div>
        <div className="min-w-0">
          <h3 className="line-clamp-2 text-sm font-semibold text-foreground">{item.name}</h3>
          {item.variant ? (
            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
              <span>Varian:</span>
              <span className="inline-flex items-center gap-1 rounded bg-muted px-2 py-0.5 font-medium text-foreground">
                {item.variant} <ChevronDown className="h-3 w-3" />
              </span>
            </div>
          ) : null}
        </div>
      </div>
      <div className="text-sm text-foreground">{formatRupiah(item.price)}</div>
      <div className="flex items-center gap-2">
        <QuantityStepper value={item.qty} onChange={onQtyChange} min={1} disabled={isUpdating || isDeleting} />
        {isUpdating && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
      </div>
      <div className="text-sm font-bold text-accent">{formatRupiah(item.price * item.qty)}</div>
      <button
        onClick={onRemove}
        disabled={isDeleting}
        className="text-sm font-semibold text-primary hover:underline disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
      >
        {isDeleting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Menghapus...
          </>
        ) : (
          "Hapus"
        )}
      </button>
    </div>
  );
}
