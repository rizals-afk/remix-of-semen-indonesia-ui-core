import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import {
  NotificationItem,
  type AccountNotification,
} from "@/components/account/NotificationItem";
import { fetchNotifications, markAsRead, type Notification } from "@/lib/api/notification";
import { useNotification } from "@/store/notification";
import { Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

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

function transformNotification(notification: Notification): AccountNotification {
  const isTransaction = notification.data.type === "trx" || notification.data.type === "order";
  return {
    id: notification.id,
    type: isTransaction ? "transaction" : "information",
    title: notification.data.title,
    message: notification.data.message,
    timestamp: formatDistanceToNow(new Date(notification.created_at), { addSuffix: true, locale: id }),
    unread: notification.read_at === null,
    orderId: typeof notification.data.data?.id === 'number' ? notification.data.data.id : undefined,
  };
}

type NotificationTab = "Informasi" | "Transaksi";

function NotificationsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<NotificationTab>("Informasi");
  const [notifications, setNotifications] = useState<AccountNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { refreshUnreadCount } = useNotification();

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const response = await fetchNotifications({ page: 1, per_page: 50 });
        const transformed = response.data.map(transformNotification);
        setNotifications(transformed);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNotifications();
  }, []);

  const visibleNotifications = useMemo(
    () =>
      notifications.filter((item) =>
        activeTab === "Informasi" ? item.type === "information" : item.type === "transaction",
      ),
    [activeTab, notifications],
  );

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id);
      setNotifications((current) =>
        current.map((item) => (item.id === id ? { ...item, unread: false } : item)),
      );
      await refreshUnreadCount();
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
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
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : visibleNotifications.length === 0 ? (
            <div className="flex items-center justify-center py-20 text-muted-foreground">
              Tidak ada notifikasi
            </div>
          ) : (
            visibleNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onRead={handleMarkAsRead}
                onClick={() => {
                  if (notification.type === "transaction" && notification.orderId) {
                    navigate({ to: "/akun/transaksi/$id", params: { id: notification.orderId.toString() } });
                  }
                }}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}