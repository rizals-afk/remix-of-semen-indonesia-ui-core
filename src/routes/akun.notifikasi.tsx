import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  NotificationItem,
  type AccountNotification,
} from "@/components/account/NotificationItem";

export const Route = createFileRoute("/akun/notifikasi")({
  head: () => ({
    meta: [
      { title: "Notifikasi Akun — BahanMaterial.com" },
      {
        name: "description",
        content: "Lihat informasi terbaru dan pembaruan transaksi akun BahanMaterial Anda.",
      },
      { property: "og:title", content: "Notifikasi Akun — BahanMaterial.com" },
      {
        property: "og:description",
        content: "Lihat informasi terbaru dan pembaruan transaksi akun BahanMaterial Anda.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: NotificationsPage,
});

const INITIAL_NOTIFICATIONS: AccountNotification[] = [
  {
    id: "recommendation-1",
    type: "information",
    title: "Rekomendasi Produk",
    message: "Yuk, cek & beli rekomendasi produk pilihan untukmu berikut ini!",
    timestamp: "2 jam yang lalu",
    unread: true,
  },
  {
    id: "voucher-1",
    type: "information",
    title: "Voucher Diskon 50%",
    message: "Yuk, cek & beli rekomendasi produk pilihan untukmu berikut ini!",
    timestamp: "2 jam yang lalu",
    unread: true,
  },
  {
    id: "recommendation-2",
    type: "information",
    title: "Rekomendasi Produk",
    message: "Yuk, cek & beli rekomendasi produk pilihan untukmu berikut ini!",
    timestamp: "2 jam yang lalu",
    unread: true,
  },
  {
    id: "transaction-verified",
    type: "transaction",
    title: "Pesanan Telah Diverifikasi",
    message: "Pesananmu telah dikonfirmasi. Silakan lanjutkan ke pembayaran.",
    timestamp: "1 jam yang lalu",
    unread: true,
  },
  {
    id: "transaction-shipped",
    type: "transaction",
    title: "Pesanan Sedang Dikirim",
    message: "Pesanan dari Gudang Gresik sedang dalam perjalanan ke alamatmu.",
    timestamp: "Kemarin",
    unread: false,
  },
];

type NotificationTab = "Informasi" | "Transaksi";

function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<NotificationTab>("Informasi");
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const visibleNotifications = useMemo(
    () =>
      notifications.filter((item) =>
        activeTab === "Informasi" ? item.type === "information" : item.type === "transaction",
      ),
    [activeTab, notifications],
  );

  const markAsRead = (id: string) => {
    setNotifications((current) =>
      current.map((item) => (item.id === id ? { ...item, unread: false } : item)),
    );
  };

  return (
    <section aria-labelledby="notification-heading">
      <h1 id="notification-heading" className="mb-3 text-lg font-bold text-foreground">
        Notifikasi
      </h1>

      <div className="min-h-[430px] overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex border-b border-border px-5 sm:px-7" role="tablist" aria-label="Jenis notifikasi">
          {(["Informasi", "Transaksi"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={activeTab === tab}
              onClick={() => setActiveTab(tab)}
              className={
                "relative min-w-28 px-3 py-3 text-sm font-semibold transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:transition-opacity " +
                (activeTab === tab
                  ? "text-primary after:bg-primary after:opacity-100"
                  : "text-muted-foreground after:opacity-0 hover:text-foreground")
              }
            >
              {tab}
            </button>
          ))}
        </div>

        <div role="tabpanel" aria-label={`Notifikasi ${activeTab}`}>
          {visibleNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onRead={markAsRead}
            />
          ))}
        </div>
      </div>
    </section>
  );
}