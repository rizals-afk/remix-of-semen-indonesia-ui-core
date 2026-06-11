import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";

export const Route = createFileRoute("/pembayaran/sukses")({
  head: () => ({ meta: [{ title: "Pembayaran Berhasil — BahanMaterial.com" }] }),
  component: PaymentSuccessPage,
});

function PaymentSuccessPage() {
  return (
    <MainLayout user={{ name: "Auliya Gita Ananda" }}>
      <div className="container mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
        <div className="grid h-28 w-28 place-items-center rounded-full bg-success/15">
          <div className="grid h-20 w-20 place-items-center rounded-full bg-success text-white">
            <Check className="h-12 w-12" strokeWidth={3} />
          </div>
        </div>
        <h1 className="mt-6 text-2xl font-bold text-primary">Pembayaran Berhasil</h1>
        <p className="mt-3 text-sm text-foreground">
          Terima kasih telah berbelanja di Bahan Material
        </p>
        <p className="text-sm text-foreground">Pesanan akan diproses secepatnya!</p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/akun"
            className="rounded-md border-2 border-primary px-6 py-2.5 text-sm font-semibold text-primary hover:bg-primary/5"
          >
            Lihat Pesanan
          </Link>
          <Link
            to="/"
            className="rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
