import { useState } from "react";
import { Warehouse, Camera, Video, ChevronRight, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QuantityStepper } from "@/components/common/QuantityStepper";
import { createReturn, type CreateReturnRequest, type ReturnPhoto } from "@/lib/api/trx";
import { toast } from "sonner";

export interface ReturnProduct {
  name: string;
  variant?: string;
  image?: string;
  maxQty?: number;
}

export interface ReturnLineItem {
  product_id: number;
  product_variant_id: number;
  name: string;
  variant?: string;
  image?: string;
  qty: number;
  maxQty: number;
}

interface ReturnRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  warehouseName?: string;
  branchName?: string;
  products: ReturnLineItem[];
  address?: {
    id?: number;
    name?: string;
    phone?: string;
    address?: string;
    city?: string;
    postalCode?: string;
    lat?: number;
    long?: number;
  };
  trxId: number;
  onSubmit?: () => void | Promise<void>;
}

const REASONS = [
  "Barang rusak",
  "Barang tidak sesuai pesanan",
  "Jumlah tidak sesuai",
  "Kemasan rusak",
  "Lainnya",
];

/** "Pengembalian Produk" modal for refund / return requests. */
export function ReturnRequestDialog({
  open,
  onOpenChange,
  warehouseName,
  branchName,
  products,
  address,
  trxId,
  onSubmit,
}: ReturnRequestDialogProps) {
  const [selectedProducts, setSelectedProducts] = useState<ReturnLineItem[]>(
    products.map(p => ({ ...p, qty: p.maxQty }))
  );
  const [reason, setReason] = useState("");
  const [type, setType] = useState<"dana" | "barang">("barang");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ url: string; description: string; type: 'image' | 'video' }>>([]);

  const handleQtyChange = (index: number, newQty: number) => {
    setSelectedProducts(prev => prev.map((p, i) => i === index ? { ...p, qty: newQty } : p));
  };

  const handleRemoveProduct = (index: number) => {
    setSelectedProducts(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileUpload = async (fileType: 'image' | 'video') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = fileType === 'image' ? 'image/*' : 'video/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // For now, use a placeholder URL. In production, you'd upload to a server
        const url = URL.createObjectURL(file);
        setUploadedFiles(prev => [...prev, { url, description: '', type: fileType }]);
      }
    };
    input.click();
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileDescriptionChange = (index: number, desc: string) => {
    setUploadedFiles(prev => prev.map((f, i) => i === index ? { ...f, description: desc } : f));
  };

  const handleSubmit = async () => {
    if (selectedProducts.length === 0) {
      toast.error("Pilih minimal 1 produk untuk dikembalikan");
      return;
    }
    if (!reason) {
      toast.error("Pilih alasan pengembalian");
      return;
    }
    if (!address?.address) {
      toast.error("Alamat pengiriman diperlukan");
      return;
    }

    setIsSubmitting(true);
    try {
      const lines = selectedProducts.map(p => ({
        product_id: p.product_id,
        product_variant_id: p.product_variant_id,
        qty: p.qty,
      }));

      const photos: ReturnPhoto[] = uploadedFiles.map(f => ({
        url: f.url,
        description: f.description,
      }));

      const payload: CreateReturnRequest = {
        lines,
        photos,
        customer_location_name: address.name || "",
        customer_location_address: address.address || "",
        customer_location_city: address.city || "",
        customer_location_postal_code: address.postalCode || "",
        customer_location_lat: address.lat || 0,
        customer_location_long: address.long || 0,
        retur_type: type,
        retur_reason: reason,
        retur_description: description,
      };

      await createReturn(trxId, payload);
      toast.success("Pengajuan pengembalian terkirim");
      onOpenChange(false);
      onSubmit?.();
    } catch (error) {
      console.error("Failed to submit return request:", error);
      toast.error("Gagal mengirim pengajuan pengembalian");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0">
        <DialogHeader className="border-b border-border px-6 py-5">
          <DialogTitle className="text-xl font-extrabold text-primary">
            Pengembalian Produk
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
          {branchName && (
            <p className="flex items-center gap-2 text-sm font-bold text-foreground">
              <Warehouse className="h-4 w-4" />
              {branchName}
            </p>
          )}

          {warehouseName && (
            <p className="mt-2 text-sm text-muted-foreground">{warehouseName}</p>
          )}

          <p className="mt-4 text-sm font-bold text-foreground">Produk yang Dikembalikan</p>
          <div className="mt-2 space-y-3">
            {selectedProducts.map((product, index) => (
              <div key={`${product.product_id}-${product.product_variant_id}`} className="flex items-center gap-3 rounded-md border border-border bg-muted/50 p-3">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="h-full w-full object-contain p-1" loading="lazy" />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-foreground">{product.name}</p>
                  {product.variant ? <p className="text-xs text-muted-foreground">{product.variant}</p> : null}
                </div>
                <QuantityStepper value={product.qty} onChange={(v) => handleQtyChange(index, v)} min={1} max={product.maxQty} />
                <button
                  type="button"
                  onClick={() => handleRemoveProduct(index)}
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between gap-3">
            <span className="text-sm font-bold text-foreground">Alasan</span>
            <div className="flex items-center gap-1">
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="bg-transparent text-right text-sm text-muted-foreground focus:outline-none"
              >
                <option value="">Pilih alasan</option>
                {REASONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <p className="mt-5 text-sm font-bold text-foreground">Pilih Tipe Pengembalian</p>
          <div className="mt-2 grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setType("dana")}
              className={`rounded-lg border-2 px-5 py-3 text-base font-bold ${
                type === "dana"
                  ? "border-primary bg-primary/20 text-primary"
                  : "border-primary text-primary hover:bg-primary/5"
              }`}
            >
              Refund (Dana)
            </button>
            <button
              type="button"
              onClick={() => setType("barang")}
              className={`rounded-lg border-2 px-5 py-3 text-base font-bold ${
                type === "barang"
                  ? "border-primary bg-primary/20 text-primary"
                  : "border-primary text-primary hover:bg-primary/5"
              }`}
            >
              Retur Barang
            </button>
          </div>

          <div className="mt-5">
            <p className="text-sm font-bold text-foreground">Alamat Pengiriman</p>
            <div className="mt-1 text-sm text-muted-foreground">
              <p>
                {address?.name ?? "-"}
                {address?.phone ? ` (${address.phone})` : ""}
              </p>
              <p>{address?.address ?? "-"}</p>
              {address?.city && <p>{address.city}, {address.postalCode}</p>}
            </div>
          </div>

          <p className="mt-5 text-sm font-bold text-foreground">Tambahkan Foto dan Video</p>
          <div className="mt-2 flex gap-4">
            <button type="button" onClick={() => handleFileUpload('image')} className="grid h-20 w-20 place-items-center gap-1 rounded-md bg-muted text-muted-foreground hover:bg-muted/80">
              <Camera className="h-6 w-6" />
              <span className="text-xs font-semibold text-accent">Foto</span>
            </button>
            <button type="button" onClick={() => handleFileUpload('video')} className="grid h-20 w-20 place-items-center gap-1 rounded-md bg-muted text-muted-foreground hover:bg-muted/80">
              <Video className="h-6 w-6" />
              <span className="text-xs font-semibold text-accent">Video</span>
            </button>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="mt-3 space-y-2">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-start gap-2 rounded-md border border-border p-2">
                  {file.type === 'image' ? (
                    <img src={file.url} alt="" className="h-12 w-12 object-cover rounded" />
                  ) : (
                    <video src={file.url} className="h-12 w-12 object-cover rounded" />
                  )}
                  <input
                    type="text"
                    value={file.description}
                    onChange={(e) => handleFileDescriptionChange(index, e.target.value)}
                    placeholder="Deskripsi"
                    className="flex-1 text-sm bg-transparent focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="shrink-0 text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <p className="mt-5 text-sm font-bold text-foreground">Deskripsi (Opsional)</p>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Tulis deskripsi alasan pengembalian"
            className="mt-2 w-full rounded-md bg-muted px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="rounded-md bg-primary px-12 py-3 text-base font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
            >
              {isSubmitting ? "Mengirim..." : "Kirim"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
