import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { AddressCard } from "@/components/checkout/AddressCard";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { MainLayout } from "@/components/layout/MainLayout";
import { useCustomerLocation } from "@/store/customer-location";
import { useCheckout } from "@/store/checkout";
import { AddressModal } from "@/components/account/AddressModal";

export const Route = createFileRoute("/checkout/alamat")({
  head: () => ({ meta: [{ title: "Pilih Alamat Pengiriman — BahanMaterial.com" }] }),
  component: AddressPickerPage,
});

function AddressPickerPage() {
  const { locations, isLoading, selectedLocation, setSelectedLocation, refreshLocations } = useCustomerLocation();
  const checkout = useCheckout();
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState(selectedLocation?.id || "");
  const [modalOpen, setModalOpen] = useState(false);

  const confirm = () => {
    const selected = locations.find((x) => x.id === selectedId);
    if (selected) {
      setSelectedLocation(selected);
      // Update checkout address format to match existing Address type
      checkout.setAddress({
        id: selected.id,
        label: selected.name,
        recipient: selected.name,
        phone: selected.phone,
        address: selected.address,
        city: selected.address,
        isPrimary: selected.is_default,
      });
    }
    navigate({ to: "/checkout" });
  };

  return (
    <MainLayout>
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
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            <Plus className="h-4 w-4" /> Tambah Alamat
          </button>
        </div>
        <div className="mt-5 space-y-3">
          {isLoading ? (
            <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              <span>Memuat alamat...</span>
            </div>
          ) : locations.length === 0 ? (
            <div className="text-center py-10 text-sm text-muted-foreground">
              <p>Belum ada alamat tersimpan.</p>
            </div>
          ) : (
            locations.map((addr) => (
              <AddressCard
                key={addr.id}
                address={{
                  id: addr.id,
                  label: addr.name,
                  recipient: addr.name,
                  phone: addr.phone,
                  address: addr.address,
                  city: addr.address,
                  isPrimary: addr.is_default,
                }}
                selectable
                selected={addr.id === selectedId}
                onSelect={() => setSelectedId(addr.id)}
              />
            ))
          )}
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
      <AddressModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSuccess={refreshLocations}
      />
    </MainLayout>
  );
}
