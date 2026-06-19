import { createFileRoute, Outlet } from "@tanstack/react-router";
import { MainLayout } from "@/components/layout/MainLayout";
import { AccountSidebar } from "@/components/account/AccountSidebar";

export const Route = createFileRoute("/akun")({
  head: () => ({ meta: [{ title: "Akun Saya — BahanMaterial.com" }] }),
  component: AccountLayout,
});

const USER = { name: "Auliya Gita Ananda", email: "auliya.gita@gmail.com" };

function AccountLayout() {
  return (
    <MainLayout user={{ name: USER.name }}>
      <div className="border-b border-border bg-card">
        <div className="container mx-auto max-w-7xl px-4 py-5">
          <h1 className="text-2xl font-bold text-primary">Akun Saya</h1>
        </div>
      </div>
      <div className="container mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <AccountSidebar user={USER} />
          <div className="min-w-0">
            <Outlet />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
