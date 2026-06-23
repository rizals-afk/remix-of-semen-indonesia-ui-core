import { LogOut } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

/**
 * Confirmation modal triggered from the account sidebar / header
 * "Keluar" action. Mirrors the logout screen in the uploaded designs.
 */
export function LogoutDialog({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-none p-8 text-center sm:rounded-2xl">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary-soft text-primary">
          <LogOut className="h-8 w-8" />
        </div>
        <h2 className="mt-4 text-lg font-bold text-primary">
          Apakah Anda yakin ingin keluar dari Bahan Material?
        </h2>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="h-11 rounded-md bg-muted-foreground/50 text-sm font-bold text-white hover:bg-muted-foreground/70"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="h-11 rounded-md bg-primary text-sm font-bold text-primary-foreground hover:bg-primary/90"
          >
            Keluar
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}