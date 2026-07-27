import { lazy, Suspense, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useCustomerLocation } from "@/store/customer-location";
import type { CustomerLocation } from "@/lib/api/customer-location";
import {
  createCustomerLocation,
  updateCustomerLocation,
} from "@/lib/api/customer-location";
import { toast } from "sonner";

const SearchableAddressMap = lazy(() => import("./SearchableAddressMap"));

interface AddressForm {
  id?: string;
  recipient: string;
  phone: string;
  region: string;
  street: string;
  lat: number;
  lng: number;
  isPrimary: boolean;
}

const EMPTY_FORM: AddressForm = {
  recipient: "",
  phone: "",
  region: "",
  street: "",
  lat: -7.2504,
  lng: 112.7688,
  isPrimary: false,
};

interface AddressModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  addressToEdit?: CustomerLocation | null;
  onSuccess?: () => void;
}

export function AddressModal({ open, onOpenChange, addressToEdit, onSuccess }: AddressModalProps) {
  const { refreshLocations, setSelectedLocation } = useCustomerLocation();
  const [form, setForm] = useState<AddressForm>(EMPTY_FORM);
  const [mapReady, setMapReady] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Reset form when modal opens/closes or addressToEdit changes
  useEffect(() => {
    if (open && addressToEdit) {
      setForm({
        id: addressToEdit.id,
        recipient: addressToEdit.name,
        phone: addressToEdit.phone,
        region: addressToEdit.address,
        street: addressToEdit.address,
        lat: addressToEdit.lat,
        lng: addressToEdit.long,
        isPrimary: addressToEdit.is_default,
      });
    } else if (open) {
      setForm(EMPTY_FORM);
    }
  }, [open, addressToEdit]);

  useEffect(() => {
    if (open) setMapReady(true);
  }, [open]);

  const save = async () => {
    // Validate required fields
    if (!form.recipient || !form.phone || !form.region || !form.street) {
      toast.error("Mohon lengkapi semua field");
      return;
    }

    setIsSaving(true);
    try {
      let savedLocation: CustomerLocation;
      
      if (form.id) {
        // Update existing address
        savedLocation = await updateCustomerLocation(form.id, {
          name: form.recipient,
          phone: form.phone,
          address: form.street,
          lat: form.lat,
          long: form.lng,
          is_default: form.isPrimary,
        });
        toast.success("Alamat berhasil diperbarui");
      } else {
        // Create new address
        savedLocation = await createCustomerLocation({
          name: form.recipient,
          phone: form.phone,
          address: form.street,
          lat: form.lat,
          long: form.lng,
          is_default: form.isPrimary,
        });
        toast.success("Alamat berhasil ditambahkan");
      }
      
      await refreshLocations();
      
      // Auto-select if it's the default address
      if (savedLocation.is_default) {
        setSelectedLocation(savedLocation);
      }
      
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Gagal menyimpan alamat");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b border-border">
          <DialogTitle>{form.id ? "Ubah Alamat" : "Alamat Baru"}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Nama Lengkap</label>
              <Input
                value={form.recipient}
                onChange={(e) => setForm({ ...form, recipient: e.target.value })}
                className="h-11"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Nomor Telepon</label>
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="h-11"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Provinsi, Kota, Kecamatan, Kode Pos
            </label>
            <Input
              value={form.region}
              onChange={(e) => setForm({ ...form, region: e.target.value })}
              className="h-11"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Nama Jalan, Gedung</label>
            <Input
              value={form.street}
              onChange={(e) => setForm({ ...form, street: e.target.value })}
              className="h-11"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Titik Lokasi</label>
            <div className="overflow-hidden rounded-md border border-border">
              {mapReady ? (
                <Suspense
                  fallback={
                    <div className="grid h-56 place-items-center text-sm text-muted-foreground">
                      Memuat peta…
                    </div>
                  }
                >
                  <SearchableAddressMap
                    height="240px"
                    lat={form.lat}
                    lng={form.lng}
                    onChange={(lat: number, lng: number, address?: string) => {
                      setForm((f) => ({ ...f, lat, lng }));
                      if (address) {
                        setForm((f) => ({ ...f, street: address }));
                      }
                    }}
                  />
                </Suspense>
              ) : (
                <div className="grid h-56 place-items-center text-sm text-muted-foreground">
                  Memuat peta…
                </div>
              )}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Klik, geser pin, atau cari lokasi untuk menyesuaikan titik.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-sm font-medium">Atur sebagai Alamat Utama</span>
            <Switch
              checked={form.isPrimary}
              onCheckedChange={(v) => setForm({ ...form, isPrimary: v })}
            />
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-border">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
            className="h-11 px-6 text-sm font-bold"
          >
            Batal
          </Button>
          <Button onClick={save} disabled={isSaving} className="h-11 px-8 text-sm font-bold">
            {isSaving ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Menyimpan...
              </span>
            ) : (
              "Simpan"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
