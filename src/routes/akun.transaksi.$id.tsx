import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronLeft, MapPin, Warehouse as WarehouseIcon, CreditCard, Truck, Store, FileText, MessageCircle } from "lucide-react";
import { OrderStatusBadge } from "@/components/account/OrderStatusBadge";
import { formatRupiah } from "@/lib/format";
import { getOrder, orderShipping, orderSubtotal, orderTonase, orderTotal } from "@/data/orders";

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

function OrderDetailPage() {
  const { order } = Route.useLoaderData();
  const subtotal = orderSubtotal(order);
  const shipping = orderShipping(order);
  const tonase = orderTonase(order);
  const total = orderTotal(order);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/akun/transaksi" className="inline-flex items-center gap-1 text-sm font-semibold text-foreground hover:text-primary">
          <ChevronLeft className="h-4 w-4" /> Kembali ke Riwayat Transaksi
        </Link>
        <OrderStatusBadge status={order.status} />
      </div>

      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">ID Pesanan</p>
            <p className="mt-1 font-mono text-sm font-bold text-foreground">{order.id}</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Tanggal Pesanan</p>
            <p className="mt-1 text-sm font-semibold text-foreground">{order.createdAt}</p>
          </div>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-5">
          <p className="flex items-center gap-2 text-sm font-bold text-foreground">
            {order.mode === "dikirim" ? <Truck className="h-4 w-4 text-primary" /> : <Store className="h-4 w-4 text-primary" />}
            {order.mode === "dikirim" ? "Alamat Pengiriman" : "Lokasi Pengambilan"}
          </p>
          <div className="mt-3 flex items-start gap-2 text-sm">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="font-semibold text-foreground">{order.recipient} <span className="text-muted-foreground">({order.phone})</span></p>
              <p className="mt-0.5 text-muted-foreground">{order.address}</p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5">
          <p className="flex items-center gap-2 text-sm font-bold text-foreground">
            <CreditCard className="h-4 w-4 text-primary" /> Metode Pembayaran
          </p>
          <p className="mt-3 text-sm font-semibold text-foreground">{order.paymentMethod}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {order.cod ? "Bayar saat barang diambil" : "Pembayaran melalui channel terpilih"}
          </p>
        </section>
      </div>

      {order.groups.map((g) => {
        const groupSubtotal = g.items.reduce((s, i) => s + i.price * i.qty, 0);
        return (
          <section key={g.warehouse} className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="flex items-center gap-2 border-b border-border px-5 py-3 text-sm font-semibold text-foreground">
              <WarehouseIcon className="h-4 w-4 text-muted-foreground" />
              {g.warehouse}
            </div>
            <div className="divide-y divide-border">
              {g.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 px-5 py-4">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                    <img src={item.image} alt={item.name} className="h-full w-full object-contain p-1" loading="lazy" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm font-semibold text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.variant} · {item.qty} {item.unit}
                    </p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="text-muted-foreground">{formatRupiah(item.price)}</p>
                    <p className="font-bold text-foreground">{formatRupiah(item.price * item.qty)}</p>
                  </div>
                </div>
              ))}
            </div>
            {g.note ? (
              <div className="flex items-start gap-2 border-t border-border bg-muted/40 px-5 py-3 text-sm">
                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <p className="text-muted-foreground"><span className="font-semibold text-foreground">Pesan: </span>{g.note}</p>
              </div>
            ) : null}
            <div className="grid gap-2 border-t border-border px-5 py-3 text-sm sm:grid-cols-2">
              <div className="flex justify-between sm:block">
                <span className="text-muted-foreground">Subtotal Produk</span>
                <p className="font-semibold text-foreground sm:mt-1">{formatRupiah(groupSubtotal)}</p>
              </div>
              <div className="flex justify-between sm:block sm:text-right">
                <span className="text-muted-foreground">Ongkos Kirim</span>
                <p className="font-semibold text-foreground sm:mt-1">{g.shippingFee > 0 ? formatRupiah(g.shippingFee) : "—"}</p>
              </div>
            </div>
          </section>
        );
      })}

      <section className="rounded-2xl border border-border bg-card p-5">
        <h3 className="text-base font-bold text-foreground">Rincian Pembayaran</h3>
        <dl className="mt-4 space-y-3 text-sm">
          <Row label="Subtotal Tonase" value={`${tonase.toLocaleString("id-ID")} Ton`} />
          <Row label="Subtotal Pesanan" value={formatRupiah(subtotal)} />
          <Row label="Subtotal Pengiriman" value={formatRupiah(shipping)} />
          {order.voucherDiscount ? (
            <Row label="Voucher" value={`- ${formatRupiah(order.voucherDiscount)}`} accent="success" />
          ) : null}
        </dl>
        <div className="mt-4 flex items-baseline justify-between border-t border-border pt-4">
          <span className="text-sm font-bold text-foreground">Total Pembayaran</span>
          <span className="text-xl font-bold text-accent">{formatRupiah(total)}</span>
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-end gap-2">
        <a
          href="https://wa.me/6281133331800"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-md border-2 border-primary px-5 py-2.5 text-sm font-bold text-primary hover:bg-primary/5"
        >
          <MessageCircle className="h-4 w-4" /> Hubungi Admin
        </a>
        {order.status === "menunggu-pembayaran" ? (
          <Link
            to="/checkout/pembayaran"
            className="rounded-md bg-accent px-5 py-2.5 text-sm font-bold text-accent-foreground hover:bg-accent/90"
          >
            Bayar Sekarang
          </Link>
        ) : null}
        {order.status === "selesai" ? (
          <button className="rounded-md bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90">
            Beli Lagi
          </button>
        ) : null}
      </div>
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: "success" }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={"font-semibold " + (accent === "success" ? "text-success" : "text-foreground")}>{value}</dd>
    </div>
  );
}
