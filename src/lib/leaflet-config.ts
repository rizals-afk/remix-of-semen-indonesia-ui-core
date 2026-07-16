import L from "leaflet";

/**
 * Configure Leaflet default marker icons to work with Vite.
 * This fixes the broken marker icon issue in production builds.
 */
export function configureLeafletIcons() {
  // Use CDN URLs for marker icons that work in both dev and production
  delete (L.Icon.Default.prototype as any)._getIconUrl;

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });
}

/**
 * Create a custom marker icon with specific color
 */
export function createCustomMarkerIcon(color: "blue" | "red" | "green" | "orange" = "blue") {
  const colorMap = {
    blue: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/markers-default/blue-icon.png",
    red: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/markers-default/red-icon.png",
    green: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/markers-default/green-icon.png",
    orange: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/markers-default/orange-icon.png",
  };

  return L.icon({
    iconUrl: colorMap[color],
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
}
