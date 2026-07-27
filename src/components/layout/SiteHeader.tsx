import { Link } from "@tanstack/react-router";
import { Bell, Building2, Heart, MapPin, MessageSquare, ShoppingCart, User } from "lucide-react";
import { useState } from "react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { SearchBar } from "@/components/search/SearchBar";
import { useCart } from "@/store/cart";
import { useWarehouse } from "@/store/warehouse";
import { useCustomerLocation } from "@/store/customer-location";
import { useUser } from "@/store/user";
import { WarehouseSelectorModal } from "@/components/warehouse/WarehouseSelectorModal";

/**
 * Site header used on every page.
 * Top row: logo, search bar, action icons, sign-in CTAs (or user name when logged in).
 * Bottom row: shipping location only.
 */
export function SiteHeader() {
  const { user } = useUser();
  const cart = useCart();
  const cartBadge = cart.totalQty > 0 ? cart.totalQty : undefined;
  
  // Warehouse selector state
  const { selectedWarehouse, setSelectedWarehouse } = useWarehouse();
  const [isWarehouseModalOpen, setIsWarehouseModalOpen] = useState(false);
  const userLocation = "Jl. Veteran, Kebomas Gresik";
  
  // Customer location state
  const { selectedLocation } = useCustomerLocation();
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background">
      <div className="container mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 lg:flex-row lg:items-center lg:gap-6 lg:py-4">
        <BrandLogo className="shrink-0" />

        <div className="flex-1">
          <SearchBar />
        </div>

        <div className="flex items-center justify-between gap-3 lg:justify-end">
          {user ? (
            <nav aria-label="Akun" className="flex items-center gap-4">
              <IconButton label="Notifikasi" to="/notifikasi">
                <Bell className="h-5 w-5" />
              </IconButton>
              <IconButton label="Wishlist" to="/wishlist">
                <Heart className="h-5 w-5" />
              </IconButton>
              <IconButton label="Keranjang" to="/keranjang" badge={cartBadge}>
                <ShoppingCart className="h-5 w-5" />
              </IconButton>
              <div className="hidden h-6 w-px bg-border lg:block" />
              <Link
                to="/akun"
                className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary"
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-muted text-muted-foreground">
                  <User className="h-4 w-4" />
                </span>
                <span className="hidden sm:inline">{user.name}</span>
              </Link>
            </nav>
          ) : (
            <nav aria-label="Akun" className="flex items-center gap-4">
              <IconButton label="Keranjang" to="/keranjang" badge={cartBadge}>
                <ShoppingCart className="h-5 w-5" />
              </IconButton>
              <IconButton label="Notifikasi" to="/notifikasi">
                <Bell className="h-5 w-5" />
              </IconButton>
              <div className="hidden h-6 w-px bg-border lg:block" />
              <Link
                to="/masuk"
                className="text-sm font-semibold text-foreground hover:text-primary"
              >
                Sign In
              </Link>
              <Link
                to="/daftar"
                className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Sign Up
              </Link>
            </nav>
          )}
        </div>
      </div>

      <div className="border-t border-border/60 bg-background">
        <div className="container mx-auto max-w-7xl px-4 py-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 text-sm text-foreground">
            {/* Shipping Address */}
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Kirim ke:</span>
              <span className="font-medium">{selectedLocation?.name || "Pilih Alamat"}</span>
            </div>
            
            {/* Warehouse Selector */}
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Gudang Terdekat:</span>
              <button
                onClick={() => setIsWarehouseModalOpen(true)}
                className="font-medium text-primary hover:text-primary/80 transition-colors cursor-pointer"
              >
                {selectedWarehouse?.name || "Pilih Gudang"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Warehouse Selector Modal */}
      <WarehouseSelectorModal
        open={isWarehouseModalOpen}
        onOpenChange={setIsWarehouseModalOpen}
        selectedWarehouse={selectedWarehouse}
        onSelectWarehouse={setSelectedWarehouse}
        userLocation={userLocation}
      />
    </header>
  );
}

function IconButton({
  children,
  label,
  to,
  badge,
}: {
  children: React.ReactNode;
  label: string;
  to: string;
  badge?: number;
}) {
  return (
    <Link
      to={to}
      aria-label={label}
      className="relative grid h-9 w-9 place-items-center rounded-md text-foreground transition-colors hover:bg-muted hover:text-primary"
    >
      {children}
      {badge ? (
        <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold leading-none text-accent-foreground">
          {badge > 99 ? "99+" : badge}
        </span>
      ) : null}
    </Link>
  );
}
