import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Warehouse } from "@/lib/api/warehouse";
import { fetchWarehouses } from "@/lib/api/warehouse";

interface WarehouseContextValue {
  selectedWarehouse: Warehouse | null;
  setSelectedWarehouse: (warehouse: Warehouse | null) => void;
  clearSelectedWarehouse: () => void;
}

const WarehouseContext = createContext<WarehouseContextValue | null>(null);
const STORAGE_KEY = "bm_selected_warehouse";

export function WarehouseProvider({ children }: { children: ReactNode }) {
  const [selectedWarehouse, setSelectedWarehouseState] = useState<Warehouse | null>(null);
  const [hasLoadedFromStorage, setHasLoadedFromStorage] = useState(false);

  // Load selected warehouse from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Warehouse;
        setSelectedWarehouseState(parsed);
      }
    } catch { /* ignore */ }
    setHasLoadedFromStorage(true);
  }, []);

  // Auto-select default warehouse if no warehouse is selected after loading from storage
  useEffect(() => {
    if (!hasLoadedFromStorage || selectedWarehouse || typeof window === "undefined") return;

    const loadDefaultWarehouse = async () => {
      try {
        const response = await fetchWarehouses({ per_page: 999, page: 1, is_default: true });
        if (response.data && response.data.length > 0) {
          const defaultWarehouse = response.data[0];
          setSelectedWarehouseState(defaultWarehouse);
        }
      } catch (error) {
        console.error("Error loading default warehouse:", error);
      }
    };

    loadDefaultWarehouse();
  }, [hasLoadedFromStorage, selectedWarehouse]);

  // Persist selected warehouse to localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (selectedWarehouse) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedWarehouse));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, [selectedWarehouse]);

  const setSelectedWarehouse = useCallback((warehouse: Warehouse | null) => {
    setSelectedWarehouseState(warehouse);
  }, []);

  const clearSelectedWarehouse = useCallback(() => {
    setSelectedWarehouseState(null);
  }, []);

  const value = useMemo<WarehouseContextValue>(() => ({
    selectedWarehouse,
    setSelectedWarehouse,
    clearSelectedWarehouse,
  }), [selectedWarehouse, setSelectedWarehouse, clearSelectedWarehouse]);

  return <WarehouseContext.Provider value={value}>{children}</WarehouseContext.Provider>;
}

export function useWarehouse() {
  const ctx = useContext(WarehouseContext);
  if (!ctx) throw new Error("useWarehouse must be used inside WarehouseProvider");
  return ctx;
}
