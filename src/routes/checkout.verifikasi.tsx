import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Hourglass, MessageCircle, Home, Info, Package, Lock, Clock } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useCart } from "@/store/cart";
import { useCheckout } from "@/store/checkout";
import { formatRupiah } from "@/lib/format";
import { ESTIMATED_GROUP_SHIPPING_FEE } from "@/data/shopping";

export const Route = createFileRoute("/checkout/verifikasi")({
  head: () => ({ meta: [{ title: "Menunggu Verifikasi Admin — BahanMaterial.com" }] }),
  component: VerifikasiPage,
});

function VerifikasiPage() {
  const cart = useCart();
  const checkout = useCheckout();
  const navigate = useNavigate();

  const subtotalPesanan = cart.selectedGroups.reduce((s, g) => s + g.subTotal, 0);
  const shipping = checkout.mode === "dikirim" && !checkout.cod
    ? cart.selectedGroups.length * ESTIMATED_GROUP_SHIPPING_FEE * 2
    : 0;
  const discount = checkout.voucher?.discount ?? 0;
  const total = subtotalPesanan + shipping - discount;

  // Simulate admin verification after a few seconds.
  useEffect(() => {
    if (checkout.stage !== "verifying") return;
    const t = setTimeout(() => {
      checkout.markVerified(cart.selectedGroups.map((g) => g.warehouse));
      // For COD orders, skip payment method selection → go straight to success.
      if (checkout.cod) {
        navigate({ to: "/pembayaran/sukses" });
      } else {
        navigate({ to: "/checkout/pembayaran" });
      }
    }, 6000);
    return () => clearTimeout(t);
  }, [checkout, cart.selectedGroups, navigate]);

  return (
    <MainLayout user={{ name: "Auliya Gita Ananda" }}>
      <div className="border-b border-border bg-card">
        <div className="container mx-auto max-w-3xl px-4 py-5 text-center">
          <h1 className="text-2xl font-bold text-primary">Status Pesanan</h1>
        </div>
      </div>

      <div className="container mx-auto max-w-2xl px-4 py-10">
        <div className="flex flex-col items-center text-center">
          <div className="grid h-24 w-24 place-items-center rounded-full bg-primary-soft text-primary">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-primary text-primary-foreground">
              <Hourglass className="h-8 w-8" />
            </div>
          </div>
          <h2 className="mt-5 text-xl font-bold text-primary">Menunggu Verifikasi Admin</h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Pesanan anda sedang dalam proses peninjauan oleh tim admin pusat kami.
          </p>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <span className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">ID Pesanan</span>
            <span className="font-mono text-sm font-bold text-foreground">{checkout.orderId ?? "—"}</span>
          </div>
          <div className="flex items-center justify-between px-5 py-4">
            <span className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Total Pembayaran</span>
            <span className="text-base font-bold text-accent">{formatRupiah(total)}</span>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-card p-5">
          <p className="flex items-center gap-2 text-sm font-bold text-primary">
            <Info className="h-5 w-5" /> Apa yang sedang kami cek?
          </p>
          <ul className="mt-4 space-y-3 text-sm text-primary/90">
            <li className="flex items-start gap-3">
              <Package className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <span>Ketersediaan stok barang secara real-time di berbagai gudang cabang kami.</span>
            </li>
            <li className="flex items-start gap-3">
              <Lock className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <span>Kalkulasi tonase barang untuk memastikan pemilihan armada pengiriman yang tepat.</span>
            </li>
          </ul>
          <div className="mt-4 flex items-center gap-3 border-t border-border pt-4 text-sm font-semibold text-primary">
            <Clock className="h-5 w-5" />
            Estimasi verifikasi : 5 - 15 Menit
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <a
            href="https://wa.me/6281133331800"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-md border-2 border-primary px-5 py-3 text-sm font-bold text-primary hover:bg-primary/5"
          >
            <MessageCircle className="h-4 w-4" /> Hubungi Admin
          </a>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90"
          >
            <Home className="h-4 w-4" /> Kembali ke Beranda
          </Link>
        </div>

        <p className="mt-4 text-center text-xs italic text-muted-foreground">
          Anda akan menerima notifikasi setelah pesanan diverifikasi
        </p>
      </div>
    </MainLayout>
  );
}
