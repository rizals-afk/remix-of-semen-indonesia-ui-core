import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { CartWarehouseGroupCard } from "@/components/cart/CartWarehouseGroupCard";
import { MainLayout } from "@/components/layout/MainLayout";
import { useCart } from "@/store/cart";
import { formatRupiah } from "@/lib/format";

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
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-2xl font-bold text-primary">Keranjang</h1>

        {cart.items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="mt-6 space-y-4">
            {/* Header row */}
            <div className="hidden rounded-2xl border border-border bg-card px-5 py-4 md:block">
              <div className="grid grid-cols-[auto_minmax(0,2.2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] items-center gap-4 text-sm font-semibold text-foreground">
                <span />
                <span>Nama Produk</span>
                <span>Harga Satuan</span>
                <span>Kuantitas</span>
                <span>Total Harga</span>
                <span>Aksi</span>
              </div>
            </div>

            {cart.groups.map((g) => (
              <CartWarehouseGroupCard
                key={g.warehouse}
                group={g}
                selectedIds={cart.selectedIds}
                onToggleItem={cart.toggleSelect}
                onToggleGroup={cart.toggleSelectGroup}
                onQtyChange={cart.updateQty}
                onRemove={cart.removeItem}
              />
            ))}

            {/* Footer summary bar */}
            <div className="sticky bottom-0 z-10 grid grid-cols-1 items-center gap-4 rounded-2xl border border-border bg-card px-5 py-4 shadow-sm md:grid-cols-[auto_auto_1fr_auto_auto]">
              <label className="flex items-center gap-3 text-sm font-semibold text-foreground">
                <Checkbox checked={allSelected} onCheckedChange={(v) => cart.toggleSelectAll(Boolean(v))} />
                Pilih Semua
              </label>
              <button
                onClick={cart.clearSelected}
                disabled={cart.selectedIds.size === 0}
                className="text-sm font-semibold text-primary hover:underline disabled:opacity-40"
              >
                Hapus
              </button>
              <div className="md:text-right">
                <p className="text-sm font-semibold text-foreground">Total Harga</p>
                <p className="text-xs text-muted-foreground">Total ({cart.totalSelected} Produk):</p>
              </div>
              <p className="text-lg font-bold text-accent">{formatRupiah(cart.subTotal)}</p>
              <button
                onClick={() => navigate({ to: "/checkout" })}
                disabled={cart.totalSelected === 0}
                className="rounded-md bg-primary px-8 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
              >
                Beli Sekarang
              </button>
            </div>
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
