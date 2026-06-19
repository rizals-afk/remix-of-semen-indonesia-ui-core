import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, MapPin, Ticket, Truck, Store, Check } from "lucide-react";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { MainLayout } from "@/components/layout/MainLayout";
import { OrderProductGroup } from "@/components/checkout/OrderProductGroup";
import { Switch } from "@/components/ui/switch";
import { useCart } from "@/store/cart";
import { useCheckout, type FulfillmentMode } from "@/store/checkout";
import { formatRupiah } from "@/lib/format";
import { ESTIMATED_GROUP_SHIPPING_FEE } from "@/data/shopping";

export const Route = createFileRoute("/checkout/")({
  head: () => ({ meta: [{ title: "Checkout — BahanMaterial.com" }] }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const cart = useCart();
  const checkout = useCheckout();
  const navigate = useNavigate();
  const groups = cart.selectedGroups;

  const subtotalPesanan = groups.reduce((s, g) => s + g.subTotal, 0);
  const totalTonase = groups.reduce((s, g) => s + g.tonase, 0);
  // Pre-verification shipping estimate: per-group fee, only when "dikirim" and not COD.
  const showShipping = checkout.mode === "dikirim";
  const subtotalShipping = showShipping ? groups.length * ESTIMATED_GROUP_SHIPPING_FEE * 2 : 0;
  const discount = checkout.voucher?.discount ?? 0;
  const total = subtotalPesanan + subtotalShipping - discount;

  const submit = () => {
    const warehouses = groups.map((g) => g.warehouse);
    checkout.submitOrder(warehouses);
    navigate({ to: "/checkout/verifikasi" });
  };

  if (groups.length === 0) {
    return (
      <MainLayout user={{ name: "Auliya Gita Ananda" }}>
        <div className="container mx-auto max-w-3xl px-4 py-12 text-center">
          <h1 className="text-xl font-bold text-foreground">Belum ada produk dipilih</h1>
          <p className="mt-2 text-sm text-muted-foreground">Kembali ke keranjang untuk memilih produk.</p>
          <Link to="/keranjang" className="mt-5 inline-block rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground">
            Ke Keranjang
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout user={{ name: "Auliya Gita Ananda" }}>
      <div className="border-b border-border bg-card">
        <div className="container mx-auto flex max-w-7xl items-center gap-4 px-4 py-5">
          <h1 className="text-2xl font-bold text-primary">Checkout</h1>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-6">
        <Link to="/keranjang" className="inline-flex items-center gap-1 text-sm font-semibold text-foreground hover:text-primary">
          <ChevronLeft className="h-4 w-4" /> Kembali ke Keranjang
        </Link>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-5">
            {/* Address card — only when shipping */}
            {checkout.mode === "dikirim" ? (
              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 text-primary"><MapPin className="h-5 w-5" /></span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-base font-bold text-foreground">Alamat Pengiriman</p>
                      <Link to="/checkout/alamat" className="text-sm font-semibold text-primary hover:underline">Ubah</Link>
                    </div>
                    <p className="mt-2 text-sm text-foreground">
                      <span className="font-semibold">{checkout.address.recipient}</span>{" "}
                      <span className="text-muted-foreground">({checkout.address.phone})</span>
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {checkout.address.address}, {checkout.address.city}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Fulfillment mode toggle */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <h2 className="text-base font-bold text-foreground">Metode Pengiriman</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <ModeOption
                  active={checkout.mode === "dikirim"}
                  onClick={() => { checkout.setMode("dikirim"); checkout.setCod(false); }}
                  icon={<Truck className="h-5 w-5" />}
                  title="Dikirim"
                />
                <ModeOption
                  active={checkout.mode === "diambil"}
                  onClick={() => checkout.setMode("diambil")}
                  icon={<Store className="h-5 w-5" />}
                  title="Diambil"
                />
              </div>
            </div>

            {/* COD toggle — only when "diambil" */}
            {checkout.mode === "diambil" ? (
              <div className="rounded-2xl border border-border bg-card p-5">
                <h2 className="text-base font-bold text-foreground">Metode Pembayaran</h2>
                <div className="mt-3 flex items-center justify-between rounded-md border border-border px-4 py-3">
                  <span className="text-sm font-semibold text-foreground">COD (Cash On Delivery)</span>
                  <Switch checked={checkout.cod} onCheckedChange={checkout.setCod} />
                </div>
              </div>
            ) : null}

            {/* Multi-warehouse product groups */}
            {groups.map((g) => (
              <OrderProductGroup
                key={g.warehouse}
                group={g}
                note={checkout.notes[g.warehouse] ?? ""}
                onNoteChange={(t) => checkout.setNote(g.warehouse, t)}
                shippingFee={showShipping ? ESTIMATED_GROUP_SHIPPING_FEE * 2 : undefined}
              />
            ))}
          </div>

          {/* Right rail */}
          <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
            <Link
              to="/checkout/voucher"
              className="flex items-center justify-between rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary"
            >
              <div>
                <p className="text-base font-bold text-foreground">Gunakan Voucher</p>
                <div className="mt-3 flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-md bg-primary-soft text-primary">
                    <Ticket className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{checkout.voucher?.title ?? "Voucher"}</p>
                    <p className="text-xs text-muted-foreground">{checkout.voucher?.description ?? "Pilih voucher untuk hemat lebih banyak"}</p>
                  </div>
                </div>
              </div>
              {checkout.voucher ? (
                <span className="grid h-6 w-6 place-items-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-3.5 w-3.5" />
                </span>
              ) : null}
            </Link>

            <div className="rounded-2xl border border-border bg-card p-5">
              <h2 className="text-base font-bold text-foreground">Rincian Pembayaran</h2>
              <dl className="mt-4 space-y-3 text-sm">
                <Row label="Subtotal Tonase" value={`${totalTonase.toLocaleString("id-ID")} Ton`} />
                <Row label="Subtotal Pesanan" value={formatRupiah(subtotalPesanan)} />
                {showShipping ? (
                  <Row label="Subtotal Pengiriman" value={formatRupiah(subtotalShipping)} />
                ) : null}
                {checkout.voucher ? (
                  <Row
                    label={checkout.voucher.type === "shipping" ? "Voucher Gratis Ongkir" : `Voucher ${checkout.voucher.title}`}
                    value={`- ${formatRupiah(discount)}`}
                    accent="success"
                  />
                ) : null}
              </dl>
              <div className="mt-4 flex items-baseline justify-between border-t border-border pt-4">
                <span className="text-sm font-bold text-foreground">Total Pembayaran</span>
                <span className="text-xl font-bold text-accent">{formatRupiah(total)}</span>
              </div>
              <button
                onClick={submit}
                className="mt-5 w-full rounded-md bg-primary py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90"
              >
                Ajukan Pesanan
              </button>
            </div>
          </aside>
        </div>
      </div>
    </MainLayout>
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

function ModeOption({
  active, onClick, icon, title,
}: { active: boolean; onClick: () => void; icon: React.ReactNode; title: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "flex items-center justify-center gap-2 rounded-md border-2 px-4 py-3 text-sm font-bold transition-colors " +
        (active ? "border-primary bg-primary-soft/40 text-primary" : "border-border bg-card text-foreground hover:border-primary/60")
      }
    >
      {icon}
      {title}
    </button>
  );
}

// satisfy unused import elision in some TS configs
void (null as unknown as FulfillmentMode);
