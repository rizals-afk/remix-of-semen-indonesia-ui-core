import { BellRing, ReceiptText } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface AccountNotification {
  id: string;
  type: "information" | "transaction";
  title: string;
  message: string;
  timestamp: string;
  unread: boolean;
  orderId?: number;
}

export function NotificationItem({
  notification,
  onRead,
  onClick,
}: {
  notification: AccountNotification;
  onRead: (id: string) => void;
  onClick?: () => void;
}) {
  const Icon = notification.type === "transaction" ? ReceiptText : BellRing;

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={() => {
        onRead(notification.id);
        if (onClick) onClick();
      }}
      className="group h-auto w-full justify-start rounded-none px-5 py-3 text-left hover:bg-muted/50 sm:px-7"
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
        <Icon className="h-5 w-5" />
      </span>

      <span className="min-w-0 flex-1 whitespace-normal">
        <span className="block text-sm font-bold text-foreground">{notification.title}</span>
        <span className="mt-0.5 block text-xs font-normal leading-5 text-foreground/80">
          {notification.message}
        </span>
        <span className="mt-0.5 block text-[11px] font-normal text-muted-foreground">
          {notification.timestamp}
        </span>
      </span>

      <span
        aria-label={notification.unread ? "Belum dibaca" : "Sudah dibaca"}
        className={
          "ml-3 h-2.5 w-2.5 shrink-0 rounded-full transition-opacity " +
          (notification.unread ? "bg-primary opacity-100" : "opacity-0")
        }
      />
    </Button>
  );
}