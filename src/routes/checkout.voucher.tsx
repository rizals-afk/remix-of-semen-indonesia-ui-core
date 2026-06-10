import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { VoucherCard } from "@/components/checkout/VoucherCard";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { MainLayout } from "@/components/layout/MainLayout";
import { VOUCHERS } from "@/data/shopping";
import { useCart } from "@/store/cart";
import { useCheckout } from "@/store/checkout";

export const Route = createFileRoute("/checkout/voucher")({
  head: () => ({ meta: [{ title: "Pilih Voucher — BahanMaterial.com" }] }),
  component: VoucherPickerPage,
});

function VoucherPickerPage() {
  const cart = useCart();
  const checkout = useCheckout();
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string | null>(checkout.voucher?.id ?? null);
  const [code, setCode] = useState("");

  const eligible = (v: (typeof VOUCHERS)[number]) => cart.subTotal >= v.minSpend;

  const confirm = () => {
    const v = VOUCHERS.find((x) => x.id === selectedId) ?? null;
    checkout.setVoucher(v);
    navigate({ to: "/checkout" });
  };

  return (
    <MainLayout user={{ name: "Auliya Gita Ananda" }}>
      <div className="container mx-auto max-w-3xl px-4 py-6">
        <Breadcrumbs
          items={[
            { label: "Home", to: "/" },
            { label: "Checkout", to: "/checkout" },
            { label: "Voucher Saya" },
          ]}
        />
        <h1 className="mt-6 text-2xl font-bold text-foreground">Voucher Saya</h1>

        <div className="mt-4 flex gap-2">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Masukkan kode voucher"
            className="flex-1 rounded-md border border-border bg-background px-3 py-2.5 text-sm uppercase focus:border-primary focus:outline-none"
          />
          <button
            onClick={() => {
              const v = VOUCHERS.find((x) => x.code === code);
              if (v && eligible(v)) setSelectedId(v.id);
            }}
            className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Pakai
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {VOUCHERS.map((v) => (
            <VoucherCard
              key={v.id}
              voucher={v}
              selected={v.id === selectedId}
              disabled={!eligible(v)}
              onSelect={() => setSelectedId(v.id)}
            />
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => { setSelectedId(null); checkout.setVoucher(null); navigate({ to: "/checkout" }); }}
            className="rounded-md border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-muted"
          >
            Tanpa Voucher
          </button>
          <button
            onClick={confirm}
            disabled={!selectedId}
            className="rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            Gunakan Voucher
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
