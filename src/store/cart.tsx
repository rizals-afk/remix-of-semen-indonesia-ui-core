import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { type CartProduct } from "@/data/shopping";
import { fetchCart, addToCart, fetchCartCount, type CartItem } from "@/lib/api/cart";
import { getToken } from "@/lib/auth";

export interface CartWarehouseGroup {
  warehouse: string;
  items: CartProduct[];
  selectedItems: CartProduct[];
  subTotal: number;
  tonase: number;
  allSelected: boolean;
  anySelected: boolean;
}

interface CartContextValue {
  items: CartProduct[];
  selectedIds: Set<string>;
  groups: CartWarehouseGroup[];
  selectedGroups: CartWarehouseGroup[];
  totalQty: number;
  totalSelected: number;
  subTotal: number;
  totalTonase: number;
  cartCount: number;
  addItem: (item: CartProduct, productId?: number, variantId?: number, branchId?: number) => Promise<void>;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  toggleSelect: (id: string) => void;
  toggleSelectAll: (select: boolean) => void;
  toggleSelectGroup: (warehouse: string, select: boolean) => void;
  clearSelected: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "bm_cart_v2";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartProduct[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [cartCount, setCartCount] = useState<number>(0);
  const [hasLoadedFromStorage, setHasLoadedFromStorage] = useState(false);

  // Transform API cart item to CartProduct format
  const transformApiItemToCartProduct = (item: CartItem): CartProduct => {
    const image =
      (item.product_variant.media && item.product_variant.media[0]?.url) ||
      item.product_variant.photo ||
      item.product.photo ||
      "";

    return {
      id: String(item.id),
      name: item.product.name,
      price: item.price,
      qty: item.qty,
      warehouse: item.branch.name,
      image,
      weightKg: parseFloat(item.product_variant.weight) || 0,
      unit: "Sak", // Default unit
      variant: item.product_variant.variant_name,
    };
  };

  // Load cart from localStorage
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
    setHasLoadedFromStorage(true);
  }, []);

  // Load cart from API when user is authenticated
  useEffect(() => {
    if (!hasLoadedFromStorage) return;

    const loadCartFromApi = async () => {
      const token = getToken();
      if (!token) return;

      try {
        const response = await fetchCart({ page: 1, per_page: 100 });
        const cartItems = response.data.map(transformApiItemToCartProduct);
        setItems(cartItems);
        setSelectedIds(new Set(cartItems.map((i) => i.id)));
      } catch (error) {
        console.error("Failed to load cart from API:", error);
        // Set empty cart if API fails
        setItems([]);
        setSelectedIds(new Set());
      }
    };

    loadCartFromApi();
  }, [hasLoadedFromStorage]);

  // Load cart count from API
  useEffect(() => {
    const loadCartCount = async () => {
      const token = getToken();
      if (!token) return;

      try {
        const response = await fetchCartCount();
        setCartCount(response.count);
      } catch (error) {
        console.error("Failed to load cart count from API:", error);
      }
    };

    loadCartCount();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ items, selected: Array.from(selectedIds) }));
  }, [items, selectedIds]);

  const addItem = useCallback(async (item: CartProduct, productId?: number, variantId?: number, branchId?: number) => {
    // Update local state immediately for responsiveness
    setItems((prev) => {
      const existing = prev.find((p) => p.id === item.id);
      if (existing) return prev.map((p) => (p.id === item.id ? { ...p, qty: p.qty + item.qty } : p));
      return [...prev, item];
    });
    setSelectedIds((s) => new Set(s).add(item.id));

    // Call API if user is authenticated and required params are provided
    const token = getToken();
    if (token && productId && variantId) {
      try {
        await addToCart({
          product_id: productId,
          product_variant_id: variantId,
          branch_id: branchId,
          qty: item.qty,
        });
      } catch (error) {
        console.error("Failed to add item to cart via API:", error);
      }
    }
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

  const toggleSelectGroup = useCallback((warehouse: string, select: boolean) => {
    setSelectedIds((s) => {
      const n = new Set(s);
      items.filter((i) => i.warehouse === warehouse).forEach((i) => {
        if (select) n.add(i.id);
        else n.delete(i.id);
      });
      return n;
    });
  }, [items]);

  const clearSelected = useCallback(() => {
    setItems((prev) => prev.filter((p) => !selectedIds.has(p.id)));
    setSelectedIds(new Set());
  }, [selectedIds]);

  const value = useMemo<CartContextValue>(() => {
    const byWarehouse = new Map<string, CartProduct[]>();
    items.forEach((it) => {
      const arr = byWarehouse.get(it.warehouse) ?? [];
      arr.push(it);
      byWarehouse.set(it.warehouse, arr);
    });
    const groups: CartWarehouseGroup[] = Array.from(byWarehouse.entries()).map(([warehouse, list]) => {
      const selected = list.filter((i) => selectedIds.has(i.id));
      return {
        warehouse,
        items: list,
        selectedItems: selected,
        subTotal: selected.reduce((s, i) => s + i.qty * i.price, 0),
        tonase: selected.reduce((s, i) => s + (i.weightKg ?? 0) * i.qty, 0) / 1000,
        allSelected: list.length > 0 && selected.length === list.length,
        anySelected: selected.length > 0,
      };
    });
    const selectedGroups = groups.filter((g) => g.anySelected);
    const selectedItems = items.filter((i) => selectedIds.has(i.id));
    return {
      items,
      selectedIds,
      groups,
      selectedGroups,
      totalQty: items.reduce((s, i) => s + i.qty, 0),
      totalSelected: selectedItems.length,
      subTotal: selectedItems.reduce((s, i) => s + i.qty * i.price, 0),
      totalTonase: selectedItems.reduce((s, i) => s + (i.weightKg ?? 0) * i.qty, 0) / 1000,
      cartCount,
      addItem, removeItem, updateQty, toggleSelect, toggleSelectAll, toggleSelectGroup, clearSelected,
    };
  }, [items, selectedIds, addItem, removeItem, updateQty, toggleSelect, toggleSelectAll, toggleSelectGroup, clearSelected]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
