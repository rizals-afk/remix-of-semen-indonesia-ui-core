import { Link, useRouterState } from "@tanstack/react-router";
import { User, ClipboardList, Heart, MapPin, Bell, LogOut } from "lucide-react";
import type { ComponentType } from "react";

interface MenuItem {
  to: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  match?: string;
}

const MENU: MenuItem[] = [
  { to: "/akun", label: "Profil Saya", icon: User },
  { to: "/akun/transaksi", label: "Riwayat Transaksi", icon: ClipboardList, match: "/akun/transaksi" },
  { to: "/wishlist", label: "Wishlist", icon: Heart },
  { to: "/checkout/alamat", label: "Daftar Alamat", icon: MapPin },
  { to: "/notifikasi", label: "Notifikasi", icon: Bell },
];

export function AccountSidebar({ user }: { user: { name: string; email: string } }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <aside className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-primary-soft text-primary">
          <User className="h-6 w-6" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-foreground">{user.name}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        </div>
      </div>
      <nav className="mt-4 flex flex-col gap-1">
        {MENU.map((item) => {
          const active = item.match
            ? pathname === item.match || pathname.startsWith(item.match + "/")
            : pathname === item.to;
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition-colors " +
                (active ? "bg-primary-soft text-primary" : "text-foreground hover:bg-muted")
              }
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
        <button
          type="button"
          className="mt-2 flex items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4" />
          Keluar
        </button>
      </nav>
    </aside>
  );
}
