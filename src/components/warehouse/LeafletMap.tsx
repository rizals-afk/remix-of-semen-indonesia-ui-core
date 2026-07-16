import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import { configureLeafletIcons, createCustomMarkerIcon } from "@/lib/leaflet-config";
import type { Warehouse } from "@/lib/api/warehouse";

interface LeafletMapProps {
  warehouses: Warehouse[];
  selectedWarehouse: Warehouse | null;
  highlightedWarehouseId: string | null;
  onWarehouseSelect: (warehouse: Warehouse) => void;
  onWarehouseHighlight: (id: string) => void;
  center?: [number, number];
  zoom?: number;
}

// Map controller component to handle map centering and zooming
interface MapControllerProps {
  selectedWarehouse: Warehouse | null;
  highlightedWarehouseId: string | null;
  warehouses: Warehouse[];
}

function MapController({ selectedWarehouse, highlightedWarehouseId, warehouses }: MapControllerProps) {
  const map = useMap();

  useEffect(() => {
    const targetWarehouse = selectedWarehouse || 
      (highlightedWarehouseId ? warehouses.find(w => w.id === highlightedWarehouseId) : null);
    
    if (targetWarehouse && targetWarehouse.lat && targetWarehouse.long) {
      map.setView([targetWarehouse.lat, targetWarehouse.long], 15);
    }
  }, [selectedWarehouse, highlightedWarehouseId, warehouses, map]);

  return null;
}

/**
 * Actual Leaflet map implementation with markers.
 * This component is only rendered on the client side.
 */
export function LeafletMap({
  warehouses,
  selectedWarehouse,
  highlightedWarehouseId,
  onWarehouseSelect,
  onWarehouseHighlight,
  center = [-7.2575, 112.7521],
  zoom = 10,
}: LeafletMapProps) {
  // Configure Leaflet icons on mount
  useEffect(() => {
    configureLeafletIcons();
  }, []);

  // Filter warehouses with valid coordinates
  const warehousesWithCoords = warehouses.filter(
    (w) => w.lat !== undefined && w.lat !== null && 
           w.long !== undefined && w.long !== null
  );

  // Custom icons for warehouse markers
  const warehouseIcon = createCustomMarkerIcon("blue");
  const selectedIcon = createCustomMarkerIcon("red");

  if (warehousesWithCoords.length === 0) {
    return (
      <div className="h-full w-full bg-blue-50 flex items-center justify-center rounded-t-2xl">
        <div className="text-center">
          <div className="h-8 w-8 bg-blue-200 rounded-full mx-auto mb-2 flex items-center justify-center">
            <span className="text-blue-500 text-xs">📍</span>
          </div>
          <p className="text-sm text-blue-600 font-medium">Peta Indonesia</p>
          <p className="text-xs text-blue-500">Tidak ada data koordinat gudang</p>
        </div>
      </div>
    );
  }

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: "100%", width: "100%" }}
      className="rounded-t-2xl"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {warehousesWithCoords.map((warehouse) => (
        <Marker
          key={warehouse.id}
          position={[warehouse.lat!, warehouse.long!]}
          icon={
            selectedWarehouse?.id === warehouse.id || highlightedWarehouseId === warehouse.id
              ? selectedIcon
              : warehouseIcon
          }
          eventHandlers={{
            click: () => {
              onWarehouseHighlight(warehouse.id);
              onWarehouseSelect(warehouse);
            },
          }}
        />
      ))}
      <MapController 
        selectedWarehouse={selectedWarehouse} 
        highlightedWarehouseId={highlightedWarehouseId}
        warehouses={warehousesWithCoords}
      />
    </MapContainer>
  );
}
