import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  MapPin, Hourglass, Wallet, Truck, CheckCircle2, XCircle, RotateCcw, Info,
} from "lucide-react";
import { OrderStatusStepper } from "@/components/account/OrderStatusStepper";
import { formatRupiah } from "@/lib/format";
import {
  getOrder, orderShipping, orderSubtotal, orderTonase, orderTotal,
  type Order, type OrderWarehouseGroup,
} from "@/data/orders";

export const Route = createFileRoute("/akun/transaksi/$id")({
  head: () => ({ meta: [{ title: "Detail Pesanan — BahanMaterial.com" }] }),
  loader: ({ params }) => {
    const order = getOrder(params.id);
    if (!order) throw notFound();
    return { order };
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

function bannerFor(order: Order): BannerCopy {
  switch (order.status) {
    case "menunggu-verifikasi":
      return {
        icon: Hourglass,
        title: "Menunggu Verifikasi",
        subtitle: "Pesanan anda sedang dalam proses peninjauan oleh tim admin pusat kami.",
        tone: "primary",
      };
    case "menunggu-pembayaran":
      return {
        icon: Wallet,
        title: "Menunggu Pembayaran",
        subtitle: `Silahkan lakukan pembayaran paling lambat ${order.deadline ?? "—"}`,
        tone: "primary",
      };
    case "diproses":
      return {
        icon: Hourglass,
        title: "Pesanan Diproses",
        subtitle: "Gudang sedang menyiapkan pesanan anda untuk pengiriman.",
        tone: "primary",
      };
    case "dikirim":
      return {
        icon: Truck,
        title: "Pesanan Dikirim",
        subtitle: "Pesanan sedang dalam perjalanan menuju lokasi Anda.",
        tone: "primary",
      };
    case "selesai":
      return {
        icon: CheckCircle2,
        title: "Pesanan Selesai",
        subtitle: `Pesanan Diterima pada ${order.createdAt}`,
        tone: "success",
        invoice: true,
      };
    case "pengembalian":
      return {
        icon: RotateCcw,
        title: "Menunggu Verifikasi Pengembalian",
        subtitle: "Tim admin sedang meninjau permintaan pengembalian anda.",
        tone: "accent",
      };
    case "dibatalkan":
      return {
        icon: XCircle,
        title: "Pesanan Dibatalkan",
        subtitle: "Pesanan ini telah dibatalkan.",
        tone: "destructive",
      };
  }
}

function OrderDetailPage() {
  const { order } = Route.useLoaderData();
  const subtotal = orderSubtotal(order);
  const shipping = orderShipping(order);
  const total = orderTotal(order);
  const banner = bannerFor(order);
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

  const eta = order.etaWindow;

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
        {order.status === "dikirim" && eta ? (
          <div className="text-right text-sm">
            <p className="text-muted-foreground">Estimasi Tiba</p>
            <p className="mt-0.5 font-bold text-foreground">{eta}</p>
          </div>
        ) : banner.invoice ? (
          <div className="text-right text-sm">
            <p className="text-muted-foreground">No. Pesanan</p>
            <p className="mt-0.5 font-mono font-bold text-foreground">{order.id}</p>
          </div>
        ) : null}
      </section>

      {order.status === "dikirim" ? (
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
            <p className="mt-1 text-sm font-semibold text-foreground">
              {order.recipient} <span className="text-muted-foreground">({order.phone})</span>
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">{order.address}</p>
          </div>
        </div>
      </section>

      {/* Stepper */}
      <OrderStatusStepper
        status={order.status}
        timestamps={{
          dibuat: order.createdAt,
          verifikasi: order.status !== "menunggu-verifikasi" && order.status !== "dibatalkan" ? order.createdAt : undefined,
          pembayaran: ["diproses", "dikirim", "selesai"].includes(order.status) ? order.createdAt : undefined,
          dikirim: ["dikirim", "selesai"].includes(order.status) ? order.createdAt : undefined,
          selesai: order.status === "selesai" ? order.createdAt : undefined,
        }}
      />

      {/* Warehouse groups */}
      {order.groups.map((g, idx) => (
        <WarehouseDetailCard key={g.warehouse + idx} group={g} />
      ))}

      {/* Rincian Pembayaran */}
      <section className="rounded-2xl border border-border bg-card p-5">
        <h3 className="text-base font-bold text-foreground">Rincian Pembayaran</h3>
        <dl className="mt-4 space-y-3 text-sm">
          <Row label="Metode Pembayaran" value={order.paymentMethod} />
          <Row label="Subtotal Pesanan" value={formatRupiah(subtotal)} />
          <Row label="Subtotal Pengiriman" value={formatRupiah(shipping)} />
          {order.voucherDiscount ? (
            <Row label="Voucher Gratis Ongkir" value={formatRupiah(order.voucherDiscount)} />
          ) : null}
        </dl>
        <div className="mt-4 flex items-baseline justify-between border-t border-border pt-4">
          <span className="text-base font-bold text-foreground">Total Pembayaran</span>
          <span className="text-xl font-bold text-accent">{formatRupiah(total)}</span>
        </div>

        <DetailActions order={order} />
      </section>
    </div>
  );
}

function WarehouseDetailCard({ group }: { group: OrderWarehouseGroup }) {
  const groupSubtotal = group.items.reduce((s, i) => s + i.price * i.qty, 0);
  const groupTonase = group.items.reduce(
    (s, i) => s + ((i.weightKg ?? 0) * i.qty) / 1000,
    0,
  );
  return (
    <section className="rounded-2xl border border-border bg-card">
      <div className="flex items-center justify-between gap-3 px-5 pt-5">
        <p className="text-sm font-bold text-foreground">{group.warehouse}</p>
        <span className="text-sm font-semibold text-primary">Selesai</span>
      </div>
      <ul className="px-5 py-4">
        {group.items.map((item) => (
          <li key={item.id} className="flex items-center gap-4 py-2">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
              <img src={item.image} alt={item.name} className="h-full w-full object-contain p-1" loading="lazy" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-1 text-sm font-bold text-foreground">{item.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{item.variant}</p>
              <p className="mt-1 text-sm font-bold text-foreground">{formatRupiah(item.price)}</p>
            </div>
            <p className="text-right text-sm text-muted-foreground">x{item.qty}</p>
          </li>
        ))}
      </ul>
      <div className="grid gap-2 border-t border-border px-5 py-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Total Tonase:</span>
          <span className="font-bold text-foreground">{groupTonase.toLocaleString("id-ID")} Ton</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Total Pesanan:</span>
          <span className="font-bold text-accent">{formatRupiah(groupSubtotal)}</span>
        </div>
      </div>
    </section>
  );
}

function DetailActions({ order }: { order: Order }) {
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
  switch (order.status) {
    case "menunggu-verifikasi":
      content = outline("Hubungi Penjual", whatsapp);
      break;
    case "menunggu-pembayaran":
      content = (
        <>
          {outline("Hubungi Penjual", whatsapp)}
          {primary("Bayar Sekarang", "/checkout/pembayaran")}
        </>
      );
      break;
    case "diproses":
      content = outline("Hubungi Penjual", whatsapp);
      break;
    case "dikirim":
      content = (
        <>
          {outline("Ajukan Pengembalian")}
          {primary("Pesanan Selesai")}
        </>
      );
      break;
    case "selesai":
      content = (
        <>
          {outline("Beli Lagi")}
          {primary("Nilai")}
        </>
      );
      break;
    case "pengembalian":
      content = primary("Rincian Pengembalian");
      break;
    case "dibatalkan":
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
