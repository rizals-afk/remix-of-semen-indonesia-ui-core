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
 * Create a custom marker icon with specific color using base64 SVG
 */
export function createCustomMarkerIcon(color: "blue" | "red" | "green" | "orange" = "blue") {
  const colorMap: Record<string, string> = {
    blue: "#3b82f6",
    red: "#ef4444",
    green: "#22c55e",
    orange: "#f97316",
  };

  const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 41" width="25" height="41">
      <path fill="${colorMap[color]}" d="M12.5 0C5.6 0 0 5.6 0 12.5c0 8.7 12.5 28.5 12.5 28.5S25 21.2 25 12.5C25 5.6 19.4 0 12.5 0zm0 17c-2.5 0-4.5-2-4.5-4.5S10 8 12.5 8s4.5 2 4.5 4.5S15 17 12.5 17z"/>
      <path fill="#000" fill-opacity="0.3" d="M12.5 41c0 0 12.5-19.8 12.5-28.5C25 5.6 19.4 0 12.5 0S0 5.6 0 12.5C0 21.2 12.5 41 12.5 41z"/>
    </svg>
  `;

  const svgShadow = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 41 41" width="41" height="41">
      <ellipse cx="20.5" cy="34" rx="10" ry="5" fill="#000" fill-opacity="0.3"/>
    </svg>
  `;

  const svgToBase64 = (svg: string) => {
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

  return L.icon({
    iconUrl: svgToBase64(svgIcon),
    shadowUrl: svgToBase64(svgShadow),
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
}
