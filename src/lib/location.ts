import { getToken } from "./auth";

export interface UserLocation {
  lat: number;
  long: number;
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
