import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { MainLayout } from "@/components/layout/MainLayout";
import { AccountSidebar } from "@/components/account/AccountSidebar";
import { getCurrentUser } from "@/lib/auth";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/akun")({
  head: () => ({ meta: [{ title: "Akun Saya — BahanMaterial.com" }] }),
  component: AccountLayout,
});

function AccountLayout() {
  const [user, setUser] = useState<{
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    role: string;
    is_active: boolean;
    branch_id: number | null;
    nik_ktp: string | null;
    birth_date: string | null;
    birth_place: string | null;
    phone: string | null;
    nip: string | null;
    photo: string | null;
    department: string | null;
    unit: string | null;
    last_login: string;
  } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser<{
          id: number;
          name: string;
          email: string;
          email_verified_at: string | null;
          created_at: string;
          updated_at: string;
          role: string;
          is_active: boolean;
          branch_id: number | null;
          nik_ktp: string | null;
          birth_date: string | null;
          birth_place: string | null;
          phone: string | null;
          nip: string | null;
          photo: string | null;
          department: string | null;
          unit: string | null;
          last_login: string;
        }>();
        setUser(userData);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, []);

  const userData = user || { name: "Guest", email: "" };

  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const fullBleed =
    pathname === "/akun/aktivasi-sukses" ||
    pathname === "/akun/aktivasi-gagal" ||
    pathname === "/akun/cek-email";

  if (fullBleed) {
    return (
      <MainLayout user={{ name: userData.name }}>
        <Outlet />
      </MainLayout>
    );
  }

  return (
    <MainLayout user={{ name: userData.name }}>
      <div className="border-b border-border bg-card">
        <div className="container mx-auto max-w-7xl px-4 py-5">
          <h1 className="text-2xl font-bold text-primary">Akun Saya</h1>
        </div>
      </div>
      <div className="container mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <AccountSidebar user={userData} />
          <div className="min-w-0">
            <Outlet />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
