import { Warehouse as WarehouseIcon, Truck, MapPin, Loader2 } from "lucide-react";
import { formatRupiah } from "@/lib/format";
import type { CartWarehouseGroup } from "@/store/cart";
import { QuantityStepper } from "@/components/common/QuantityStepper";

interface OrderProductGroupProps {
  group: CartWarehouseGroup;
  note: string;
  onNoteChange: (text: string) => void;
  /** Per-warehouse shipping fee (post-verification). Hidden if undefined or 0. */
  shippingFee?: number;
  /** Hide the note input + armada row, used on verified/paid screens where editing is locked. */
  readOnly?: boolean;
  /** Callback when quantity changes */
  onQtyChange?: (itemId: string, newQty: number) => void;
  /** Optional warehouse address line shown under the name. */
  address?: string;
  /** Optional delivery estimate label, e.g. "1 - 2 Hari". */
  etaLabel?: string;
  /** Optional handler for the "Lihat di Peta" link. */
  onViewMap?: () => void;
  /** Shipping state: 'initial' | 'loading' | 'calculated' */
  shippingState?: 'initial' | 'loading' | 'calculated';
  /** Callback when "Hitung Ongkir" button is clicked */
  onCalculateShipping?: () => void;
  /** Callback when "Ubah" shipping button is clicked */
  onChangeShipping?: () => void;
}

/** A "Produk Dipesan" card grouped per warehouse — used on checkout & payment screens. */
export function OrderProductGroup({
  group, note, onNoteChange, shippingFee, readOnly, onQtyChange,
  address, etaLabel = "", onViewMap, shippingState = 'initial', onCalculateShipping, onChangeShipping,
}: OrderProductGroupProps) {
  const cols =
    "grid grid-cols-[minmax(0,2.4fr)_minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_minmax(0,1fr)] items-center gap-4";

  return (
    <section className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
      {/* Header */}
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 border-b border-border/70 px-5 py-5 sm:px-6">
        <div className="flex min-w-0 items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
            <WarehouseIcon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-base font-bold text-foreground sm:text-lg">{group.warehouse}</h3>
              <span className="shrink-0 rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                {group.selectedItems.length} Produk
              </span>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              {address ? <span className="truncate">{address}</span> : null}
              {onViewMap && group.lat && group.long ? (
                <button
                  type="button"
                  onClick={onViewMap}
                  className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                >
                  <MapPin className="h-3.5 w-3.5" /> Lihat di Peta
                </button>
              ) : null}
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground"></p>
          <p className="text-sm font-bold text-foreground">{etaLabel}</p>
        </div>
      </header>

      {/* Product table */}
      <div className="px-5 sm:px-6">
        <div className={`${cols} hidden border-b border-border/70 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground md:grid`}>
          <span>Produk</span>
          <span>Harga Satuan</span>
          <span>Jumlah</span>
          <span>Tonase</span>
          <span className="text-right">Subtotal</span>
        </div>

        <div className="divide-y divide-border/70">
          {group.selectedItems.map((item) => (
            <div key={item.id} className={`${cols} py-4 max-md:grid-cols-1 max-md:gap-2`}>
              <div className="flex min-w-0 items-center gap-3">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                  <img src={item.image} alt={item.name} className="h-full w-full object-contain p-1" loading="lazy" />
                </div>
                <div className="min-w-0">
                  <p className="line-clamp-1 text-sm font-semibold text-foreground">{item.name}</p>
                  {item.variant ? <p className="text-xs text-muted-foreground">{item.variant}</p> : null}
                </div>
              </div>
              <span className="text-sm text-foreground max-md:before:mr-1 max-md:before:text-muted-foreground max-md:before:content-['Harga:']">
                {formatRupiah(item.price)}
              </span>
              {!readOnly && onQtyChange ? (
                <QuantityStepper value={item.qty} onChange={(newQty) => onQtyChange(item.id, newQty)} min={1} />
              ) : (
                <span className="text-sm text-foreground">{item.qty}</span>
              )}
              <span className="text-sm text-muted-foreground">
                {(((item.weightKg ?? 0) * item.qty)).toLocaleString("id-ID")} Ton
              </span>
              <span className="text-sm font-bold text-foreground md:text-right">
                {formatRupiah(item.price * item.qty)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Note + shipping */}
      {!readOnly ? (
        <div className="grid gap-4 border-t border-border/70 px-5 py-5 sm:px-6 lg:grid-cols-2">
          <div>
            <label htmlFor={`note-${group.warehouse}`} className="text-sm font-semibold text-foreground">
              Catatan untuk {group.warehouse} <span className="font-normal text-muted-foreground">(Opsional)</span>
            </label>
            <textarea
              id={`note-${group.warehouse}`}
              value={note}
              onChange={(e) => onNoteChange(e.target.value)}
              rows={3}
              placeholder="Tinggalkan catatan untuk gudang ini..."
              className="mt-2 w-full resize-none rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
            />
          </div>
          <div className="rounded-xl border border-border bg-muted/40 p-4">
            <div className="flex items-start gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary">
                <Truck className="h-4.5 w-4.5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-foreground">Pengiriman</p>
                {shippingState === 'initial' && (
                  <div className="mt-1">
                    <p className="text-sm text-muted-foreground">Belum memilih metode pengiriman</p>
                    {onCalculateShipping && (
                      <button
                        type="button"
                        onClick={onCalculateShipping}
                        className="mt-2 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                      >
                        Hitung Ongkir
                      </button>
                    )}
                  </div>
                )}
                {shippingState === 'loading' && (
                  <div className="mt-1 flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Menghitung ongkir...</p>
                  </div>
                )}
                {shippingState === 'calculated' && (
                  <div className="mt-1 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm text-foreground">Armada Gudang</p>
                      <p className="text-xs text-muted-foreground">Estimasi {etaLabel}</p>
                    </div>
                    <div className="text-right">
                      {shippingFee && shippingFee > 0 ? (
                        <p className="text-sm font-bold text-foreground">{formatRupiah(shippingFee)}</p>
                      ) : null}
                      {onChangeShipping && (
                        <button
                          type="button"
                          onClick={onChangeShipping}
                          className="text-xs font-semibold text-primary hover:underline"
                        >
                          Ubah
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Warehouse summary */}
      <div className="grid gap-3 border-t border-border/70 bg-muted/40 px-5 py-4 sm:px-6 md:grid-cols-4">
        <SummaryCell label="Subtotal Barang" value={formatRupiah(group.subTotal)} />
        <SummaryCell label="Total Tonase" value={`${group.tonase.toLocaleString("id-ID")} Ton`} />
        <SummaryCell label="Ongkir" value={formatRupiah(shippingFee ?? 0)} />
        <div className="md:text-right">
          <p className="text-xs text-muted-foreground">Total {group.warehouse}</p>
          <p className="text-lg font-bold text-accent">{formatRupiah(group.subTotal + (shippingFee ?? 0))}</p>
        </div>
      </div>
    </section>
  );
}

function SummaryCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}
