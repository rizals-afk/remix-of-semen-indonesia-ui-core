import { Building2, MapPin, Search, X, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import type { Warehouse as ApiWarehouse } from "@/lib/api/warehouse";
import { fetchWarehouses } from "@/lib/api/warehouse";
import { WarehouseMap } from "./WarehouseMap";

// Re-export the API type for compatibility
export type Warehouse = ApiWarehouse;

interface WarehouseSelectorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedWarehouse: Warehouse | null;
  onSelectWarehouse: (warehouse: Warehouse) => void;
  userLocation: string;
}

export function WarehouseSelectorModal({
  open,
  onOpenChange,
  selectedWarehouse,
  onSelectWarehouse,
  userLocation,
}: WarehouseSelectorModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [filteredWarehouses, setFilteredWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [highlightedWarehouseId, setHighlightedWarehouseId] = useState<string | null>(null);

  // Fetch warehouses on mount
  useEffect(() => {
    if (!open) return;
    
    const loadWarehouses = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchWarehouses({ per_page: 999, page: 1 });
        setWarehouses(response.data);
        setFilteredWarehouses(response.data);
      } catch (err) {
        setError("Gagal memuat data gudang. Silakan coba lagi.");
        console.error("Error fetching warehouses:", err);
      } finally {
        setLoading(false);
      }
    };

    loadWarehouses();
  }, [open]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!open) return;
      
      setLoading(true);
      setError(null);
      try {
        const response = await fetchWarehouses({ 
          search: searchQuery, 
          per_page: 999, 
          page: 1 
        });
        setFilteredWarehouses(response.data);
      } catch (err) {
        setError("Gagal memuat data gudang. Silakan coba lagi.");
        console.error("Error searching warehouses:", err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery, open]);

  const handleSelectWarehouse = (warehouse: Warehouse) => {
    onSelectWarehouse(warehouse);
    onOpenChange(false);
  };

  const handleWarehouseClick = (warehouse: Warehouse) => {
    setHighlightedWarehouseId(warehouse.id);
    handleSelectWarehouse(warehouse);
  };

  const handleRetry = () => {
    const loadWarehouses = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchWarehouses({ per_page: 999, page: 1, search: searchQuery });
        setWarehouses(response.data);
        setFilteredWarehouses(response.data);
      } catch (err) {
        setError("Gagal memuat data gudang. Silakan coba lagi.");
        console.error("Error fetching warehouses:", err);
      } finally {
        setLoading(false);
      }
    };
    loadWarehouses();
  };

  // Filter warehouses with valid coordinates
  const warehousesWithCoords = filteredWarehouses.filter(
    (w) => w.lat !== undefined && w.lat !== null && 
           w.long !== undefined && w.long !== null
  );

  const handleMapWarehouseSelect = (warehouse: Warehouse) => {
    setHighlightedWarehouseId(warehouse.id);
    handleSelectWarehouse(warehouse);
  };

  const handleMapWarehouseHighlight = (id: string) => {
    setHighlightedWarehouseId(id);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity ${
        open ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      onClick={() => onOpenChange(false)}
    >
      <div
        className={`relative w-full max-w-lg bg-white rounded-2xl shadow-2xl transition-all ${
          open ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: "90vh" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-bold text-foreground">Gudang Sekitar</h2>
          <button
            onClick={() => onOpenChange(false)}
            className="grid h-8 w-8 place-items-center rounded-full hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <div className="overflow-y-auto" style={{ maxHeight: "calc(90vh - 73px)" }}>
          {/* Leaflet Map - Client Only */}
          <div className="relative h-48">
            <WarehouseMap
              warehouses={filteredWarehouses}
              selectedWarehouse={selectedWarehouse}
              highlightedWarehouseId={highlightedWarehouseId}
              onWarehouseSelect={handleMapWarehouseSelect}
              onWarehouseHighlight={handleMapWarehouseHighlight}
            />
          </div>

          {/* Current Location Section */}
          <div className="border-b border-border px-6 py-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">Pilih Gudang Terdekat</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Lokasi Anda:</span>
                <span className="text-sm font-medium text-foreground">{userLocation}</span>
              </div>
              <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                Ubah
              </button>
            </div>
          </div>

          {/* Search Field */}
          <div className="px-6 py-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari Lokasi dan Kota"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>
          </div>

          {/* Warehouse List */}
          <div className="px-6 py-4">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 rounded-xl border border-border bg-card">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                        <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                        <div className="h-3 bg-muted rounded animate-pulse w-full" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground mb-3">{error}</p>
                <button
                  onClick={handleRetry}
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  Coba Lagi
                </button>
              </div>
            ) : filteredWarehouses.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">Tidak ada gudang yang ditemukan.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredWarehouses.map((warehouse) => (
                  <WarehouseListItem
                    key={warehouse.id}
                    warehouse={warehouse}
                    isSelected={selectedWarehouse?.id === warehouse.id}
                    isHighlighted={highlightedWarehouseId === warehouse.id}
                    onSelect={() => handleWarehouseClick(warehouse)}
                    onHighlight={() => setHighlightedWarehouseId(warehouse.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface WarehouseListItemProps {
  warehouse: Warehouse;
  isSelected: boolean;
  isHighlighted: boolean;
  onSelect: () => void;
  onHighlight: () => void;
}

function WarehouseListItem({ warehouse, isSelected, isHighlighted, onSelect, onHighlight }: WarehouseListItemProps) {
  return (
    <button
      onClick={onSelect}
      onMouseEnter={onHighlight}
      className={`w-full text-left p-4 rounded-xl border transition-all ${
        isSelected || isHighlighted
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-border bg-card hover:border-primary/50 hover:shadow-sm"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${
            isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          }`}
        >
          <Building2 className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-foreground mb-1">{warehouse.name}</h4>
          <p className="text-xs text-muted-foreground truncate">{warehouse.address}</p>
        </div>
        {isSelected && (
          <div className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary">
            <svg className="h-3 w-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>
    </button>
  );
}
