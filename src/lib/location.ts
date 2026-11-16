import { getToken } from "./auth";

export interface UserLocation {
  lat: number;
  long: number;
}

/** Great-circle (haversine) distance in kilometers between two lat/long points. */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const earthRadius = 6371;
  const latDiff = ((lat2 - lat1) * Math.PI) / 180;
  const lonDiff = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(latDiff / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(lonDiff / 2) ** 2;
  return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Format a km distance for display, e.g. "850 m" or "12,5 km". */
export function formatDistanceKm(km: number): string {
  if (km < 1) return `${Math.round(km * 1000).toLocaleString("id-ID")} m`;
  return `${km.toLocaleString("id-ID", { maximumFractionDigits: 1 })} km`;
}

const CUSTOMER_LOCATION_STORAGE_KEY = "bm_selected_customer_location";

/**
 * Get user location from customer_location if logged in and selected,
 * otherwise request browser geolocation permission
 */
export async function getUserLocation(): Promise<UserLocation | null> {
  // Try to get from localStorage first (selected customer location)
  if (typeof window !== "undefined") {
    try {
      const token = getToken();
      if (token) {
        const raw = window.localStorage.getItem(CUSTOMER_LOCATION_STORAGE_KEY);
        if (raw) {
          const location = JSON.parse(raw);
          if (location.lat && location.long) {
            return { lat: location.lat, long: location.long };
          }
        }
      }
    } catch (error) {
      console.warn("Failed to read customer location from storage:", error);
    }
  }

  // Fall back to browser geolocation
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.warn("Geolocation is not supported by this browser");
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          long: position.coords.longitude,
        });
      },
      (error) => {
        console.warn("Geolocation permission denied or error:", error);
        resolve(null);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes cache
      }
    );
  });
}
