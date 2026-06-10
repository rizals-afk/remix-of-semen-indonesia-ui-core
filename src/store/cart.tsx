import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { DEMO_CART, type CartProduct } from "@/data/shopping";

interface CartContextValue {
  items: CartProduct[];
  selectedIds: Set<string>;
  totalQty: number;
  totalSelected: number;
  subTotal: number;
  addItem: (item: CartProduct) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  toggleSelect: (id: string) => void;
  toggleSelectAll: (select: boolean) => void;
  clearSelected: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "bm_cart_v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartProduct[]>(DEMO_CART);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set(DEMO_CART.map((i) => i.id)));

  // hydrate from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { items: CartProduct[]; selected: string[] };
        if (parsed.items) setItems(parsed.items);
        if (parsed.selected) setSelectedIds(new Set(parsed.selected));
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ items, selected: Array.from(selectedIds) }));
  }, [items, selectedIds]);

  const addItem = useCallback((item: CartProduct) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.id === item.id);
      if (existing) {
        return prev.map((p) => (p.id === item.id ? { ...p, qty: p.qty + item.qty } : p));
      }
      return [...prev, item];
    });
    setSelectedIds((s) => new Set(s).add(item.id));
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
    setSelectedIds((s) => { const n = new Set(s); n.delete(id); return n; });
  }, []);

  const updateQty = useCallback((id: string, qty: number) => {
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, qty: Math.max(1, qty) } : p)));
  }, []);

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }, []);

  const toggleSelectAll = useCallback((select: boolean) => {
    setSelectedIds(select ? new Set(items.map((i) => i.id)) : new Set());
  }, [items]);

  const clearSelected = useCallback(() => {
    setItems((prev) => prev.filter((p) => !selectedIds.has(p.id)));
    setSelectedIds(new Set());
  }, [selectedIds]);

  const value = useMemo<CartContextValue>(() => {
    const selectedItems = items.filter((i) => selectedIds.has(i.id));
    return {
      items,
      selectedIds,
      totalQty: items.reduce((s, i) => s + i.qty, 0),
      totalSelected: selectedItems.length,
      subTotal: selectedItems.reduce((s, i) => s + i.qty * i.price, 0),
      addItem, removeItem, updateQty, toggleSelect, toggleSelectAll, clearSelected,
    };
  }, [items, selectedIds, addItem, removeItem, updateQty, toggleSelect, toggleSelectAll, clearSelected]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
