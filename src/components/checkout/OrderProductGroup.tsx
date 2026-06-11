import { Warehouse as WarehouseIcon, Truck } from "lucide-react";
import { formatRupiah } from "@/lib/format";
import type { CartWarehouseGroup } from "@/store/cart";

interface OrderProductGroupProps {
  group: CartWarehouseGroup;
  note: string;
  onNoteChange: (text: string) => void;
  /** Per-warehouse shipping fee (post-verification). Hidden if undefined or 0. */
  shippingFee?: number;
  /** Hide the note input + armada row, used on verified/paid screens where editing is locked. */
  readOnly?: boolean;
}

/** A "Produk Dipesan" card grouped per warehouse — used on checkout & payment screens. */
export function OrderProductGroup({ group, note, onNoteChange, shippingFee, readOnly }: OrderProductGroupProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="grid grid-cols-[minmax(0,2.4fr)_minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_minmax(0,1fr)] items-center gap-3 border-b border-border px-5 py-4 text-xs font-bold uppercase tracking-wide text-muted-foreground">
        <span className="text-base font-bold capitalize tracking-normal text-foreground">Produk Dipesan</span>
        <span>Harga Satuan</span>
        <span>Jumlah</span>
        <span>Tonase</span>
        <span>Subtotal Produk</span>
      </div>

      <div className="flex items-center gap-2 px-5 pt-4 text-sm font-semibold text-foreground">
        <WarehouseIcon className="h-4 w-4 text-muted-foreground" />
        {group.warehouse}
      </div>

      <div className="divide-y divide-border px-5 pb-4 pt-2">
        {group.selectedItems.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-[minmax(0,2.4fr)_minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_minmax(0,1fr)] items-center gap-3 py-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                <img src={item.image} alt={item.name} className="h-full w-full object-contain p-1" loading="lazy" />
              </div>
              <div className="min-w-0">
                <p className="line-clamp-1 text-sm font-semibold text-foreground">{item.name}</p>
                {item.variant ? <p className="text-xs text-muted-foreground">{item.variant}</p> : null}
              </div>
            </div>
            <span className="text-sm text-foreground">{formatRupiah(item.price)}</span>
            <span className="text-sm text-foreground">{item.qty}</span>
            <span className="text-sm text-foreground">{((item.weightKg ?? 0) * item.qty / 1000).toLocaleString("id-ID")} Ton</span>
            <span className="text-sm font-semibold text-foreground">{formatRupiah(item.price * item.qty)}</span>
          </div>
        ))}
      </div>

      {!readOnly ? (
        <div className="grid gap-3 border-t border-border px-5 py-4 sm:grid-cols-[auto_1fr_auto] sm:items-center">
          <label htmlFor={`note-${group.warehouse}`} className="text-sm font-semibold text-foreground">Pesan:</label>
          <input
            id={`note-${group.warehouse}`}
            value={note}
            onChange={(e) => onNoteChange(e.target.value)}
            placeholder="Tinggalkan Pesan"
            className="rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
          <div className="flex items-center justify-between gap-3 rounded-md bg-primary-soft/50 px-3 py-2 text-sm font-semibold text-primary">
            <span className="inline-flex items-center gap-2"><Truck className="h-4 w-4" /> Armada Gudang</span>
            {shippingFee && shippingFee > 0 ? <span>{formatRupiah(shippingFee)}</span> : null}
          </div>
        </div>
      ) : null}

      <div className="flex items-center justify-between border-t border-border px-5 py-3 text-sm">
        <span className="font-semibold text-foreground">Total Pesanan</span>
        <span className="font-bold text-foreground">{formatRupiah(group.subTotal + (shippingFee ?? 0))}</span>
      </div>
    </div>
  );
}
