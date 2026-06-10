import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { CheckoutStepper } from "@/components/checkout/CheckoutStepper";
import { MainLayout } from "@/components/layout/MainLayout";
import { useCart } from "@/store/cart";
import { useCheckout } from "@/store/checkout";
import { formatRupiah } from "@/lib/format";

export const Route = createFileRoute("/pembayaran/sukses")({
  head: () => ({ meta: [{ title: "Pembayaran Berhasil — BahanMaterial.com" }] }),
  component: PaymentSuccessPage,
});

function PaymentSuccessPage() {
  const cart = useCart();
  const checkout = useCheckout();
  const orderNumber = "BM-" + Math.floor(Math.random() * 9_000_000 + 1_000_000);
  const fee = checkout.payment?.fee ?? 0;
  const discount = checkout.voucher?.discount ?? 0;
  const total = cart.subTotal + checkout.shippingFee + fee - discount;

  return (
    <MainLayout user={{ name: "Auliya Gita Ananda" }}>
      <div className="container mx-auto max-w-3xl px-4 py-10">
        <CheckoutStepper current={4} />

        <div className="mt-10 rounded-2xl border border-border bg-card p-8 text-center">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-success/15 text-success">
            <CheckCircle2 className="h-12 w-12" />
          </div>
          <h1 className="mt-5 text-2xl font-bold text-foreground">Pembayaran Berhasil!</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Terima kasih, pesananmu sudah kami terima dan sedang diproses.
          </p>

          <dl className="mx-auto mt-6 max-w-md space-y-2 rounded-lg bg-muted/50 p-4 text-left text-sm">
            <Row label="Nomor Pesanan" value={orderNumber} mono />
            <Row label="Metode Pembayaran" value={checkout.payment?.name ?? "-"} />
            <Row
              label={checkout.mode === "dikirim" ? "Dikirim ke" : "Diambil di"}
              value={checkout.mode === "dikirim" ? checkout.address.label : checkout.warehouse.name}
            />
            <div className="border-t border-border pt-2">
              <Row label="Total Pembayaran" value={formatRupiah(total)} bold />
            </div>
          </dl>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              to="/akun"
              className="rounded-md border border-primary px-6 py-2.5 text-sm font-semibold text-primary hover:bg-primary/5"
            >
              Lihat Pesanan
            </Link>
            <Link
              to="/"
              className="rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

function Row({ label, value, mono, bold }: { label: string; value: string; mono?: boolean; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className={(mono ? "font-mono " : "") + (bold ? "text-base font-bold text-accent" : "font-semibold text-foreground")}>
        {value}
      </span>
    </div>
  );
}
