import { useState, type ReactNode } from "react";
import { HelpCircle, Home, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const REASONS = [
  "Berubah pikiran",
  "Salah memilih produk / jumlah",
  "Ingin mengubah alamat pengiriman",
  "Proses terlalu lama",
  "Menemukan harga lebih murah",
  "Lainnya",
];

interface CancelOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string) => void | Promise<void>;
  isSubmitting?: boolean;
  trigger?: ReactNode;
}

/** "Batalkan Pesanan?" confirmation modal with a reason selector. */
export function CancelOrderDialog({
  open,
  onOpenChange,
  onConfirm,
  isSubmitting,
  trigger,
}: CancelOrderDialogProps) {
  const [reason, setReason] = useState("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent className="max-w-xl p-0 gap-0">
        <DialogHeader className="relative border-b border-border px-6 py-5">
          <span className="absolute left-6 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-destructive text-destructive-foreground">
            <HelpCircle className="h-5 w-5" />
          </span>
          <DialogTitle className="text-center text-2xl font-extrabold text-primary">
            Batalkan Pesanan?
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-6">
          <p className="text-center text-lg font-extrabold text-destructive">
            Apakah Anda Yakin ingin Membatalkan Pesanan?
          </p>

          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="mt-6 w-full rounded-full border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
          >
            <option value="">Pilih Alasan</option>
            {REASONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          <div className="mt-6 flex flex-wrap gap-4">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-primary px-5 py-3 text-base font-bold text-primary hover:bg-primary/5"
            >
              <Home className="h-5 w-5" />
              Kembali
            </button>
            <button
              type="button"
              onClick={() => onConfirm(reason)}
              disabled={isSubmitting}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-destructive px-5 py-3 text-base font-bold text-destructive-foreground hover:bg-destructive/90 disabled:opacity-60"
            >
              <Check className="h-5 w-5" />
              {isSubmitting ? "Membatalkan..." : "Batalkan Pesanan"}
            </button>
          </div>

          <p className="mt-5 text-center text-sm italic text-muted-foreground">
            Anda akan menerima notifikasi setelah pesanan dibatalkan
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
