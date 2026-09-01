import { useState } from "react";
import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import {
  Hourglass, Wallet, Truck, CheckCircle2, XCircle, RotateCcw, Info, Loader2,
} from "lucide-react";
import { OrderStatusStepper } from "@/components/account/OrderStatusStepper";
import { formatRupiah } from "@/lib/format";
import { fetchTrxById, cancelTrx, type Trx } from "@/lib/api/trx";
import { toast } from "sonner";
import alamatPengirimanIcon from "@/assets/transaksi/Alamat_Pengiriman.png";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
    case "proses":
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
  const { trx } = Route.useLoaderData() as { trx: Trx };
  const banner = bannerFor(trx);
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
        {trx.status === "delivery" ? (
          <div className="text-right text-sm">
            <p className="text-muted-foreground">Estimasi Tiba</p>
            <p className="mt-0.5 font-bold text-foreground">Sedang dalam perjalanan</p>
          </div>
        ) : banner.invoice ? (
          <div className="text-right text-sm">
            <p className="text-muted-foreground">No. Pesanan</p>
            <p className="mt-0.5 font-mono font-bold text-foreground">{trx.code}</p>
          </div>
        ) : null}
      </section>

      {trx.status === "delivery" ? (
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
            {trx.customer_location_name || trx.customer_location_address ? (
              <>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {trx.customer_location_name || "-"} {trx.customer_location_phone ? <span className="text-muted-foreground">({trx.customer_location_phone})</span> : null}
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {trx.customer_location_address || "-"}{trx.customer_location_city ? `, ${trx.customer_location_city}` : ""}{trx.customer_location_postal_code ? ` ${trx.customer_location_postal_code}` : ""}
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
        status={trx.status === "pending" ? "menunggu-verifikasi" :
               trx.status === "approve" ? "menunggu-pembayaran" :
               trx.status === "proses" ? "diproses" :
               trx.status === "delivery" ? "dikirim" :
               trx.status === "done" ? "selesai" : "dibatalkan"}
        timestamps={{
          dibuat: formatTimestamp(trx.created_at),
          verifikasi: trx.verification_date ? formatTimestamp(trx.verification_date) : undefined,
          pembayaran: ["proses", "delivery", "done"].includes(trx.status) ? formatTimestamp(trx.created_at) : undefined,
          dikirim: trx.lines?.[0]?.delivery_date ? formatTimestamp(trx.lines[0].delivery_date) : undefined,
          selesai: trx.date_done ? formatTimestamp(trx.date_done) : undefined,
        }}
      />

      {/* Products */}
      <section className="rounded-2xl border border-border bg-card">
        <div className="flex items-center justify-between gap-3 px-5 pt-5">
          <p className="text-sm font-bold text-foreground">Produk Dipesan</p>
          <span className="text-sm font-semibold text-primary">Selesai</span>
        </div>
        <ul className="px-5 py-4">
          {trx.lines.map((line, idx) => (
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
            <span className="font-bold text-accent">{formatRupiah(typeof trx.total === 'string' ? parseFloat(trx.total) : trx.total)}</span>
          </div>
        </div>
      </section>

      {/* Rincian Pembayaran */}
      <section className="rounded-2xl border border-border bg-card p-5">
        <h3 className="text-base font-bold text-foreground">Rincian Pembayaran</h3>
        <dl className="mt-4 space-y-3 text-sm">
          <Row label="No. Pesanan" value={trx.code} />
          <Row label="Tipe Transaksi" value={trx.trx_type} />
          <Row label="Subtotal Pesanan" value={formatRupiah(typeof trx.subtotal === 'string' ? parseFloat(trx.subtotal) : trx.subtotal)} />
          <Row label="Biaya Pengiriman" value={formatRupiah(typeof trx.shipping_cost === 'string' ? parseFloat(trx.shipping_cost) : trx.shipping_cost)} />
        </dl>
        <div className="mt-4 flex items-baseline justify-between border-t border-border pt-4">
          <span className="text-base font-bold text-foreground">Total Pembayaran</span>
          <span className="text-xl font-bold text-accent">{formatRupiah(typeof trx.total === 'string' ? parseFloat(trx.total) : trx.total)}</span>
        </div>

        <DetailActions trx={trx} />
      </section>
    </div>
  );
}

function DetailActions({ trx }: { trx: Trx }) {
  const navigate = useNavigate();
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancel = async () => {
    setIsCancelling(true);
    try {
      await cancelTrx(trx.id);
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
  const primary = (label: string, to?: string) =>
    to ? (
      <Link to={to as "/checkout/pembayaran"}
        className="rounded-md bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90">
        {label}
      </Link>
    ) : (
      <button className="rounded-md bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90">
        {label}
      </button>
    );

  const whatsapp = "https://wa.me/6281133331800";
  const canCancel = trx.status === "pending" || trx.status === "approve";

  let content: React.ReactNode = null;
  switch (trx.status) {
    case "pending":
      content = (
        <>
          <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
            <AlertDialogTrigger asChild>
              <button className="rounded-md border-2 border-destructive px-5 py-2.5 text-sm font-bold text-destructive hover:bg-destructive/5">
                Batalkan Pesanan
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Batalkan Pesanan</AlertDialogTitle>
                <AlertDialogDescription>
                  Apakah Anda yakin ingin membatalkan pesanan ini? Tindakan ini tidak dapat dibatalkan.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleCancel}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={isCancelling}
                >
                  {isCancelling ? "Membatalkan..." : "Ya, Batalkan"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          {outline("Hubungi Penjual", whatsapp)}
        </>
      );
      break;
    case "approve":
      content = (
        <>
          <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
            <AlertDialogTrigger asChild>
              <button className="rounded-md border-2 border-destructive px-5 py-2.5 text-sm font-bold text-destructive hover:bg-destructive/5">
                Batalkan Pesanan
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Batalkan Pesanan</AlertDialogTitle>
                <AlertDialogDescription>
                  Apakah Anda yakin ingin membatalkan pesanan ini? Tindakan ini tidak dapat dibatalkan.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleCancel}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={isCancelling}
                >
                  {isCancelling ? "Membatalkan..." : "Ya, Batalkan"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          {outline("Hubungi Penjual", whatsapp)}
          {primary("Bayar Sekarang", "/checkout/pembayaran")}
        </>
      );
      break;
    case "proses":
      content = outline("Hubungi Penjual", whatsapp);
      break;
    case "delivery":
      content = (
        <>
          {outline("Ajukan Pengembalian")}
          {primary("Pesanan Selesai")}
        </>
      );
      break;
    case "done":
      content = (
        <>
          {outline("Beli Lagi")}
          {primary("Nilai")}
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
