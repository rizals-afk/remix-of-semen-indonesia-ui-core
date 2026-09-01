import { useState } from "react";
import { Warehouse, Camera, Video, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QuantityStepper } from "@/components/common/QuantityStepper";

export interface ReturnProduct {
  name: string;
  variant?: string;
  image?: string;
  maxQty?: number;
}

interface ReturnRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  warehouseName?: string;
  product: ReturnProduct;
  address?: { name?: string; phone?: string; address?: string };
  onSubmit?: (payload: {
    qty: number;
    reason: string;
    type: "refund" | "retur";
    description: string;
  }) => void | Promise<void>;
}

const REASONS = [
  "Barang rusak",
  "Barang tidak sesuai pesanan",
  "Jumlah tidak sesuai",
  "Kemasan rusak",
  "Lainnya",
];

/** "Pengembalian Produk" modal for refund / return requests. */
export function ReturnRequestDialog({
  open,
  onOpenChange,
  warehouseName,
  product,
  address,
  onSubmit,
}: ReturnRequestDialogProps) {
  const [qty, setQty] = useState(1);
  const [reason, setReason] = useState("");
  const [type, setType] = useState<"refund" | "retur">("retur");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit?.({ qty, reason, type, description });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0">
        <DialogHeader className="border-b border-border px-6 py-5">
          <DialogTitle className="text-xl font-extrabold text-primary">
            Pengembalian Produk
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
          {warehouseName ? (
            <p className="flex items-center gap-2 text-sm font-bold text-foreground">
              <Warehouse className="h-4 w-4" />
              {warehouseName}
            </p>
          ) : null}

          <div className="mt-3 flex items-center gap-4">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
              {product.image ? (
                <img src={product.image} alt={product.name} className="h-full w-full object-contain p-1" loading="lazy" />
              ) : null}
            </div>
            <div className="min-w-0">
              <p className="text-base font-bold text-foreground">{product.name}</p>
              {product.variant ? <p className="text-sm text-muted-foreground">{product.variant}</p> : null}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-end gap-3">
            <span className="text-sm text-muted-foreground">Jumlah barang rusak:</span>
            <QuantityStepper value={qty} onChange={setQty} min={1} max={product.maxQty} />
          </div>

          <div className="mt-5 flex items-center justify-between gap-3">
            <span className="text-sm font-bold text-foreground">Alasan</span>
            <div className="flex items-center gap-1">
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="bg-transparent text-right text-sm text-muted-foreground focus:outline-none"
              >
                <option value="">Pilih alasan</option>
                {REASONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <p className="mt-5 text-sm font-bold text-foreground">Pilih Tipe Pengembalian</p>
          <div className="mt-2 grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setType("refund")}
              className={`rounded-lg border-2 px-5 py-3 text-base font-bold ${
                type === "refund"
                  ? "border-primary bg-primary/20 text-primary"
                  : "border-primary text-primary hover:bg-primary/5"
              }`}
            >
              Refund (Dana)
            </button>
            <button
              type="button"
              onClick={() => setType("retur")}
              className={`rounded-lg border-2 px-5 py-3 text-base font-bold ${
                type === "retur"
                  ? "border-primary bg-primary/20 text-primary"
                  : "border-primary text-primary hover:bg-primary/5"
              }`}
            >
              Retur Barang
            </button>
          </div>

          <div className="mt-5">
            <p className="text-sm font-bold text-foreground">Alamat Pengiriman</p>
            <div className="mt-1 flex items-start justify-between gap-4">
              <div className="text-sm text-muted-foreground">
                <p>
                  {address?.name ?? "-"}
                  {address?.phone ? ` (${address.phone})` : ""}
                </p>
                <p>{address?.address ?? "-"}</p>
              </div>
              <button type="button" className="shrink-0 text-sm text-muted-foreground hover:text-foreground">
                Ubah
              </button>
            </div>
          </div>

          <p className="mt-5 text-sm font-bold text-foreground">Tambahkan Foto dan Video</p>
          <div className="mt-2 flex gap-4">
            <button type="button" className="grid h-20 w-20 place-items-center gap-1 rounded-md bg-muted text-muted-foreground hover:bg-muted/80">
              <Camera className="h-6 w-6" />
              <span className="text-xs font-semibold text-accent">Foto</span>
            </button>
            <button type="button" className="grid h-20 w-20 place-items-center gap-1 rounded-md bg-muted text-muted-foreground hover:bg-muted/80">
              <Video className="h-6 w-6" />
              <span className="text-xs font-semibold text-accent">Video</span>
            </button>
          </div>

          <p className="mt-5 text-sm font-bold text-foreground">Deskripsi (Opsional)</p>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Tulis deskripsi alasan pengembalian"
            className="mt-2 w-full rounded-md bg-muted px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="rounded-md bg-primary px-12 py-3 text-base font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
            >
              {isSubmitting ? "Mengirim..." : "Kirim"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
