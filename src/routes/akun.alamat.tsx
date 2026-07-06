import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { ADDRESSES, type Address } from "@/data/shopping";

const AddressMap = lazy(() => import("@/components/account/AddressMap"));

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
  const [addresses, setAddresses] = useState<Address[]>(ADDRESSES);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<AddressForm>(EMPTY_FORM);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (open) setMapReady(true);
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return addresses;
    return addresses.filter((a) =>
      [a.label, a.recipient, a.phone, a.address, a.city]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [addresses, query]);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setOpen(true);
  };

  const openEdit = (a: Address) => {
    setForm({
      id: a.id,
      recipient: a.recipient,
      phone: a.phone,
      region: a.city,
      street: a.address,
      lat: -7.2504,
      lng: 112.7688,
      isPrimary: !!a.isPrimary,
    });
    setOpen(true);
  };

  const save = () => {
    setAddresses((prev) => {
      const next: Address = {
        id: form.id ?? `addr-${Date.now()}`,
        label: form.recipient || "Alamat",
        recipient: form.recipient,
        phone: form.phone,
        address: form.street,
        city: form.region,
        isPrimary: form.isPrimary,
      };
      let list = form.id
        ? prev.map((a) => (a.id === form.id ? next : a))
        : [...prev, next];
      if (form.isPrimary) {
        list = list.map((a) => ({ ...a, isPrimary: a.id === next.id }));
      }
      return list;
    });
    setOpen(false);
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
        {filtered.length === 0 ? (
          <li className="py-10 text-center text-sm text-muted-foreground">
            Tidak ada alamat yang cocok.
          </li>
        ) : (
          filtered.map((a) => (
            <li key={a.id} className="flex items-start justify-between gap-4 py-5">
              <div className="min-w-0">
                <p className="text-sm">
                  <span className="font-bold text-foreground">{a.recipient}</span>
                  <span className="mx-2 text-muted-foreground">|</span>
                  <span className="text-foreground">{a.phone}</span>
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {a.address}, {a.city}
                </p>
                {a.isPrimary ? (
                  <span className="mt-2 inline-block rounded bg-primary-soft px-2 py-0.5 text-xs font-semibold text-primary">
                    Utama
                  </span>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => openEdit(a)}
                className="shrink-0 text-sm font-bold text-primary hover:underline"
              >
                Ubah
              </button>
            </li>
          ))
        )}
      </ul>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{form.id ? "Ubah Alamat" : "Alamat Baru"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
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
                      <div className="grid h-[260px] place-items-center text-sm text-muted-foreground">
                        Memuat peta…
                      </div>
                    }
                  >
                    <AddressMap
                      lat={form.lat}
                      lng={form.lng}
                      onChange={(lat, lng) => setForm((f) => ({ ...f, lat, lng }))}
                    />
                  </Suspense>
                ) : (
                  <div className="grid h-[260px] place-items-center text-sm text-muted-foreground">
                    Memuat peta…
                  </div>
                )}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Klik atau geser pin untuk menyesuaikan titik.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-sm font-medium">Atur sebagai Alamat Utama</span>
              <Switch
                checked={form.isPrimary}
                onCheckedChange={(v) => setForm({ ...form, isPrimary: v })}
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button onClick={save} className="h-11 px-8 text-sm font-bold">
                Simpan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}