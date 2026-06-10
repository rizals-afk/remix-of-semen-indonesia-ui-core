import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { CheckoutStepper } from "@/components/checkout/CheckoutStepper";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { PaymentMethodList } from "@/components/checkout/PaymentMethodList";
import { MainLayout } from "@/components/layout/MainLayout";
import { PAYMENT_METHODS } from "@/data/shopping";
import { useCart } from "@/store/cart";
import { useCheckout } from "@/store/checkout";

export const Route = createFileRoute("/checkout/pembayaran")({
  head: () => ({ meta: [{ title: "Pilih Metode Pembayaran — BahanMaterial.com" }] }),
  component: PaymentMethodPage,
});

function PaymentMethodPage() {
  const cart = useCart();
  const checkout = useCheckout();
  const navigate = useNavigate();

  const fee = checkout.payment?.fee ?? 0;
  const discount = checkout.voucher?.discount ?? 0;
  const total = cart.subTotal + checkout.shippingFee + fee - discount;

  return (
    <MainLayout user={{ name: "Auliya Gita Ananda" }}>
      <div className="container mx-auto max-w-7xl px-4 py-6">
        <Breadcrumbs
          items={[
            { label: "Home", to: "/" },
            { label: "Checkout", to: "/checkout" },
            { label: "Metode Pembayaran" },
          ]}
        />
        <div className="mt-6">
          <CheckoutStepper current={3} />
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="rounded-2xl border border-border bg-card p-5 md:p-6">
            <h2 className="text-lg font-bold text-foreground">Pilih Metode Pembayaran</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Pilih metode pembayaran yang paling nyaman untuk Anda.
            </p>
            <div className="mt-6">
              <PaymentMethodList
                methods={PAYMENT_METHODS}
                selectedId={checkout.payment?.id}
                onSelect={checkout.setPayment}
              />
            </div>
          </div>

          <OrderSummary
            rows={[
              { label: "Subtotal Produk", value: cart.subTotal },
              { label: "Ongkos Kirim", value: checkout.shippingFee },
              { label: "Biaya Layanan", value: fee },
              ...(discount > 0
                ? [{ label: `Voucher (${checkout.voucher!.code})`, value: discount, isDiscount: true }]
                : []),
            ]}
            total={total}
            cta={{
              label: "Bayar Sekarang",
              onClick: () => navigate({ to: "/pembayaran/sukses" }),
              disabled: !checkout.payment,
            }}
          />
        </div>
      </div>
    </MainLayout>
  );
}
