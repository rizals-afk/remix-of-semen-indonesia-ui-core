import { useState } from "react";

interface ProductGalleryProps {
  images: string[];
  alt: string;
  /** Optional ribbon badge text shown over the main image (e.g. "40Kg & 50Kg"). */
  ribbon?: string;
}

/** Main image + thumbnail strip used on the product detail page. */
export function ProductGallery({ images, alt, ribbon }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const main = images[active] ?? images[0];
  return (
    <div className="space-y-3">
      <div className="relative aspect-square overflow-hidden rounded-xl border border-border bg-card">
        <img
          src={main}
          alt={alt}
          className="h-full w-full object-contain p-6"
        />
        {ribbon ? (
          <div className="absolute bottom-0 left-0 right-0 flex h-14 items-center justify-between bg-gradient-to-r from-accent via-accent to-primary px-5 text-sm font-bold text-white">
            <span className="uppercase tracking-wide">{alt}</span>
            <span className="rounded-md bg-white/15 px-2.5 py-1 text-xs">{ribbon}</span>
          </div>
        ) : null}
      </div>
      {images.length > 1 ? (
        <div className="flex gap-2">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActive(i)}
              className={
                "h-16 w-16 shrink-0 overflow-hidden rounded-md border bg-card transition-colors " +
                (i === active ? "border-primary" : "border-border hover:border-primary/40")
              }
              aria-label={`Lihat gambar ${i + 1}`}
            >
              <img src={src} alt="" className="h-full w-full object-contain p-1" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
