import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { VoucherCard } from "@/components/checkout/VoucherCard";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { MainLayout } from "@/components/layout/MainLayout";
import { VOUCHERS } from "@/data/shopping";
import { useCart } from "@/store/cart";
import { useCheckout } from "@/store/checkout";
import { fetchVouchers, type Voucher as ApiVoucher } from "@/lib/api/voucher";

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
  const [vouchers, setVouchers] = useState<typeof VOUCHERS>(VOUCHERS);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch vouchers from API
  useEffect(() => {
    const loadVouchers = async () => {
      try {
        const response = await fetchVouchers({ per_page: 15, page: 1, type: "voucher", search: searchQuery });
        console.log("Vouchers API response:", response);

        // Map API vouchers to frontend format
        const mappedVouchers = response.data.map((apiVoucher: ApiVoucher) => {
          // Calculate discount value
          let discount = 0;
          if (apiVoucher.discount_amount) {
            discount = parseFloat(apiVoucher.discount_amount);
          } else if (apiVoucher.discount_percentage) {
            // For percentage, we'll show the percentage value (this might need adjustment based on requirements)
            discount = parseFloat(apiVoucher.discount_percentage);
          }

          // Format expiry date
          let expiresAt = "Tidak ada batas";
          if (apiVoucher.valid_end) {
            const date = new Date(apiVoucher.valid_end);
            expiresAt = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
          }

          // Map discount_type to frontend type
          let type: "shipping" | "discount" | "cashback" = "discount";
          if (apiVoucher.discount_type === "percentage") {
            type = "discount";
          } else if (apiVoucher.discount_type === "amount" || apiVoucher.discount_type === "fixed") {
            type = "cashback";
          }

          return {
            id: String(apiVoucher.id),
            code: apiVoucher.code,
            title: apiVoucher.name,
            description: apiVoucher.description || "",
            discount: discount,
            minSpend: parseFloat(apiVoucher.min_purchase),
            expiresAt: expiresAt,
            type: type,
          };
        });

        setVouchers(mappedVouchers);
      } catch (error) {
        console.error("Failed to load vouchers:", error);
        // Fallback to static data
        setVouchers(VOUCHERS);
      } finally {
        setLoading(false);
      }
    };

    loadVouchers();
  }, [searchQuery]);

  const eligible = (v: (typeof VOUCHERS)[number]) => cart.subTotal >= v.minSpend;

  const confirm = () => {
    const v = vouchers.find((x) => x.id === selectedId) ?? null;
    checkout.setVoucher(v);
    navigate({ to: "/checkout" });
  };

  return (
    <MainLayout>
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
              const v = vouchers.find((x) => x.code === code);
              if (v && eligible(v)) setSelectedId(v.id);
            }}
            className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Pakai
          </button>
        </div>

        {loading ? (
          <div className="mt-5 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            {vouchers.length > 0 ? (
              vouchers.map((v) => (
                <VoucherCard
                  key={v.id}
                  voucher={v}
                  selected={v.id === selectedId}
                  disabled={!eligible(v)}
                  onSelect={() => setSelectedId(v.id)}
                />
              ))
            ) : (
              <p className="text-center text-sm text-muted-foreground">Tidak ada voucher tersedia</p>
            )}
          </div>
        )}

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
