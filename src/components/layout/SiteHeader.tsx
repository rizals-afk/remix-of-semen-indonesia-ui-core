import { Link } from "@tanstack/react-router";
import { Bell, Heart, MapPin, MessageSquare, ShoppingCart, User } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { SearchBar } from "@/components/search/SearchBar";

interface SiteHeaderProps {
  /** When provided, header renders the signed-in icon set (notifications + wishlist + cart + user). */
  user?: { name: string } | null;
  /** Shipping address shown in the right-hand "Kirim ke" slot. */
  shipTo?: string;
}

const NAV_ITEMS = [
  { label: "Kategori", to: "/kategori" },
  { label: "Promo Spesial", to: "/promo" },
  { label: "Gudang Terdekat", to: "/gudang" },
  { label: "Blog & Inspirasi", to: "/blog" },
] as const;

/**
 * Site header used on every page.
 * Top row: logo, search bar, action icons, sign-in CTAs (or user name when logged in).
 * Bottom row: primary nav links + "Kirim ke" location.
 */
export function SiteHeader({ user = null, shipTo = "Jl. Veteran, Gresik" }: SiteHeaderProps) {
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
              <IconButton label="Keranjang" to="/keranjang">
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
              <IconButton label="Keranjang" to="/keranjang">
                <ShoppingCart className="h-5 w-5" />
              </IconButton>
              <IconButton label="Notifikasi" to="/notifikasi">
                <Bell className="h-5 w-5" />
              </IconButton>
              <IconButton label="Pesan" to="/pesan">
                <MessageSquare className="h-5 w-5" />
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
        <div className="container mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2.5">
          <nav aria-label="Utama" className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-sm font-medium text-foreground transition-colors hover:text-primary"
                activeProps={{ className: "text-primary" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2 text-sm text-foreground">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Kirim ke:</span>
            <span className="font-medium">{shipTo}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

function IconButton({
  children,
  label,
  to,
}: {
  children: React.ReactNode;
  label: string;
  to: string;
}) {
  return (
    <Link
      to={to}
      aria-label={label}
      className="grid h-9 w-9 place-items-center rounded-md text-foreground transition-colors hover:bg-muted hover:text-primary"
    >
      {children}
    </Link>
  );
}
