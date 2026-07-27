import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { CustomerLocation } from "@/lib/api/customer-location";
import { fetchCustomerLocations } from "@/lib/api/customer-location";

interface CustomerLocationContextValue {
  selectedLocation: CustomerLocation | null;
  setSelectedLocation: (location: CustomerLocation | null) => void;
  clearSelectedLocation: () => void;
  refreshLocations: () => Promise<void>;
  locations: CustomerLocation[];
  isLoading: boolean;
}

const CustomerLocationContext = createContext<CustomerLocationContextValue | null>(null);
const STORAGE_KEY = "bm_selected_customer_location";

export function CustomerLocationProvider({ children }: { children: ReactNode }) {
  const [selectedLocation, setSelectedLocationState] = useState<CustomerLocation | null>(null);
  const [locations, setLocations] = useState<CustomerLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadedFromStorage, setHasLoadedFromStorage] = useState(false);

  // Load selected location from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CustomerLocation;
        setSelectedLocationState(parsed);
      }
    } catch { /* ignore */ }
    setHasLoadedFromStorage(true);
  }, []);

  // Fetch locations and auto-select default
  useEffect(() => {
    if (!hasLoadedFromStorage || typeof window === "undefined") return;

    const loadLocations = async () => {
      setIsLoading(true);
      try {
        const response = await fetchCustomerLocations({ per_page: 999, page: 1 });
        setLocations(response.data);

        // Auto-select default location if no location is selected
        if (!selectedLocation && response.data.length > 0) {
          const defaultLocation = response.data.find((loc) => loc.is_default) || response.data[0];
          setSelectedLocationState(defaultLocation);
        }
      } catch (error) {
        console.error("Error loading customer locations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLocations();
  }, [hasLoadedFromStorage, selectedLocation]);

  // Persist selected location to localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (selectedLocation) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedLocation));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, [selectedLocation]);

  const setSelectedLocation = useCallback((location: CustomerLocation | null) => {
    setSelectedLocationState(location);
  }, []);

  const clearSelectedLocation = useCallback(() => {
    setSelectedLocationState(null);
  }, []);

  const refreshLocations = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetchCustomerLocations({ per_page: 999, page: 1 });
      setLocations(response.data);
      
      // Update selected location if it still exists
      if (selectedLocation) {
        const updated = response.data.find((loc) => loc.id === selectedLocation.id);
        if (updated) {
          setSelectedLocationState(updated);
        } else {
          // If selected location was deleted, select default or first
          const defaultLocation = response.data.find((loc) => loc.is_default) || response.data[0];
          setSelectedLocationState(defaultLocation);
        }
      } else if (response.data.length > 0) {
        // If no location selected, select default or first
        const defaultLocation = response.data.find((loc) => loc.is_default) || response.data[0];
        setSelectedLocationState(defaultLocation);
      }
    } catch (error) {
      console.error("Error refreshing customer locations:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedLocation]);

  const value = useMemo<CustomerLocationContextValue>(() => ({
    selectedLocation,
    setSelectedLocation,
    clearSelectedLocation,
    refreshLocations,
    locations,
    isLoading,
  }), [selectedLocation, setSelectedLocation, clearSelectedLocation, refreshLocations, locations, isLoading]);

  return <CustomerLocationContext.Provider value={value}>{children}</CustomerLocationContext.Provider>;
}

export function useCustomerLocation() {
  const ctx = useContext(CustomerLocationContext);
  if (!ctx) throw new Error("useCustomerLocation must be used inside CustomerLocationProvider");
  return ctx;
}
