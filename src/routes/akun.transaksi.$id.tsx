import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  MapPin, Hourglass, Wallet, Truck, CheckCircle2, XCircle, RotateCcw, Info, Loader2,
} from "lucide-react";
import { OrderStatusStepper } from "@/components/account/OrderStatusStepper";
import { formatRupiah } from "@/lib/format";
import { fetchTrxById, type Trx } from "@/lib/api/trx";
import { toast } from "sonner";

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
          <span className="grid h-12 w-12 place-items-center rounded-md bg-primary-soft text-primary">
            <MapPin className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-bold text-foreground">Alamat Pengiriman</p>
            {trx.customer_location ? (
              <>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {trx.customer_location.name} <span className="text-muted-foreground">({trx.customer_location.phone})</span>
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">{trx.customer_location.address}</p>
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
          dibuat: trx.created_at,
          verifikasi: trx.status !== "pending" && trx.status !== "cancel" ? trx.created_at : undefined,
          pembayaran: ["proses", "delivery", "done"].includes(trx.status) ? trx.created_at : undefined,
          dikirim: ["delivery", "done"].includes(trx.status) ? trx.created_at : undefined,
          selesai: trx.status === "done" ? trx.updated_at : undefined,
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
                <p className="mt-1 text-sm font-bold text-foreground">{formatRupiah(line.price)}</p>
              </div>
              <p className="text-right text-sm text-muted-foreground">x{line.qty}</p>
            </li>
          ))}
        </ul>
        <div className="grid gap-2 border-t border-border px-5 py-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Total Pesanan:</span>
            <span className="font-bold text-accent">{formatRupiah(trx.total)}</span>
          </div>
        </div>
      </section>

      {/* Rincian Pembayaran */}
      <section className="rounded-2xl border border-border bg-card p-5">
        <h3 className="text-base font-bold text-foreground">Rincian Pembayaran</h3>
        <dl className="mt-4 space-y-3 text-sm">
          <Row label="Tipe Transaksi" value={trx.trx_type} />
          <Row label="Subtotal Pesanan" value={formatRupiah(trx.subtotal)} />
          <Row label="Biaya Pengiriman" value={formatRupiah(trx.shipping_cost)} />
        </dl>
        <div className="mt-4 flex items-baseline justify-between border-t border-border pt-4">
          <span className="text-base font-bold text-foreground">Total Pembayaran</span>
          <span className="text-xl font-bold text-accent">{formatRupiah(trx.total)}</span>
        </div>

        <DetailActions trx={trx} />
      </section>
    </div>
  );
}

function DetailActions({ trx }: { trx: Trx }) {
  const outline = (label: string, href?: string) =>
    href ? (
      <a href={href} target="_blank" rel="noreferrer"
        className="rounded-md border-2 border-primary px-5 py-2.5 text-sm font-bold text-primary hover:bg-primary/5">
        {label}
      </a>
    ) : (
      <button className="rounded-md border-2 border-primary px-5 py-2.5 text-sm font-bold text-primary hover:bg-primary/5">
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

  let content: React.ReactNode = null;
  switch (trx.status) {
    case "pending":
      content = outline("Hubungi Penjual", whatsapp);
      break;
    case "approve":
      content = (
        <>
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
