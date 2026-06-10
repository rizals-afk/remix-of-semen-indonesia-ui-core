import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { WarehouseCard } from "@/components/checkout/WarehouseCard";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { MainLayout } from "@/components/layout/MainLayout";
import { WAREHOUSES } from "@/data/shopping";
import { useCheckout } from "@/store/checkout";

export const Route = createFileRoute("/checkout/gudang")({
  head: () => ({ meta: [{ title: "Pilih Gudang Pengambilan — BahanMaterial.com" }] }),
  component: WarehousePickerPage,
});

function WarehousePickerPage() {
  const checkout = useCheckout();
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState(checkout.warehouse.id);
  const [q, setQ] = useState("");

  const filtered = WAREHOUSES.filter(
    (w) => w.name.toLowerCase().includes(q.toLowerCase()) || w.address.toLowerCase().includes(q.toLowerCase()),
  );

  const confirm = () => {
    const w = WAREHOUSES.find((x) => x.id === selectedId);
    if (w) checkout.setWarehouse(w);
    checkout.setMode("diambil");
    navigate({ to: "/checkout" });
  };

  return (
    <MainLayout user={{ name: "Auliya Gita Ananda" }}>
      <div className="container mx-auto max-w-3xl px-4 py-6">
        <Breadcrumbs
          items={[
            { label: "Home", to: "/" },
            { label: "Checkout", to: "/checkout" },
            { label: "Pilih Gudang" },
          ]}
        />
        <h1 className="mt-6 text-2xl font-bold text-foreground">Pilih Gudang Pengambilan</h1>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari gudang terdekat..."
            className="w-full rounded-md border border-border bg-background py-2.5 pl-10 pr-3 text-sm focus:border-primary focus:outline-none"
          />
        </div>
        <div className="mt-5 space-y-3">
          {filtered.map((w) => (
            <WarehouseCard
              key={w.id}
              warehouse={w}
              selected={w.id === selectedId}
              onSelect={() => setSelectedId(w.id)}
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
            Gunakan Gudang
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
