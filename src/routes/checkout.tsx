import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronRight, Ticket, Truck, Store } from "lucide-react";
import { CartItemRow } from "@/components/cart/CartItemRow";
import { AddressCard } from "@/components/checkout/AddressCard";
import { CheckoutStepper } from "@/components/checkout/CheckoutStepper";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { WarehouseCard } from "@/components/checkout/WarehouseCard";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { MainLayout } from "@/components/layout/MainLayout";
import { useCart } from "@/store/cart";
import { useCheckout } from "@/store/checkout";
import { formatRupiah } from "@/lib/format";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — BahanMaterial.com" }] }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const cart = useCart();
  const checkout = useCheckout();
  const navigate = useNavigate();
  const selectedItems = cart.items.filter((i) => cart.selectedIds.has(i.id));

  const discount = checkout.voucher?.discount ?? 0;
  const total = cart.subTotal + checkout.shippingFee - discount;

  return (
    <MainLayout user={{ name: "Auliya Gita Ananda" }}>
      <div className="container mx-auto max-w-7xl px-4 py-6">
        <Breadcrumbs
          items={[
            { label: "Home", to: "/" },
            { label: "Keranjang", to: "/keranjang" },
            { label: "Checkout" },
          ]}
        />
        <div className="mt-6">
          <CheckoutStepper current={2} />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-5">
            {/* Fulfillment mode toggle */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <h2 className="text-base font-bold text-foreground">Metode Pengantaran</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <ModeOption
                  active={checkout.mode === "dikirim"}
                  onClick={() => checkout.setMode("dikirim")}
                  icon={<Truck className="h-5 w-5" />}
                  title="Dikirim"
                  desc="Diantar armada ke alamatmu"
                />
                <ModeOption
                  active={checkout.mode === "diambil"}
                  onClick={() => checkout.setMode("diambil")}
                  icon={<Store className="h-5 w-5" />}
                  title="Diambil Sendiri"
                  desc="Ambil langsung di gudang"
                />
              </div>
            </div>

            {/* Address or warehouse pickup */}
            {checkout.mode === "dikirim" ? (
              <Section title="Alamat Pengiriman" actionLabel="Ubah" actionTo="/checkout/alamat">
                <AddressCard address={checkout.address} compact={false} />
              </Section>
            ) : (
              <Section title="Lokasi Pengambilan" actionLabel="Ubah" actionTo="/checkout/gudang">
                <WarehouseCard warehouse={checkout.warehouse} selected />
              </Section>
            )}

            {/* Order items */}
            <div className="rounded-2xl border border-border bg-card">
              <div className="border-b border-border px-5 py-4">
                <h2 className="text-base font-bold text-foreground">Detail Pesanan</h2>
              </div>
              <div className="divide-y divide-border px-5">
                {selectedItems.map((item) => (
                  <CartItemRow
                    key={item.id}
                    item={item}
                    selected
                    readOnly
                    onToggle={() => {}}
                    onQtyChange={() => {}}
                    onRemove={() => {}}
                  />
                ))}
                {selectedItems.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    Belum ada produk dipilih. Kembali ke{" "}
                    <Link to="/keranjang" className="font-semibold text-primary">keranjang</Link>.
                  </p>
                ) : null}
              </div>
            </div>

            {/* Voucher */}
            <Link
              to="/checkout/voucher"
              className="flex items-center justify-between rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-md bg-accent-soft text-accent">
                  <Ticket className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">Pakai Voucher</p>
                  <p className="text-xs text-muted-foreground">
                    {checkout.voucher
                      ? `${checkout.voucher.title} — hemat ${formatRupiah(checkout.voucher.discount)}`
                      : "Pilih voucher untuk hemat lebih banyak"}
                  </p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Link>

            {/* Notes */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <label htmlFor="notes" className="text-sm font-semibold text-foreground">
                Catatan untuk Penjual <span className="text-muted-foreground">(opsional)</span>
              </label>
              <textarea
                id="notes"
                value={checkout.notes}
                onChange={(e) => checkout.setNotes(e.target.value)}
                placeholder="Contoh: tolong kirim pagi hari sebelum jam 10"
                rows={3}
                className="mt-2 w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <OrderSummary
            rows={[
              { label: `Subtotal (${selectedItems.length} produk)`, value: cart.subTotal },
              {
                label: checkout.mode === "dikirim" ? "Ongkos Kirim" : "Biaya Pengambilan",
                value: checkout.shippingFee,
                hint: checkout.mode === "dikirim" ? checkout.address.label : checkout.warehouse.name,
              },
              ...(discount > 0
                ? [{ label: `Voucher (${checkout.voucher!.code})`, value: discount, isDiscount: true }]
                : []),
            ]}
            total={total}
            cta={{
              label: "Pilih Metode Pembayaran",
              onClick: () => navigate({ to: "/checkout/pembayaran" }),
              disabled: selectedItems.length === 0,
            }}
          />
        </div>
      </div>
    </MainLayout>
  );
}

function Section({
  title,
  actionLabel,
  actionTo,
  children,
}: {
  title: string;
  actionLabel?: string;
  actionTo?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-bold text-foreground">{title}</h2>
        {actionLabel && actionTo ? (
          <Link to={actionTo} className="text-sm font-semibold text-primary hover:underline">
            {actionLabel}
          </Link>
        ) : null}
      </div>
      {children}
    </div>
  );
}

function ModeOption({
  active,
  onClick,
  icon,
  title,
  desc,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "flex items-start gap-3 rounded-xl border p-4 text-left transition-colors " +
        (active
          ? "border-primary bg-primary-soft/30"
          : "border-border bg-card hover:border-primary/60")
      }
    >
      <span className={"grid h-10 w-10 place-items-center rounded-md " + (active ? "bg-primary text-primary-foreground" : "bg-muted text-foreground")}>
        {icon}
      </span>
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
    </button>
  );
}
