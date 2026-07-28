import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { formatRupiah } from "@/lib/format";
import type { CategoryNode } from "@/lib/api/product-category";

export interface FilterCategory {
  id: string;
  name: string;
  parent_id: string | null;
}

interface FilterSidebarProps {
  categories: CategoryNode[];
  selected: string[];
  onToggleCategory: (id: string) => void;
  priceMin: number;
  priceMax: number;
  onPriceMinChange: (n: number) => void;
  onPriceMaxChange: (n: number) => void;
  onApply: () => void;
  expandedCategories?: Set<string>;
  onToggleExpand?: (id: string) => void;
}

/** Listing sidebar with category accordion + price range, matching "Cari Produk" screen. */
export function FilterSidebar({
  categories,
  selected,
  onToggleCategory,
  priceMin,
  priceMax,
  onPriceMinChange,
  onPriceMaxChange,
  onApply,
  expandedCategories = new Set<string>(),
  onToggleExpand = () => {},
}: FilterSidebarProps) {
  const [open, setOpen] = useState(true);
  return (
    <aside className="rounded-xl border border-border bg-card p-5">
      <h2 className="text-lg font-bold text-foreground">Filter</h2>
      <div className="mt-4">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between text-base font-semibold text-foreground"
        >
          Kategori
          <ChevronDown className={`h-4 w-4 transition-transform ${open ? "" : "-rotate-90"}`} />
        </button>
        {open ? (
          <ul className="mt-3 space-y-2">
            {categories.map((category) => (
              <CategoryItem
                key={category.id}
                category={category}
                selected={selected}
                onToggleCategory={onToggleCategory}
                expandedCategories={expandedCategories}
                onToggleExpand={onToggleExpand}
                level={0}
              />
            ))}
          </ul>
        ) : null}
      </div>
      <div className="mt-6 border-t border-border pt-4">
        <h3 className="text-base font-semibold text-foreground">Rentang Harga</h3>
        <div className="mt-3 space-y-3">
          <PriceField label="Min" value={priceMin} onChange={onPriceMinChange} />
          <PriceField label="Max" value={priceMax} onChange={onPriceMaxChange} />
          <button
            type="button"
            onClick={onApply}
            className="w-full rounded-md bg-muted py-2.5 text-sm font-semibold text-foreground hover:bg-muted/70"
          >
            Terapkan
          </button>
        </div>
      </div>
    </aside>
  );
}

interface CategoryItemProps {
  category: CategoryNode;
  selected: string[];
  onToggleCategory: (id: string) => void;
  expandedCategories: Set<string>;
  onToggleExpand: (id: string) => void;
  level: number;
}

function CategoryItem({
  category,
  selected,
  onToggleCategory,
  expandedCategories,
  onToggleExpand,
  level,
}: CategoryItemProps) {
  const isExpanded = expandedCategories.has(category.id);
  const hasChildren = category.children.length > 0;
  const isChild = category.parent_id !== null;
  const isSelected = selected.includes(category.id);

  return (
    <li>
      <div
        className={`flex items-center justify-between rounded-md py-1.5 text-sm text-foreground/90 hover:text-primary ${
          level > 0 ? "ml-4" : ""
        }`}
      >
        <span className="flex items-center gap-2">
          {hasChildren ? (
            <button
              type="button"
              onClick={() => onToggleExpand(category.id)}
              className="flex items-center gap-2 font-semibold"
            >
              <ChevronDown
                className={`h-4 w-4 transition-transform ${isExpanded ? "" : "-rotate-90"}`}
              />
              {/* <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggleCategory(category.id)}
                className="h-4 w-4 accent-primary"
                onClick={(e) => e.stopPropagation()}
              /> */}
              {category.name}
            </button>
          ) : (
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggleCategory(category.id)}
                className="h-4 w-4 accent-primary"
              />
              {category.name}
            </label>
          )}
        </span>
      </div>
      {hasChildren && isExpanded && (
        <ul className="mt-1 space-y-1">
          {category.children.map((child) => (
            <CategoryItem
              key={child.id}
              category={child}
              selected={selected}
              onToggleCategory={onToggleCategory}
              expandedCategories={expandedCategories}
              onToggleExpand={onToggleExpand}
              level={level + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

function PriceField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <label className="block rounded-md border border-border px-3 py-2">
      <span className="block text-xs text-muted-foreground">{label}</span>
      <input
        inputMode="numeric"
        value={formatRupiah(value)}
        onChange={(e) => onChange(Number(e.target.value.replace(/\D/g, "")) || 0)}
        className="w-full bg-transparent text-sm font-medium text-foreground focus:outline-none"
      />
    </label>
  );
}
