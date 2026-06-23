import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  User, Lock, MapPin, ClipboardList, Users, Bell, Clock, Heart,
  Bookmark, Gem, Ticket, Coins, Pencil, LogOut,
} from "lucide-react";
import { useState, type ComponentType } from "react";
import { LogoutDialog } from "@/components/auth/LogoutDialog";

interface MenuItem {
  to: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  match?: string;
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

const GROUPS: MenuGroup[] = [
  {
    title: "Kelola Akun",
    items: [
      { to: "/akun", label: "Profil Pengguna", icon: User },
      { to: "/akun/ubah-password", label: "Ubah Password", icon: Lock },
      { to: "/checkout/alamat", label: "Alamat Pengiriman", icon: MapPin },
    ],
  },
  {
    title: "Daftar Pesanan",
    items: [
      {
        to: "/akun/transaksi",
        label: "Riwayat Pesanan",
        icon: ClipboardList,
        match: "/akun/transaksi",
      },
    ],
  },
  {
    title: "Aktivitas Saya",
    items: [
      { to: "/akun", label: "Affiliate", icon: Users },
      { to: "/notifikasi", label: "Notifikasi", icon: Bell },
      { to: "/akun", label: "Terakhir Dilihat", icon: Clock },
      { to: "/wishlist", label: "Produk Favorit", icon: Heart },
      { to: "/wishlist", label: "Wishlist", icon: Bookmark },
      { to: "/akun", label: "BM-VIP", icon: Gem },
    ],
  },
  {
    title: "Dompet Saya",
    items: [
      { to: "/checkout/voucher", label: "Voucher", icon: Ticket },
      { to: "/akun", label: "Koin", icon: Coins },
    ],
  },
];

export function AccountSidebar({ user }: { user: { name: string; email?: string } }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [logoutOpen, setLogoutOpen] = useState(false);
  return (
    <aside className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-primary-soft text-primary">
          <User className="h-6 w-6" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-foreground">{user.name}</p>
          <Link
            to="/akun"
            className="mt-0.5 inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-primary"
          >
            <Pencil className="h-3 w-3" /> Ubah Profil
          </Link>
        </div>
      </div>

      <nav className="mt-5 space-y-5">
        {GROUPS.map((group) => (
          <div key={group.title}>
            <p className="px-1 text-sm font-bold text-foreground">{group.title}</p>
            <ul className="mt-2 flex flex-col gap-0.5">
              {group.items.map((item) => {
                const active = item.match
                  ? pathname === item.match || pathname.startsWith(item.match + "/")
                  : pathname === item.to;
                const Icon = item.icon;
                return (
                  <li key={group.title + item.label}>
                    <Link
                      to={item.to}
                      className={
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors " +
                        (active
                          ? "font-bold text-primary"
                          : "font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/60")
                      }
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <button
        type="button"
        onClick={() => setLogoutOpen(true)}
        className="mt-6 flex w-full items-center gap-3 rounded-md border border-border px-3 py-2 text-sm font-semibold text-destructive hover:bg-destructive/5"
      >
        <LogOut className="h-4 w-4" />
        Keluar
      </button>

      <LogoutDialog
        open={logoutOpen}
        onOpenChange={setLogoutOpen}
        onConfirm={() => {
          setLogoutOpen(false);
          navigate({ to: "/masuk" });
        }}
      />
    </aside>
  );
}
