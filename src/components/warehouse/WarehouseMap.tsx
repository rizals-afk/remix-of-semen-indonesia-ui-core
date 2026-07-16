import { useEffect, useState } from "react";

interface WarehouseMapProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Client-only wrapper for Leaflet map components.
 * Prevents SSR issues by only rendering children after client-side hydration.
 */
export function WarehouseMap({ children, fallback }: WarehouseMapProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return fallback || (
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

  return <>{children}</>;
}
