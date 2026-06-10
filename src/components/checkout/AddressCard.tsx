import { MapPin, Pencil } from "lucide-react";
import type { Address } from "@/data/shopping";

interface AddressCardProps {
  address: Address;
  selected?: boolean;
  selectable?: boolean;
  onSelect?: () => void;
  onEdit?: () => void;
  compact?: boolean;
}

/** Reusable address tile: used in checkout summary, address picker, and account/addresses. */
export function AddressCard({ address, selected, selectable, onSelect, onEdit, compact }: AddressCardProps) {
  const Wrapper: "button" | "div" = selectable ? "button" : "div";
  return (
    <Wrapper
      type={selectable ? "button" : undefined}
      onClick={selectable ? onSelect : undefined}
      className={
        "block w-full rounded-xl border p-4 text-left transition-colors " +
        (selected
          ? "border-primary bg-primary-soft/40"
          : "border-border bg-card hover:border-primary/60")
      }
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
          <MapPin className="h-4 w-4" />
        </span>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">{address.label}</span>
            {address.isPrimary ? (
              <span className="rounded bg-accent-soft px-1.5 py-0.5 text-[10px] font-bold uppercase text-accent">
                Utama
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-sm font-medium text-foreground">
            {address.recipient} · {address.phone}
          </p>
          {!compact ? (
            <p className="mt-1 text-sm text-muted-foreground">
              {address.address}, {address.city}
            </p>
          ) : null}
        </div>
        {onEdit ? (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="text-xs font-semibold text-primary hover:underline"
          >
            <Pencil className="inline h-3.5 w-3.5" /> Ubah
          </button>
        ) : null}
      </div>
    </Wrapper>
  );
}
