import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Plus } from "lucide-react";
import { AddressCard } from "@/components/checkout/AddressCard";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { MainLayout } from "@/components/layout/MainLayout";
import { ADDRESSES } from "@/data/shopping";
import { useCheckout } from "@/store/checkout";

export const Route = createFileRoute("/checkout/alamat")({
  head: () => ({ meta: [{ title: "Pilih Alamat Pengiriman — BahanMaterial.com" }] }),
  component: AddressPickerPage,
});

function AddressPickerPage() {
  const checkout = useCheckout();
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState(checkout.address.id);

  const confirm = () => {
    const a = ADDRESSES.find((x) => x.id === selectedId);
    if (a) checkout.setAddress(a);
    navigate({ to: "/checkout" });
  };

  return (
    <MainLayout user={{ name: "Auliya Gita Ananda" }}>
      <div className="container mx-auto max-w-3xl px-4 py-6">
        <Breadcrumbs
          items={[
            { label: "Home", to: "/" },
            { label: "Checkout", to: "/checkout" },
            { label: "Pilih Alamat" },
          ]}
        />
        <div className="mt-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Pilih Alamat Pengiriman</h1>
          <button className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
            <Plus className="h-4 w-4" /> Tambah Alamat
          </button>
        </div>
        <div className="mt-5 space-y-3">
          {ADDRESSES.map((addr) => (
            <AddressCard
              key={addr.id}
              address={addr}
              selectable
              selected={addr.id === selectedId}
              onSelect={() => setSelectedId(addr.id)}
            />
          ))}
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => navigate({ to: "/checkout" })}
            className="rounded-md border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-muted"
          >
            Batal
          </button>
          <button
            onClick={confirm}
            className="rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Gunakan Alamat
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
