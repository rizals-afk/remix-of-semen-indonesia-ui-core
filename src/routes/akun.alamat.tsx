import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, Trash2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useCustomerLocation } from "@/store/customer-location";
import type { CustomerLocation } from "@/lib/api/customer-location";
import {
  deleteCustomerLocation,
  fetchCustomerLocations,
} from "@/lib/api/customer-location";
import { toast } from "sonner";
import { AddressModal } from "@/components/account/AddressModal";

export const Route = createFileRoute("/akun/alamat")({
  head: () => ({ meta: [{ title: "Alamat Pengiriman — BahanMaterial.com" }] }),
  component: AlamatPage,
});

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

function AlamatPage() {
  const { locations, isLoading, refreshLocations, selectedLocation, setSelectedLocation } = useCustomerLocation();
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState<CustomerLocation | null>(null);
  const [searchResults, setSearchResults] = useState<CustomerLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<CustomerLocation | null>(null);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!query.trim()) {
        setSearchResults(locations);
        return;
      }

      setIsSearching(true);
      try {
        const response = await fetchCustomerLocations({ search: query, per_page: 999, page: 1 });
        setSearchResults(response.data);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query, locations]);

  // Initialize search results with all locations
  useEffect(() => {
    setSearchResults(locations);
  }, [locations]);

  const filtered = useMemo(() => {
    if (!query.trim()) return locations;
    return searchResults;
  }, [query, searchResults, locations]);

  const openCreate = () => {
    setAddressToEdit(null);
    setModalOpen(true);
  };

  const openEdit = (a: CustomerLocation) => {
    setAddressToEdit(a);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    const address = locations.find((a) => a.id === id);
    if (address) {
      setAddressToDelete(address);
      setDeleteDialogOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (!addressToDelete) return;

    try {
      await deleteCustomerLocation(addressToDelete.id);
      toast.success("Alamat berhasil dihapus");
      
      // If the deleted address was currently selected, select default or first
      if (selectedLocation?.id === addressToDelete.id) {
        await refreshLocations();
      } else {
        await refreshLocations();
      }
      
      setDeleteDialogOpen(false);
      setAddressToDelete(null);
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Gagal menghapus alamat");
    }
  };

  const save = async () => {
    // This is now handled by AddressModal
  };

  return (
    <section className="rounded-2xl border border-border bg-card p-6 md:p-8">
      <h2 className="text-lg font-bold text-foreground">Alamat Pengiriman</h2>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari alamat"
            className="h-11 pr-11"
          />
          <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
        <Button
          onClick={openCreate}
          className="h-11 px-6 text-sm font-bold"
        >
          Tambah Alamat
        </Button>
      </div>

      <ul className="mt-6 divide-y divide-border">
        {isLoading ? (
          <li className="py-10 text-center text-sm text-muted-foreground">
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Memuat alamat...</span>
            </div>
          </li>
        ) : filtered.length === 0 ? (
          <li className="py-10 text-center text-sm text-muted-foreground">
            {query ? (
              <p>Tidak ada alamat yang cocok dengan pencarian.</p>
            ) : (
              <div className="space-y-3">
                <p>Belum ada alamat tersimpan.</p>
                <Button onClick={openCreate} className="h-9 px-4 text-sm">
                  Tambah Alamat
                </Button>
              </div>
            )}
          </li>
        ) : (
          filtered.map((a) => (
            <li key={a.id} className="flex items-start justify-between gap-4 py-5">
              <div className="min-w-0">
                <p className="text-sm">
                  <span className="font-bold text-foreground">{a.name}</span>
                  <span className="mx-2 text-muted-foreground">|</span>
                  <span className="text-foreground">{a.phone}</span>
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{a.address}</p>
                {a.is_default ? (
                  <span className="mt-2 inline-block rounded bg-primary-soft px-2 py-0.5 text-xs font-semibold text-primary">
                    Alamat Utama
                  </span>
                ) : null}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => openEdit(a)}
                  className="text-sm font-bold text-primary hover:underline"
                >
                  Ubah
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(a.id)}
                  className="text-sm font-bold text-destructive hover:underline"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))
        )}
      </ul>

      <AddressModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        addressToEdit={addressToEdit}
        onSuccess={refreshLocations}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Alamat</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus alamat ini?
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}