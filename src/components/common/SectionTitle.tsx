import type { ReactNode } from "react";

/**
 * Centered section heading used across the homepage
 * ("Kategori Produk", "Material Pilihan", "Mengapa Belanja...", "Blog & Inspirasi").
 */
export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-center text-2xl font-bold text-primary md:text-3xl">{children}</h2>
  );
}
