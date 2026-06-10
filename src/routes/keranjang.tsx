import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Checkbox } from "@/components/ui/checkbox";
import { CartItemRow } from "@/components/cart/CartItemRow";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { CheckoutStepper } from "@/components/checkout/CheckoutStepper";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { MainLayout } from "@/components/layout/MainLayout";
import { useCart } from "@/store/cart";
import { ShoppingCart } from "lucide-react";

export const Route = createFileRoute("/keranjang")({
  head: () => ({ meta: [{ title: "Keranjang Belanja — BahanMaterial.com" }] }),
  component: CartPage,
});

function CartPage() {
  const cart = useCart();
  const navigate = useNavigate();
  const allSelected = cart.items.length > 0 && cart.selectedIds.size === cart.items.length;

  return (
    <MainLayout user={{ name: "Auliya Gita Ananda" }}>
      <div className="container mx-auto max-w-7xl px-4 py-6">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Keranjang Belanja" }]} />
        <div className="mt-6">
          <CheckoutStepper current={1} />
        </div>

        {cart.items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="rounded-2xl border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <label className="flex items-center gap-3 text-sm font-semibold text-foreground">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={(v) => cart.toggleSelectAll(Boolean(v))}
                  />
                  Pilih Semua ({cart.items.length} produk)
                </label>
                <button
                  onClick={cart.clearSelected}
                  disabled={cart.selectedIds.size === 0}
                  className="text-sm font-semibold text-destructive transition-opacity hover:underline disabled:opacity-40"
                >
                  Hapus
                </button>
              </div>
              <div className="divide-y divide-border px-5">
                {cart.items.map((item) => (
                  <CartItemRow
                    key={item.id}
                    item={item}
                    selected={cart.selectedIds.has(item.id)}
                    onToggle={() => cart.toggleSelect(item.id)}
                    onQtyChange={(q) => cart.updateQty(item.id, q)}
                    onRemove={() => cart.removeItem(item.id)}
                  />
                ))}
              </div>
            </div>

            <OrderSummary
              rows={[
                { label: `Total Harga (${cart.totalSelected} barang)`, value: cart.subTotal },
                { label: "Diskon Produk", value: 0 },
              ]}
              total={cart.subTotal}
              totalLabel="Sub Total"
              cta={{
                label: `Checkout (${cart.totalSelected})`,
                onClick: () => navigate({ to: "/checkout" }),
                disabled: cart.totalSelected === 0,
              }}
            />
          </div>
        )}
      </div>
    </MainLayout>
  );
}

function EmptyCart() {
  return (
    <div className="mt-16 flex flex-col items-center text-center">
      <div className="grid h-24 w-24 place-items-center rounded-full bg-muted text-muted-foreground">
        <ShoppingCart className="h-10 w-10" />
      </div>
      <h2 className="mt-5 text-lg font-bold text-foreground">Keranjang masih kosong</h2>
      <p className="mt-1 text-sm text-muted-foreground">Yuk mulai belanja material untuk proyekmu.</p>
      <Link
        to="/produk"
        className="mt-6 rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
      >
        Mulai Belanja
      </Link>
    </div>
  );
}
