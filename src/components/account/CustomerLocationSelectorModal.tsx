import { useState } from "react";
import { Loader2, Plus, MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCustomerLocation } from "@/store/customer-location";
import { AddressCard } from "@/components/checkout/AddressCard";
import { AddressModal } from "@/components/account/AddressModal";

interface CustomerLocationSelectorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CustomerLocationSelectorModal({
  open,
  onOpenChange,
}: CustomerLocationSelectorModalProps) {
  const { locations, isLoading, selectedLocation, setSelectedLocation, refreshLocations } = useCustomerLocation();
  const [selectedId, setSelectedId] = useState(selectedLocation?.id || "");
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  const handleSelect = () => {
    const selected = locations.find((x) => x.id === selectedId);
    if (selected) {
      setSelectedLocation(selected);
    }
    onOpenChange(false);
  };

  const handleAddAddress = () => {
    setIsAddressModalOpen(true);
  };

  const handleAddressModalSuccess = () => {
    refreshLocations();
    setIsAddressModalOpen(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b border-border">
            <DialogTitle>Pilih Alamat Pengiriman</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                <span>Memuat alamat...</span>
              </div>
            ) : locations.length === 0 ? (
              <div className="text-center py-10 text-sm text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                <p>Belum ada alamat tersimpan.</p>
                <Button
                  onClick={handleAddAddress}
                  variant="outline"
                  className="mt-4"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Alamat
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {locations.map((addr) => (
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
                ))}
              </div>
            )}
          </div>

          <DialogFooter className="px-6 py-4 border-t border-border gap-3">
            {locations.length > 0 && (
              <Button
                onClick={handleAddAddress}
                variant="outline"
                className="h-11 px-6 text-sm font-bold"
              >
                <Plus className="h-4 w-4 mr-2" />
                Tambah Alamat
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-11 px-6 text-sm font-bold"
            >
              Batal
            </Button>
            <Button
              onClick={handleSelect}
              disabled={!selectedId || locations.length === 0}
              className="h-11 px-8 text-sm font-bold"
            >
              Gunakan Alamat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AddressModal
        open={isAddressModalOpen}
        onOpenChange={setIsAddressModalOpen}
        onSuccess={handleAddressModalSuccess}
      />
    </>
  );
}
