import { Clock, MapPin } from "lucide-react";
import type { Warehouse } from "@/data/shopping";

interface WarehouseCardProps {
  warehouse: Warehouse;
  selected?: boolean;
  onSelect?: () => void;
}

/** Reusable warehouse tile used in the warehouse picker + pickup checkout. */
export function WarehouseCard({ warehouse, selected, onSelect }: WarehouseCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={
        "flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-colors " +
        (selected
          ? "border-primary bg-primary-soft/40"
          : "border-border bg-card hover:border-primary/60")
      }
    >
      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
        <MapPin className="h-4 w-4" />
      </span>
      <div className="flex-1">
        <p className="text-sm font-semibold text-foreground">{warehouse.name}</p>
        <p className="mt-0.5 text-sm text-muted-foreground">{warehouse.address}</p>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3 w-3" /> {warehouse.distanceKm} km
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" /> {warehouse.hours}
          </span>
        </div>
      </div>
    </button>
  );
}
