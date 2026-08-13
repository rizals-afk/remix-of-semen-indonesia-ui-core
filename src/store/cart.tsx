import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { DEMO_CART, type CartProduct } from "@/data/shopping";
import { fetchCart, addToCart, fetchCartCount, updateCartQuantity, deleteCartItem, type CartItem } from "@/lib/api/cart";
import { getToken } from "@/lib/auth";
import { toast } from "sonner";
import { useUser } from "./user";

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
  removeItem: (id: string) => Promise<void>;
  updateQty: (id: string, qty: number) => Promise<void>;
  refreshCart: () => Promise<void>;
  toggleSelect: (id: string) => void;
  toggleSelectAll: (select: boolean) => void;
  toggleSelectGroup: (warehouse: string, select: boolean) => void;
  clearSelected: () => void;
  clearSelections: () => void;
  updatingIds: Set<string>;
  deletingIds: Set<string>;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "bm_cart_v2";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartProduct[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [cartCount, setCartCount] = useState<number>(0);
  const [hasLoadedFromStorage, setHasLoadedFromStorage] = useState(false);
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const { isAuthenticated, user } = useUser();
  const [hasFetchedAfterAuth, setHasFetchedAfterAuth] = useState(false);

  // Transform API cart item to CartProduct format
  const transformApiItemToCartProduct = (item: CartItem): CartProduct => ({
    id: String(item.id),
    name: item.product.name,
    price: item.price,
    qty: item.qty,
    warehouse: item.branch.name,
    image: item.product_variant.media?.[0]?.url || item.product.photo || "",
    weightKg: parseFloat(item.product_variant.weight) || 0,
    unit: "Sak", // Default unit
    variant: item.product_variant.variant_name,
    variant_id: item.product_variant_id,
    branch_id: item.branch_id,
    product_id: item.product_id,
  });

  // Load cart from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { items: CartProduct[]; selected: string[] };
        if (parsed.items) setItems(parsed.items);
      }
      // Always start with empty selection
      setSelectedIds(new Set());
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
        setSelectedIds(new Set()); // Always clear selections on API load
      } catch (error) {
        console.error("Failed to load cart from API:", error);
        // Fall back to demo cart if API fails
        setItems(DEMO_CART);
        setSelectedIds(new Set()); // Always clear selections on API load
      }
    };

    loadCartFromApi();
  }, [hasLoadedFromStorage, isAuthenticated]);

  // Load cart count from API when authentication state changes
  useEffect(() => {
    const loadCartCount = async () => {
      // Only clear cart if user is explicitly logged out (user is null)
      if (!isAuthenticated && !user) {
        setCartCount(0);
        setItems([]);
        setSelectedIds(new Set());
        setHasFetchedAfterAuth(false);
        return;
      }

      // If not authenticated, don't fetch
      if (!isAuthenticated) return;

      // If we already fetched after auth, don't fetch again unless auth state changed
      if (hasFetchedAfterAuth) return;

      // Retry mechanism for token availability
      const retryWithDelay = async (retries = 3, delay = 100): Promise<void> => {
        for (let i = 0; i < retries; i++) {
          const token = getToken();
          if (token) {
            try {
              const response = await fetchCartCount();
              setCartCount(response.count);
              setHasFetchedAfterAuth(true);
              return;
            } catch (error) {
              console.error("Failed to load cart count from API:", error);
            }
          }
          if (i < retries - 1) {
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
        console.warn("Failed to fetch cart count after retries");
      };

      retryWithDelay();
    };

    loadCartCount();
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Always save empty selection to prevent restoring selections on page load
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ items, selected: [] }));
  }, [items]);

  // Refresh cart count from API
  const refreshCartCount = useCallback(async () => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetchCartCount();
      setCartCount(response.count);
    } catch (error) {
      console.error("Failed to refresh cart count:", error);
    }
  }, []);

  const addItem = useCallback(async (item: CartProduct, productId?: number, variantId?: number, branchId?: number) => {
    // Update local state immediately for responsiveness
    setItems((prev) => {
      const existing = prev.find((p) => p.id === item.id);
      if (existing) return prev.map((p) => (p.id === item.id ? { ...p, qty: p.qty + item.qty } : p));
      return [...prev, item];
    });
    // Don't auto-select items when adding to cart
    // setSelectedIds((s) => new Set(s).add(item.id));

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
        // Refresh cart count after successful add
        await refreshCartCount();
      } catch (error) {
        console.error("Failed to add item to cart via API:", error);
      }
    }
  }, [refreshCartCount]);

  const removeItem = useCallback(async (id: string) => {
    const token = getToken();
    const cartId = parseInt(id);
    
    // Optimistically update UI
    setDeletingIds((prev) => new Set(prev).add(id));
    const previousItems = items;
    setItems((prev) => prev.filter((p) => p.id !== id));
    setSelectedIds((s) => { const n = new Set(s); n.delete(id); return n; });

    // Call API if authenticated
    if (token && !isNaN(cartId)) {
      try {
        await deleteCartItem(cartId);
        // Refresh cart count after successful delete
        await refreshCartCount();
      } catch (error) {
        console.error("Failed to delete cart item:", error);
        // Rollback on error
        setItems(previousItems);
        setSelectedIds((s) => new Set(s).add(id));
        toast.error("Failed to remove item from cart. Please try again.");
      } finally {
        setDeletingIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
      }
    } else {
      setDeletingIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
    }
  }, [items, refreshCartCount]);

  const updateQty = useCallback(async (id: string, qty: number) => {
    // Prevent duplicate requests
    if (updatingIds.has(id)) return;
    
    const token = getToken();
    const cartId = parseInt(id);
    const newQty = Math.max(1, qty);
    
    // Optimistically update UI
    setUpdatingIds((prev) => new Set(prev).add(id));
    const previousItems = items;
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, qty: newQty } : p)));

    // Call API if authenticated
    if (token && !isNaN(cartId)) {
      try {
        await updateCartQuantity(cartId, { qty: newQty });
        // Refresh cart count after successful update
        await refreshCartCount();
      } catch (error) {
        console.error("Failed to update cart quantity:", error);
        // Rollback on error
        setItems(previousItems);
        toast.error("Failed to update cart quantity. Please try again.");
      } finally {
        setUpdatingIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
      }
    } else {
      setUpdatingIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
    }
  }, [items, updatingIds, refreshCartCount]);

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

  const clearSelections = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const refreshCart = useCallback(async () => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetchCart({ page: 1, per_page: 100 });
      const cartItems = response.data.map(transformApiItemToCartProduct);
      setItems(cartItems);
      // Clear selections on refresh
      setSelectedIds(new Set());
      // Also refresh cart count
      await refreshCartCount();
    } catch (error) {
      console.error("Failed to refresh cart from API:", error);
    }
  }, [refreshCartCount]);

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
      addItem, removeItem, updateQty, refreshCart, toggleSelect, toggleSelectAll, toggleSelectGroup, clearSelected, clearSelections,
      updatingIds,
      deletingIds,
    };
  }, [items, selectedIds, addItem, removeItem, updateQty, toggleSelect, toggleSelectAll, toggleSelectGroup, clearSelected, clearSelections]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
