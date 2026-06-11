import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronDown, ThumbsUp, Clock, QrCode, Banknote, Wallet, Store } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { OrderProductGroup } from "@/components/checkout/OrderProductGroup";
import { PAYMENT_METHODS, type PaymentMethod } from "@/data/shopping";
import { useCart } from "@/store/cart";
import { useCheckout } from "@/store/checkout";
import { formatRupiah } from "@/lib/format";

export const Route = createFileRoute("/checkout/pembayaran")({
  head: () => ({ meta: [{ title: "Metode Pembayaran — BahanMaterial.com" }] }),
  component: PaymentMethodPage,
});

const CATEGORY_ORDER: PaymentMethod["category"][] = ["QRIS", "Transfer Bank", "E-Wallet", "Tunai"];
const CATEGORY_ICON: Record<PaymentMethod["category"], React.ReactNode> = {
  QRIS: <QrCode className="h-5 w-5" />,
  "Transfer Bank": <Banknote className="h-5 w-5" />,
  "E-Wallet": <Wallet className="h-5 w-5" />,
  Tunai: <Store className="h-5 w-5" />,
};

function useCountdown(seconds: number) {
  const [remaining, setRemaining] = useState(seconds);
  useEffect(() => {
    const t = setInterval(() => setRemaining((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);
  const h = String(Math.floor(remaining / 3600)).padStart(2, "0");
  const m = String(Math.floor((remaining % 3600) / 60)).padStart(2, "0");
  const s = String(remaining % 60).padStart(2, "0");
  return `${h} : ${m} : ${s}`;
}

function PaymentMethodPage() {
  const cart = useCart();
  const checkout = useCheckout();
  const navigate = useNavigate();
  const countdown = useCountdown(24 * 60 * 60 - 1);

  const groups = cart.selectedGroups;
  const subtotalPesanan = groups.reduce((s, g) => s + g.subTotal, 0);
  const totalTonase = groups.reduce((s, g) => s + g.tonase, 0);
  const shippingTotal = groups.reduce(
    (s, g) => s + (checkout.groupShippingFees[g.warehouse] ?? 0),
    0,
  );
  const discount = checkout.voucher?.discount ?? 0;
  const total = subtotalPesanan + shippingTotal - discount;

  const grouped = CATEGORY_ORDER.reduce<Record<string, PaymentMethod[]>>((acc, cat) => {
    acc[cat] = PAYMENT_METHODS.filter((m) => m.category === cat);
    return acc;
  }, {});

  const [openCat, setOpenCat] = useState<string | null>("Transfer Bank");

  const pay = () => {
    checkout.setStage("paid");
    navigate({ to: "/pembayaran/sukses" });
  };

  return (
    <MainLayout user={{ name: "Auliya Gita Ananda" }}>
      <div className="border-b border-border bg-card">
        <div className="container mx-auto max-w-7xl px-4 py-5">
          <h1 className="text-2xl font-bold text-primary">Metode Pembayaran</h1>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-6">
        <Link to="/akun" className="inline-flex items-center gap-1 text-sm font-semibold text-foreground hover:text-primary">
          <ChevronLeft className="h-4 w-4" /> Kembali ke Riwayat Pesanan
        </Link>

        {/* Verified banner */}
        <div className="mt-5 rounded-2xl border-2 border-primary bg-primary-soft/40 px-6 py-6 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary/20 text-primary">
            <ThumbsUp className="h-7 w-7" />
          </div>
          <h2 className="mt-3 text-lg font-bold text-primary">Pesanan Terverifikasi</h2>
          <p className="mt-1 text-sm text-foreground">
            Admin telah memverifikasi pesanan Anda dan telah menginputkan biaya pengiriman.
          </p>
          <p className="text-sm text-foreground">Silahkan selesaikan pembayaran.</p>
          <div className="mx-auto mt-4 inline-flex items-center gap-3 rounded-md bg-destructive/10 px-4 py-2 text-sm font-semibold text-destructive">
            <Clock className="h-4 w-4" /> Selesaikan dalam <span className="font-mono font-bold">{countdown}</span>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-5">
            {groups.map((g) => (
              <OrderProductGroup
                key={g.warehouse}
                group={g}
                note={checkout.notes[g.warehouse] ?? ""}
                onNoteChange={() => {}}
                shippingFee={checkout.groupShippingFees[g.warehouse]}
                readOnly
              />
            ))}
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
            <div className="rounded-2xl border border-border bg-card p-5">
              <h2 className="text-base font-bold text-foreground">Metode Pembayaran</h2>
              <div className="mt-4 space-y-2">
                {CATEGORY_ORDER.map((cat) => {
                  const list = grouped[cat] ?? [];
                  const isOpen = openCat === cat;
                  return (
                    <div key={cat} className="rounded-md border border-border">
                      <button
                        type="button"
                        onClick={() => setOpenCat(isOpen ? null : cat)}
                        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                      >
                        <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                          <span className="text-primary">{CATEGORY_ICON[cat]}</span>
                          {cat}
                        </span>
                        <ChevronDown className={"h-4 w-4 text-muted-foreground transition-transform " + (isOpen ? "rotate-180" : "")} />
                      </button>
                      {isOpen ? (
                        <div className="divide-y divide-border border-t border-border">
                          {list.map((m) => {
                            const selected = checkout.payment?.id === m.id;
                            return (
                              <button
                                key={m.id}
                                type="button"
                                onClick={() => checkout.setPayment(m)}
                                className={"flex w-full items-center justify-between px-4 py-3 text-left text-sm " + (selected ? "bg-primary-soft/30" : "hover:bg-muted")}
                              >
                                <span className="font-medium text-foreground">{m.name}</span>
                                <span className={"grid h-5 w-5 place-items-center rounded-full border-2 " + (selected ? "border-primary bg-primary" : "border-border")} />
                              </button>
                            );
                          })}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <h2 className="text-base font-bold text-foreground">Rincian Pembayaran</h2>
              <dl className="mt-4 space-y-3 text-sm">
                <Row label="Subtotal Tonase" value={`${totalTonase.toLocaleString("id-ID")} Ton`} />
                <Row label="Subtotal Pesanan" value={formatRupiah(subtotalPesanan)} />
                <Row label="Subtotal Pengiriman" value={formatRupiah(shippingTotal)} />
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
                onClick={pay}
                disabled={!checkout.payment}
                className="mt-5 w-full rounded-md bg-primary py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                Bayar Sekarang
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
