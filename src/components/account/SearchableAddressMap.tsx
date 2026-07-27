import { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Search, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Fix default marker icons (Leaflet ships images that Vite doesn't resolve).
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface SearchableAddressMapProps {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number, address?: string) => void;
  height?: string;
}

interface SearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

function ClickHandler({ onChange }: { onChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function Recenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng, map]);
  return null;
}

function MapController({ lat, lng, onLocationSelect }: { lat: number; lng: number; onLocationSelect: (lat: number, lng: number) => void }) {
  const map = useMap();

  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], 16);
    }
  }, [lat, lng, map]);

  return null;
}

export default function SearchableAddressMap({ lat, lng, onChange, height = "260px" }: SearchableAddressMapProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);
  const [skipReverseGeocoding, setSkipReverseGeocoding] = useState(false);
  const [prevLat, setPrevLat] = useState(lat);
  const [prevLng, setPrevLng] = useState(lng);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length < 3) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      setIsSearching(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5&addressdetails=1`
        );
        const data: SearchResult[] = await response.json();
        setSearchResults(data);
        setShowResults(true);
      } catch (error) {
        console.error("Geocoding error:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reverse geocoding when location changes (but not from search result click)
  useEffect(() => {
    // Skip if location changed from search result click
    if (skipReverseGeocoding) {
      setSkipReverseGeocoding(false);
      return;
    }

    // Skip if location hasn't actually changed
    if (lat === prevLat && lng === prevLng) {
      return;
    }

    const performReverseGeocoding = async () => {
      if (!lat || !lng) return;

      setIsReverseGeocoding(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
        );
        const data = await response.json();
        if (data.display_name) {
          onChange(lat, lng, data.display_name);
        }
      } catch (error) {
        console.error("Reverse geocoding error:", error);
        // Don't show error, just keep coordinates
      } finally {
        setIsReverseGeocoding(false);
      }
    };

    performReverseGeocoding();
    setPrevLat(lat);
    setPrevLng(lng);
  }, [lat, lng, prevLat, prevLng, skipReverseGeocoding]);

  const handleSearchResultClick = (result: SearchResult) => {
    const newLat = parseFloat(result.lat);
    const newLng = parseFloat(result.lon);
    
    setSearchQuery(result.display_name);
    setShowResults(false);
    setSkipReverseGeocoding(true); // Skip reverse geocoding for this change
    
    // Update coordinates and address immediately
    onChange(newLat, newLng, result.display_name);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
  };

  const handleMapClick = (newLat: number, newLng: number) => {
    onChange(newLat, newLng);
  };

  const handleMarkerDrag = (newLat: number, newLng: number) => {
    onChange(newLat, newLng);
  };

  return (
    <div className="relative">
      {/* Search Box */}
      <div className="relative mb-2">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari lokasi..."
          className="h-10 pl-10 pr-10"
        />
        {searchQuery && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2"
            onClick={handleClearSearch}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
        {isSearching && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}

        {/* Search Results Dropdown */}
        {showResults && searchResults.length > 0 && (
          <div className="absolute z-[9999] mt-1 w-full rounded-md border border-border bg-background shadow-lg">
            <ul className="max-h-60 overflow-y-auto py-1">
              {searchResults.map((result) => (
                <li
                  key={result.place_id}
                  className="cursor-pointer px-3 py-2 text-sm hover:bg-muted"
                  onClick={() => handleSearchResultClick(result)}
                >
                  <p className="font-medium text-foreground">{result.display_name.split(",")[0]}</p>
                  <p className="text-xs text-muted-foreground truncate">{result.display_name}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Map */}
      <div className="overflow-hidden rounded-md border border-border relative z-0">
        {isReverseGeocoding && (
          <div className="absolute top-2 right-2 z-10 flex items-center gap-2 rounded-md bg-background/90 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur-sm border border-border">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Memuat alamat...</span>
          </div>
        )}
        <MapContainer
          center={[lat, lng]}
          zoom={14}
          scrollWheelZoom={false}
          style={{ height, width: "100%", borderRadius: "0.5rem" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker
            position={[lat, lng]}
            draggable
            eventHandlers={{
              dragend: (e) => {
                const m = e.target as L.Marker;
                const { lat: la, lng: ln } = m.getLatLng();
                handleMarkerDrag(la, ln);
              },
            }}
          />
          <ClickHandler onChange={handleMapClick} />
          <MapController lat={lat} lng={lng} onLocationSelect={handleMapClick} />
        </MapContainer>
      </div>
      
      <p className="mt-1 text-xs text-muted-foreground">
        Klik, geser pin, atau cari lokasi untuk menyesuaikan titik.
      </p>
    </div>
  );
}
