import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ConfirmReceivedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;
  isSubmitting?: boolean;
}

/** "Konfirmasi Pesanan Tiba" modal shown before marking an order as done. */
export function ConfirmReceivedDialog({
  open,
  onOpenChange,
  onConfirm,
  isSubmitting,
}: ConfirmReceivedDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="sr-only">Konfirmasi Pesanan Tiba</DialogTitle>
        </DialogHeader>
        <p className="px-2 pt-2 text-center text-sm leading-relaxed text-muted-foreground">
          Mohon periksa kondisi kelengkapan dan kondisi pesanan sebelum mengonfirmasi
          penerimaan pesanan.
        </p>
        <div className="mt-4 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-md bg-muted px-8 py-3 text-base font-bold text-muted-foreground hover:bg-muted/80"
          >
            Nanti Saja
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="rounded-md bg-primary px-8 py-3 text-base font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
          >
            {isSubmitting ? "Memproses..." : "Konfirmasi"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
