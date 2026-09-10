import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { formatRupiah } from "@/lib/format";
import { type Trx, cancelTrx, fetchTrxById } from "@/lib/api/trx";
import { toast } from "sonner";
import { CancelOrderDialog } from "@/components/account/CancelOrderDialog";
import { ReviewDialog } from "@/components/account/ReviewDialog";

const STATUS_LABELS: Record<Trx["status"], string> = {
  pending: "Menunggu Verifikasi",
  approve: "Menunggu Pembayaran",
  process: "Diproses",
  delivery: "Dikirim",
  done: "Selesai",
  cancel: "Dibatalkan",
  retur: "Dikembalikan",
};

const STATUS_COLORS: Record<Trx["status"], string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approve: "bg-blue-100 text-blue-800",
  process: "bg-purple-100 text-purple-800",
  delivery: "bg-orange-100 text-orange-800",
  done: "bg-green-100 text-green-800",
  cancel: "bg-red-100 text-red-800",
  retur: "bg-gray-100 text-gray-800",
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function TrxCard({ trx, onCancel }: { trx: Trx; onCancel?: (id: number) => void }) {
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [fullTrx, setFullTrx] = useState<Trx | null>(null);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  const handleCancel = async () => {
    setIsCancelling(true);
    try {
      await cancelTrx(trx.id);
      toast.success("Pesanan berhasil dibatalkan");
      setIsCancelDialogOpen(false);
      onCancel?.(trx.id);
    } catch (error) {
      console.error("Failed to cancel transaction:", error);
      toast.error("Gagal membatalkan pesanan");
    } finally {
      setIsCancelling(false);
    }
  };

  const canCancel = trx.status === "pending" || trx.status === "approve";

  // Find lines that need review (trx_review is null)
  const linesNeedingReview = trx.lines?.filter(line => line.trx_review === null) || [];
  const hasItemsToReview = linesNeedingReview.length > 0;

  // Fetch full transaction details when opening review dialog
  useEffect(() => {
    if (isReviewOpen && !fullTrx) {
      fetchTrxById(trx.id).then(setFullTrx).catch(console.error);
    }
  }, [isReviewOpen, trx.id, fullTrx]);

  const currentReviewLine = fullTrx?.lines?.filter(line => line.trx_review === null)[currentReviewIndex];
  const dialogProduct = currentReviewLine ? {
    name: currentReviewLine.product?.name ?? "Produk",
    variant: currentReviewLine.product_variant?.variant_name,
    image: currentReviewLine.product_variant?.media?.[0]?.url ?? currentReviewLine.product?.photo,
    trxLineId: currentReviewLine.trx_line_id ?? currentReviewLine.id,
    productId: currentReviewLine.product_id,
    productVariantId: currentReviewLine.product_variant_id,
  } : null;

  const handleReviewSubmit = async () => {
    // Refresh transaction data
    const updatedTrx = await fetchTrxById(trx.id);
    setFullTrx(updatedTrx);
    // Move to next item if there are more to review
    const updatedLinesNeedingReview = updatedTrx.lines?.filter(line => line.trx_review === null) || [];
    if (currentReviewIndex < updatedLinesNeedingReview.length - 1) {
      setCurrentReviewIndex(currentReviewIndex + 1);
    } else {
      setIsReviewOpen(false);
      setFullTrx(null);
      setCurrentReviewIndex(0);
    }
  };

  return (
    <article className="rounded-2xl border border-border bg-card">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-5 pt-4">
        <div className="flex-1">
          <p className="text-sm font-bold text-foreground">{trx.code}</p>
          <p className="mt-1 text-xs text-muted-foreground">{formatDate(trx.created_at)}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_COLORS[trx.status]}`}>
          {STATUS_LABELS[trx.status]}
        </span>
      </div>

      {/* Product List */}
      <ul className="px-5 pb-4 pt-4">
        {trx.lines?.map((line, idx) => (
          <li
            key={`${line.product_id}-${line.product_variant_id}-${idx}`}
            className="flex items-center gap-4 py-3"
          >
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
              <img
                src={line.product_variant?.media?.[0]?.url || line.product?.photo || "/placeholder.png"}
                alt={line.product?.name || "Produk"}
                className="h-full w-full object-contain p-1"
                loading="lazy"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-1 text-sm font-bold text-foreground">
                {line.product?.name || "Produk"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {line.product_variant?.variant_name || ""}
              </p>
            </div>
            <div className="text-right text-sm">
              <p className="text-muted-foreground">x{(typeof line.qty === 'string' ? parseFloat(line.qty) : line.qty).toLocaleString('id-ID')}</p>
              <p className="mt-1 font-bold text-foreground">{formatRupiah(typeof line.price === 'string' ? parseFloat(line.price) : line.price)}</p>
            </div>
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border px-5 py-4">
        <div className="text-sm">
          <span className="text-muted-foreground">Total Pesanan: </span>
          <span className="text-base font-bold text-accent">{formatRupiah(typeof trx.total === 'string' ? parseFloat(trx.total) : trx.total)}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {canCancel && (
            <CancelOrderDialog
              open={isCancelDialogOpen}
              onOpenChange={setIsCancelDialogOpen}
              onConfirm={handleCancel}
              isSubmitting={isCancelling}
              trigger={
                <button className="rounded-md border-2 border-destructive px-5 py-2 text-sm font-bold text-destructive hover:bg-destructive/5">
                  Batalkan Pesanan
                </button>
              }
            />
          )}
          {trx.status === "done" && hasItemsToReview && (
            <button
              onClick={() => setIsReviewOpen(true)}
              className="rounded-md bg-primary px-5 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90"
            >
              Nilai
            </button>
          )}
          <Link
            to="/akun/transaksi/$id"
            params={{ id: trx.id.toString() }}
            className="rounded-md bg-primary px-5 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90"
          >
            Detail Pesanan
          </Link>
        </div>
      </div>

      {dialogProduct && (
        <ReviewDialog
          open={isReviewOpen}
          onOpenChange={(open) => {
            setIsReviewOpen(open);
            if (!open) {
              setFullTrx(null);
              setCurrentReviewIndex(0);
            }
          }}
          product={dialogProduct}
          onSubmit={handleReviewSubmit}
        />
      )}
    </article>
  );
}
