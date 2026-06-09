import { MapPin, Star } from "lucide-react";
import { formatRupiah } from "@/lib/format";

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  image: string;
  warehouse: string;
  rating?: number;
}

interface ProductCardProps {
  product: Product;
  /** Compact variant used in carousels/related products (smaller padding, rating chip). */
  compact?: boolean;
}

/**
 * Reusable product tile.
 * - Default variant matches "Material Pilihan" cards on the home page.
 * - Compact variant matches "Produk Terkait" and listing-grid cards.
 */
export function ProductCard({ product, compact = false }: ProductCardProps) {
  const { name, price, originalPrice, discountPercent, image, warehouse, rating } = product;
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md">
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={image}
          alt={name}
          loading="lazy"
          className="h-full w-full object-contain p-3 transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className={`flex flex-1 flex-col gap-1.5 ${compact ? "p-3" : "p-4"}`}>
        <h3 className="line-clamp-2 text-sm font-semibold text-foreground">{name}</h3>

        {discountPercent ? (
          <div className="flex items-center gap-2">
            <span className="rounded bg-accent-soft px-1.5 py-0.5 text-xs font-semibold text-accent">
              DISKON {discountPercent}%
            </span>
          </div>
        ) : null}

        <div className="flex items-baseline gap-2">
          <span className="text-base font-bold text-accent">{formatRupiah(price)}</span>
          {originalPrice ? (
            <span className="text-xs text-muted-foreground line-through">
              {formatRupiah(originalPrice)}
            </span>
          ) : null}
        </div>

        {rating ? (
          <div className="flex w-fit items-center gap-1 rounded bg-rating/30 px-1.5 py-0.5 text-xs font-semibold text-foreground">
            <Star className="h-3 w-3 fill-rating text-rating" />
            {rating.toFixed(1)}
          </div>
        ) : null}

        <div className="mt-auto flex items-center gap-1 pt-1 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          <span>{warehouse}</span>
        </div>
      </div>
    </article>
  );
}
