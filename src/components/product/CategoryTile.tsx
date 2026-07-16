import { Link } from "@tanstack/react-router";
import type { ProductCategory } from "@/lib/api/product-category";
import { getCategoryPhoto } from "@/lib/api/product-category";

export interface Category {
  id: string;
  slug: string;
  label: string;
  image: string;
}

/**
 * Square category tile used in the "Kategori Produk" grid on the home page.
 * Image-only card with a centered label underneath.
 */
export function CategoryTile({ category }: { category: ProductCategory }) {
  return (
    <Link
      to="/produk"
      search={{ category: String(category.id) }}
      className="group flex flex-col items-center gap-2 text-center"
    >
      <div className="grid aspect-square w-full place-items-center overflow-hidden rounded-xl border border-border bg-card p-3 transition-shadow group-hover:shadow-md">
        <img
          src={getCategoryPhoto(category.photo)}
          alt={category.name}
          loading="lazy"
          className="max-h-full w-full object-contain"
        />
      </div>
      <span className="text-xs font-semibold text-primary md:text-sm">{category.name}</span>
    </Link>
  );
}
