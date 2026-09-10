import { useState } from "react";
import { Star, Camera, Video, CircleDollarSign, Check, X, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { apiFetch } from "@/lib/api";
import { createReview } from "@/lib/api/trx";
import { toast } from "sonner";

export interface ReviewProduct {
  name: string;
  variant?: string;
  image?: string;
  trxLineId?: number;
  productId?: number;
  productVariantId?: number;
}

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ReviewProduct;
  coins?: number;
  onSubmit?: () => void | Promise<void>;
}

/** "Penilaian Produk" modal with star rating, media pickers and review text. */
export function ReviewDialog({
  open,
  onOpenChange,
  product,
  coins = 25,
  onSubmit,
}: ReviewDialogProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenChange = (next: boolean) => {
    onOpenChange(next);
    if (!next) {
      setTimeout(() => {
        setSubmitted(false);
        setComment("");
        setRating(5);
        setUploadedFiles([]);
      }, 200);
    }
  };

  const handleFileUpload = async (fileType: 'image' | 'video') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = fileType === 'image' ? 'image/*' : 'video/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setIsUploading(true);
        try {
          const formData = new FormData();
          formData.append('file', file);

          const headers = new Headers();
          headers.set('Accept', 'application/json');
          headers.set('ngrok-skip-browser-warning', 'true');
          const token = localStorage.getItem('bm_auth_token');
          if (token) {
            headers.set('Authorization', `Bearer ${token}`);
          }

          const url = `${import.meta.env.VITE_API_BASE_URL || 'https://freewill-aftermost-elf.ngrok-free.dev/api'}/upload`;
          const res = await fetch(url, {
            method: 'POST',
            headers,
            body: formData,
          });

          if (!res.ok) {
            throw new Error('Upload failed');
          }

          const data = await res.json();
          setUploadedFiles(prev => [...prev, data.url]);
          toast.success('File berhasil diunggah');
        } catch (error) {
          console.error('Upload error:', error);
          toast.error('Gagal mengunggah file');
        } finally {
          setIsUploading(false);
        }
      }
    };
    input.click();
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!product.trxLineId || !product.productId || !product.productVariantId) {
      toast.error('Informasi produk tidak lengkap');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: any = {
        trx_line_id: product.trxLineId,
        rating,
        product_id: product.productId,
        product_variant_id: product.productVariantId,
        review: comment,
      };

      // Only include photos if there are uploaded files
      if (uploadedFiles.length > 0) {
        payload.photos = uploadedFiles;
      }

      await createReview(payload);
      setSubmitted(true);
      toast.success('Penilaian berhasil dikirim');
      await onSubmit?.();
    } catch (error) {
      console.error('Review submission error:', error);
      toast.error('Gagal mengirim penilaian');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0">
        {submitted ? (
          <div className="flex flex-col items-center px-6 py-14">
            <DialogTitle className="sr-only">Penilaian Berhasil</DialogTitle>
            <span className="grid h-28 w-28 place-items-center rounded-full bg-success/15">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-success text-success-foreground">
                <Check className="h-8 w-8" strokeWidth={3} />
              </span>
            </span>
            <p className="mt-7 text-lg font-extrabold text-primary">
              Terima kasih telah memberikan penilaian
            </p>
          </div>
        ) : (
          <>
            <DialogHeader className="border-b border-border px-6 py-5">
              <DialogTitle className="text-xl font-extrabold text-primary">
                Penilaian Produk
              </DialogTitle>
            </DialogHeader>

            <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
              <div className="mt-5 flex items-center gap-4">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-contain p-1"
                      loading="lazy"
                    />
                  ) : null}
                </div>
                <div className="min-w-0">
                  <p className="text-base font-bold text-foreground">{product.name}</p>
                  {product.variant ? (
                    <p className="text-sm text-muted-foreground">{product.variant}</p>
                  ) : null}
                </div>
              </div>

              <div className="mt-6 flex items-center gap-4">
                <span className="text-sm font-bold text-foreground">Kualitas Produk:</span>
                <span className="inline-flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button key={i} type="button" onClick={() => setRating(i + 1)} aria-label={`${i + 1} bintang`}>
                      <Star
                        className={`h-6 w-6 ${i < rating ? "fill-rating text-rating" : "text-muted-foreground/40"}`}
                      />
                    </button>
                  ))}
                </span>
              </div>

              <p className="mt-6 text-sm font-bold text-foreground">Tambahkan foto</p>
              <div className="mt-2 flex gap-4">
                <button
                  type="button"
                  onClick={() => handleFileUpload('image')}
                  disabled={isUploading}
                  className="grid h-20 w-20 place-items-center gap-1 rounded-md bg-muted text-muted-foreground hover:bg-muted/80 disabled:opacity-50"
                >
                  {isUploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Camera className="h-6 w-6" />}
                  <span className="text-xs font-semibold text-accent">Foto</span>
                </button>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="mt-3 space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 rounded-md border border-border p-2">
                      <img src={file} alt="" className="h-12 w-12 object-cover rounded" />
                      <span className="flex-1 truncate text-xs text-muted-foreground">{file}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(index)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <p className="mt-6 text-sm font-bold text-foreground">Tuliskan Ulasan</p>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                placeholder="Bagikan Ulasanmu untuk membantu pembeli lainnya"
                className="mt-2 w-full rounded-md bg-muted px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />

              <div className="mt-6 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => handleOpenChange(false)}
                  className="rounded-md bg-muted px-8 py-3 text-base font-bold text-muted-foreground hover:bg-muted/80"
                >
                  Nanti Saja
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="rounded-md bg-primary px-10 py-3 text-base font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
                >
                  {isSubmitting ? "Mengirim..." : "Kirim"}
                </button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
