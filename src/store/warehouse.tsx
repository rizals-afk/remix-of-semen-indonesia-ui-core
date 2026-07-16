import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Warehouse } from "@/lib/api/warehouse";

interface WarehouseContextValue {
  selectedWarehouse: Warehouse | null;
  setSelectedWarehouse: (warehouse: Warehouse | null) => void;
  clearSelectedWarehouse: () => void;
}

const WarehouseContext = createContext<WarehouseContextValue | null>(null);
const STORAGE_KEY = "bm_selected_warehouse";

export function WarehouseProvider({ children }: { children: ReactNode }) {
  const [selectedWarehouse, setSelectedWarehouseState] = useState<Warehouse | null>(null);

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
  }, []);

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
