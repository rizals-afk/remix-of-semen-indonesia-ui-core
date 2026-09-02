import { useState, useRef } from "react";
import { createFileRoute, Link, notFound, useNavigate, useLoaderData } from "@tanstack/react-router";
import {
  Hourglass, Wallet, Truck, CheckCircle2, XCircle, RotateCcw, Info, Loader2,
} from "lucide-react";
import { OrderStatusStepper } from "@/components/account/OrderStatusStepper";
import { formatRupiah } from "@/lib/format";
import { fetchTrxById, cancelTrx, markTrxDone, generateSnapToken, type Trx } from "@/lib/api/trx";
import { createPayment } from "@/lib/api/payment";
import { toast } from "sonner";
import { loadMidtransSnap } from "@/lib/midtrans";
import alamatPengirimanIcon from "@/assets/transaksi/Alamat_Pengiriman.png";
import { CancelOrderDialog } from "@/components/account/CancelOrderDialog";
import { ConfirmReceivedDialog } from "@/components/account/ConfirmReceivedDialog";
import { ReviewDialog } from "@/components/account/ReviewDialog";
import { ReturnRequestDialog } from "@/components/account/ReturnRequestDialog";

export const Route = createFileRoute("/akun/transaksi/$id")({
  head: () => ({ meta: [{ title: "Detail Pesanan — BahanMaterial.com" }] }),
  loader: async ({ params }) => {
    try {
      const trx = await fetchTrxById(parseInt(params.id));
      return { trx };
    } catch (error) {
      console.error("Failed to fetch transaction:", error);
      throw notFound();
    }
  },
  component: OrderDetailPage,
  notFoundComponent: () => (
    <div className="rounded-2xl border border-border bg-card p-10 text-center">
      <h2 className="text-lg font-bold text-foreground">Pesanan tidak ditemukan</h2>
      <p className="mt-2 text-sm text-muted-foreground">Periksa kembali ID pesanan anda.</p>
      <Link to="/akun/transaksi" className="mt-5 inline-block rounded-md bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground">
        Kembali ke Riwayat
      </Link>
    </div>
  ),
});

interface BannerCopy {
  icon: typeof Hourglass;
  title: string;
  subtitle: string;
  tone: "primary" | "success" | "destructive" | "accent";
  invoice?: boolean;
}

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

function formatTimestamp(dateString: string): string {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}

function bannerFor(trx: Trx): BannerCopy {
  switch (trx.status) {
    case "pending":
      return {
        icon: Hourglass,
        title: "Menunggu Verifikasi",
        subtitle: "Pesanan anda sedang dalam proses peninjauan oleh tim admin pusat kami.",
        tone: "primary",
      };
    case "approve":
      return {
        icon: Wallet,
        title: "Menunggu Pembayaran",
        subtitle: "Silahkan lakukan pembayaran untuk melanjutkan pesanan.",
        tone: "primary",
      };
    case "process":
      return {
        icon: Hourglass,
        title: "Pesanan Diproses",
        subtitle: "Gudang sedang menyiapkan pesanan anda untuk pengiriman.",
        tone: "primary",
      };
    case "delivery":
      return {
        icon: Truck,
        title: "Pesanan Dikirim",
        subtitle: "Pesanan sedang dalam perjalanan menuju lokasi Anda.",
        tone: "primary",
      };
    case "done":
      return {
        icon: CheckCircle2,
        title: "Pesanan Selesai",
        subtitle: `Pesanan Diterima pada ${formatDate(trx.updated_at)}`,
        tone: "success",
        invoice: true,
      };
    case "cancel":
      return {
        icon: XCircle,
        title: "Pesanan Dibatalkan",
        subtitle: "Pesanan ini telah dibatalkan.",
        tone: "destructive",
      };
  }
}

