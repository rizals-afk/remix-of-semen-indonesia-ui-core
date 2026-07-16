import { lazy, Suspense, useEffect, useState } from "react";
import type { Warehouse } from "@/lib/api/warehouse";

// Dynamic import to prevent SSR issues
const LeafletMap = lazy(() => import("./LeafletMap").then(module => ({ default: module.LeafletMap })));

interface WarehouseMapProps {
  warehouses: Warehouse[];
  selectedWarehouse: Warehouse | null;
  highlightedWarehouseId: string | null;
  onWarehouseSelect: (warehouse: Warehouse) => void;
  onWarehouseHighlight: (id: string) => void;
}

/**
 * Client-only wrapper for Leaflet map components.
 * Prevents SSR issues by only rendering children after client-side hydration.
 */
export function WarehouseMap({ 
  warehouses, 
  selectedWarehouse, 
  highlightedWarehouseId, 
  onWarehouseSelect, 
  onWarehouseHighlight 
}: WarehouseMapProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="h-48 bg-blue-50 flex items-center justify-center rounded-t-2xl">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-8 w-8 bg-blue-200 rounded-full mx-auto mb-2" />
            <div className="h-4 bg-blue-200 rounded w-32 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="h-48 bg-blue-50 flex items-center justify-center rounded-t-2xl">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-8 w-8 bg-blue-200 rounded-full mx-auto mb-2" />
            <div className="h-4 bg-blue-200 rounded w-32 mx-auto" />
          </div>
        </div>
      </div>
    }>
      <LeafletMap
        warehouses={warehouses}
        selectedWarehouse={selectedWarehouse}
        highlightedWarehouseId={highlightedWarehouseId}
        onWarehouseSelect={onWarehouseSelect}
        onWarehouseHighlight={onWarehouseHighlight}
      />
    </Suspense>
  );
}