function OrderDetailPage() {
  const { trx } = useLoaderData({ from: "/akun/transaksi/$id" }) as { trx: Trx };
  const [currentTrx, setCurrentTrx] = useState(trx);
  const banner = bannerFor(currentTrx);
  const BannerIcon = banner.icon;
  const toneText =
    banner.tone === "success" ? "text-success"
    : banner.tone === "destructive" ? "text-destructive"
    : banner.tone === "accent" ? "text-accent"
    : "text-primary";
  const toneBg =
    banner.tone === "success" ? "bg-success/10 border-success/30"
    : banner.tone === "destructive" ? "bg-destructive/10 border-destructive/30"
    : banner.tone === "accent" ? "bg-accent/10 border-accent/30"
    : "bg-primary-soft border-primary/20";

  return (
    <div className="space-y-4">
      {/* Status banner */}
      <section className={`flex flex-wrap items-start justify-between gap-4 rounded-2xl border p-5 ${toneBg}`}>
        <div className="flex items-start gap-4">
          <span className={`grid h-12 w-12 place-items-center rounded-md bg-card ${toneText}`}>
            <BannerIcon className="h-6 w-6" />
          </span>
          <div>
            <p className={`text-base font-bold ${toneText}`}>{banner.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{banner.subtitle}</p>
          </div>
        </div>
        {currentTrx.status === "delivery" ? (
          <div className="text-right text-sm">
            <p className="text-muted-foreground">Estimasi Tiba</p>
            <p className="mt-0.5 font-bold text-foreground">Sedang dalam perjalanan</p>
          </div>
        ) : banner.invoice ? (
          <div className="text-right text-sm">
            <p className="text-muted-foreground">No. Pesanan</p>
            <p className="mt-0.5 font-mono font-bold text-foreground">{currentTrx.code}</p>
          </div>
        ) : null}
      </section>

      {currentTrx.status === "delivery" ? (
        <section className="flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary-soft p-4">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div className="text-sm">
            <p className="font-bold text-foreground">Informasi Penting</p>
            <p className="mt-0.5 text-muted-foreground">
              Pastikan terdapat tim bongkar di lokasi saat pesanan tiba untuk proses bongkar muat barang.
            </p>
          </div>
        </section>
      ) : null}

      {/* Address */}
      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-start gap-4">
          <span className="grid h-16 w-16 place-items-center rounded-md bg-primary-soft">
            <img src={alamatPengirimanIcon} alt="Alamat Pengiriman" className="h-10 w-10" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-bold text-foreground">Alamat Pengiriman</p>
            {currentTrx.customer_location_name || currentTrx.customer_location_address ? (
              <>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {currentTrx.customer_location_name || "-"} {currentTrx.customer_location_phone ? <span className="text-muted-foreground">({currentTrx.customer_location_phone})</span> : null}
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {currentTrx.customer_location_address || "-"}{currentTrx.customer_location_city ? `, ${currentTrx.customer_location_city}` : ""}{currentTrx.customer_location_postal_code ? ` ${currentTrx.customer_location_postal_code}` : ""}
                </p>
              </>
            ) : (
              <p className="mt-1 text-sm text-muted-foreground">Alamat tidak tersedia</p>
            )}
          </div>
        </div>
      </section>

      {/* Stepper */}
      <OrderStatusStepper
        status={currentTrx.status === "pending" ? "menunggu-verifikasi" :
               currentTrx.status === "approve" ? "menunggu-pembayaran" :
               currentTrx.status === "process" ? "diproses" :
               currentTrx.status === "delivery" ? "dikirim" :
               currentTrx.status === "done" ? "selesai" : "dibatalkan"}
        timestamps={{
          dibuat: formatTimestamp(currentTrx.created_at),
          verifikasi: currentTrx.verification_date ? formatTimestamp(currentTrx.verification_date) : undefined,
          pembayaran: ["process", "delivery", "done"].includes(currentTrx.status) ? formatTimestamp(currentTrx.created_at) : undefined,
          dikirim: currentTrx.lines?.[0]?.delivery_date ? formatTimestamp(currentTrx.lines[0].delivery_date) : undefined,
          selesai: currentTrx.date_done ? formatTimestamp(currentTrx.date_done) : undefined,
        }}
      />

      {/* Products */}
      <section className="rounded-2xl border border-border bg-card">
        <div className="flex items-center justify-between gap-3 px-5 pt-5">
          <p className="text-sm font-bold text-foreground">Produk Dipesan</p>
          <span className="text-sm font-semibold text-primary">Selesai</span>
        </div>
        <ul className="px-5 py-4">
          {currentTrx.lines.map((line, idx) => (
            <li key={`${line.product_id}-${line.product_variant_id}-${idx}`} className="flex items-center gap-4 py-2">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                <img
                  src={line.product_variant?.media?.[0]?.url || line.product?.photo || "/placeholder.png"}
                  alt={line.product?.name || "Produk"}
                  className="h-full w-full object-contain p-1"
                  loading="lazy"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 text-sm font-bold text-foreground">{line.product?.name || "Produk"}</p>
                <p className="mt-1 text-xs text-muted-foreground">{line.product_variant?.variant_name || ""}</p>
                <p className="mt-1 text-sm font-bold text-foreground">{formatRupiah(typeof line.price === 'string' ? parseFloat(line.price) : line.price)}</p>
              </div>
              <p className="text-right text-sm text-muted-foreground">x{(typeof line.qty === 'string' ? parseFloat(line.qty) : line.qty).toLocaleString('id-ID')}</p>
            </li>
          ))}
        </ul>
        <div className="grid gap-2 border-t border-border px-5 py-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Total Pesanan:</span>
            <span className="font-bold text-accent">{formatRupiah(typeof currentTrx.total === 'string' ? parseFloat(currentTrx.total) : currentTrx.total)}</span>
          </div>
        </div>
      </section>

      {/* Rincian Pembayaran */}
      <section className="rounded-2xl border border-border bg-card p-5">
        <h3 className="text-base font-bold text-foreground">Rincian Pembayaran</h3>
        <dl className="mt-4 space-y-3 text-sm">
          <Row label="No. Pesanan" value={currentTrx.code} />
          <Row label="Tipe Transaksi" value={currentTrx.trx_type} />
          <Row label="Subtotal Pesanan" value={formatRupiah(typeof currentTrx.subtotal === 'string' ? parseFloat(currentTrx.subtotal) : currentTrx.subtotal)} />
          <Row label="Biaya Pengiriman" value={formatRupiah(typeof currentTrx.shipping_cost === 'string' ? parseFloat(currentTrx.shipping_cost) : currentTrx.shipping_cost)} />
        </dl>
        <div className="mt-4 flex items-baseline justify-between border-t border-border pt-4">
          <span className="text-base font-bold text-foreground">Total Pembayaran</span>
          <span className="text-xl font-bold text-accent">{formatRupiah(typeof currentTrx.total === 'string' ? parseFloat(currentTrx.total) : currentTrx.total)}</span>
        </div>

        <DetailActions trx={currentTrx} onRefresh={async () => {
          const updatedTrx = await fetchTrxById(currentTrx.id);
          setCurrentTrx(updatedTrx);
        }} />
      </section>
    </div>
  );
}

function DetailActions({ trx, onRefresh }: { trx: Trx; onRefresh: () => Promise<void> }) {
  const navigate = useNavigate();
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isSavingPayment, setIsSavingPayment] = useState(false);
  const [isMarkingDone, setIsMarkingDone] = useState(false);
  const [isReturnOpen, setIsReturnOpen] = useState(false);
  const [isConfirmDoneOpen, setIsConfirmDoneOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const paymentCreatedRef = useRef(false);

  const handleCancel = async (reason: string) => {
    if (!reason) {
      toast.error("Silakan pilih alasan pembatalan");
      return;
    }

    setIsCancelling(true);
    try {
      await cancelTrx(trx.id, reason);
      toast.success("Pesanan berhasil dibatalkan");
      setIsCancelDialogOpen(false);
      navigate({ to: "/akun/transaksi" });
    } catch (error) {
      console.error("Failed to cancel transaction:", error);
      toast.error("Gagal membatalkan pesanan");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleMarkDone = async () => {
    setIsMarkingDone(true);
    try {
      await markTrxDone(trx.id);
      toast.success("Pesanan berhasil diselesaikan");
      await onRefresh();
    } catch (error) {
      console.error("Failed to mark transaction as done:", error);
      toast.error("Gagal menyelesaikan pesanan");
    } finally {
      setIsMarkingDone(false);
    }
  };

  const handlePayment = async () => {
    console.log("handlePayment called");
    setIsProcessingPayment(true);
    paymentCreatedRef.current = false; // Reset payment created flag
    try {
      // Load Midtrans Snap SDK
      console.log("Loading Midtrans Snap SDK...");
      await loadMidtransSnap();
      console.log("Midtrans Snap SDK loaded");

      // Generate Snap token
      console.log("Generating Snap token for trx_id:", trx.id);
      const response = await generateSnapToken(trx.id);
      console.log("Snap token generated:", response.token);

      // Reset loading state before opening Snap popup
      setIsProcessingPayment(false);

      console.log("Opening Snap popup...");
      // Open Snap popup
      (window as any).snap.pay(response.token, {
        onSuccess: async (result: any) => {
          console.log("Snap onSuccess:", result);
          toast.success("Pembayaran berhasil");
          await onRefresh();
        },
        onPending: async (result: any) => {
          console.log("Snap onPending:", result);
          // Prevent duplicate payment creation
          if (paymentCreatedRef.current) {
            console.log("Payment already created, skipping");
            await onRefresh();
            return;
          }

          console.log("Creating payment record...");
          setIsSavingPayment(true);
          try {
            // Format today's date as YYYY-MM-DD
            const today = new Date();
            const paymentDate = today.toISOString().split('T')[0];

            const paymentData = {
              trx_id: trx.id,
              customer_id: trx.customer_id || 0,
              payment_method: "midtrans",
              payment_date: paymentDate,
              total: trx.total.toString(),
              status: "pending",
              reference_id: trx.code,
              reference_type: "midtrans",
            };

            console.log("Payment data:", paymentData);

            // Create payment record
            await createPayment(paymentData);

            paymentCreatedRef.current = true;
            console.log("Payment record created successfully");
            toast.success("Pembayaran berhasil disimpan");
            await onRefresh();
          } catch (error) {
            console.error("Failed to create payment record:", error);
            toast.error("Gagal menyimpan pembayaran. Silakan coba lagi.");
          } finally {
            setIsSavingPayment(false);
          }
        },
        onError: (result: any) => {
          console.error("Snap onError:", result);
          toast.error("Pembayaran gagal. Silakan coba lagi.");
        },
        onClose: () => {
          console.log("Snap onClose triggered");
          // onClose is not creating payment since onPending already handles it
        },
      });
    } catch (error) {
      console.error("Failed to process payment:", error);
      toast.error("Gagal memproses pembayaran. Silakan coba lagi.");
      setIsProcessingPayment(false);
    }
  };

  const outline = (label: string, href?: string, onClick?: () => void, isDestructive?: boolean) =>
    href ? (
      <a href={href} target="_blank" rel="noreferrer"
        className={`rounded-md border-2 px-5 py-2.5 text-sm font-bold hover:bg-opacity-5 ${isDestructive ? 'border-destructive text-destructive hover:bg-destructive/5' : 'border-primary text-primary hover:bg-primary/5'}`}>
        {label}
      </a>
    ) : onClick ? (
      <button onClick={onClick} className={`rounded-md border-2 px-5 py-2.5 text-sm font-bold hover:bg-opacity-5 ${isDestructive ? 'border-destructive text-destructive hover:bg-destructive/5' : 'border-primary text-primary hover:bg-primary/5'}`}>
        {label}
      </button>
    ) : (
      <button className={`rounded-md border-2 px-5 py-2.5 text-sm font-bold hover:bg-opacity-5 ${isDestructive ? 'border-destructive text-destructive hover:bg-destructive/5' : 'border-primary text-primary hover:bg-primary/5'}`}>
        {label}
      </button>
    );
  const primary = (label: string, to?: string, onClick?: () => void) =>
    to ? (
      <Link to={to as "/checkout/pembayaran"}
        className="rounded-md bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90">
        {label}
      </Link>
    ) : onClick ? (
      <button onClick={onClick} className="rounded-md bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90">
        {label}
      </button>
    ) : (
      <button className="rounded-md bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90">
        {label}
      </button>
    );

  const whatsapp = "https://wa.me/6281133331800";
  const canCancel = trx.status === "pending" || trx.status === "approve";

  const firstLine = trx.lines?.[0];
  const dialogProduct = {
    name: firstLine?.product?.name ?? "Produk",
    variant: firstLine?.product_variant?.variant_name,
    image: firstLine?.product_variant?.media?.[0]?.url || firstLine?.product?.photo,
    maxQty: typeof firstLine?.qty === "string" ? parseFloat(firstLine.qty) : firstLine?.qty,
  };

  const cancelDialog = (
    <CancelOrderDialog
      open={isCancelDialogOpen}
      onOpenChange={setIsCancelDialogOpen}
      onConfirm={handleCancel}
      isSubmitting={isCancelling}
      trigger={
        <button className="rounded-md border-2 border-destructive px-5 py-2.5 text-sm font-bold text-destructive hover:bg-destructive/5">
          Batalkan Pesanan
        </button>
      }
    />
  );

  let content: React.ReactNode = null;
  switch (trx.status) {
    case "pending":
      content = (
        <>
          {cancelDialog}
          {outline("Hubungi Penjual", whatsapp)}
        </>
      );
      break;
    case "approve":
      content = (
        <>
          {cancelDialog}
          {outline("Hubungi Penjual", whatsapp)}
          {!trx.payment_id && (
            <button
              onClick={handlePayment}
              disabled={isProcessingPayment || isSavingPayment}
              className="rounded-md bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isProcessingPayment ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Memproses Pembayaran...
                </>
              ) : isSavingPayment ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Menyimpan pembayaran...
                </>
              ) : (
                "Bayar Sekarang"
              )}
            </button>
          )}
        </>
      );
      break;
    case "process":
      content = outline("Hubungi Penjual", whatsapp);
      break;
    case "delivery":
      content = (
        <>
          {outline("Ajukan Pengembalian", undefined, () => setIsReturnOpen(true))}
          {primary("Pesanan Selesai", undefined, () => setIsConfirmDoneOpen(true))}
          <ReturnRequestDialog
            open={isReturnOpen}
            onOpenChange={setIsReturnOpen}
            warehouseName={firstLine?.product_variant?.division}
            product={dialogProduct}
            address={{
              name: trx.customer_location?.name ?? trx.customer_location_name,
              phone: trx.customer_location?.phone ?? trx.customer_location_phone,
              address: trx.customer_location?.address ?? trx.customer_location_address,
            }}
            onSubmit={() => {
              toast.success("Pengajuan pengembalian terkirim");
              setIsReturnOpen(false);
            }}
          />
          <ConfirmReceivedDialog
            open={isConfirmDoneOpen}
            onOpenChange={setIsConfirmDoneOpen}
            isSubmitting={isMarkingDone}
            onConfirm={async () => {
              await handleMarkDone();
              setIsConfirmDoneOpen(false);
            }}
          />
        </>
      );
      break;
    case "done":
      content = (
        <>
          {outline("Beli Lagi")}
          {primary("Nilai", undefined, () => setIsReviewOpen(true))}
          <ReviewDialog
            open={isReviewOpen}
            onOpenChange={setIsReviewOpen}
            product={dialogProduct}
          />
        </>
      );
      break;
    case "cancel":
      content = (
        <>
          {outline("Rincian Pembatalan")}
          {primary("Beli Lagi")}
        </>
      );
      break;
  }

  return (
    <div className="mt-5 flex flex-wrap items-center justify-end gap-2">
      {content}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-semibold text-foreground">{value}</dd>
    </div>
  );
}
