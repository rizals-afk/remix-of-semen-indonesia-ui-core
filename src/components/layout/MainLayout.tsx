import { MessageCircle } from "lucide-react";
import type { ReactNode } from "react";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

interface MainLayoutProps {
  children: ReactNode;
  user?: { name: string } | null;
  shipTo?: string;
}

/**
 * Standard page chrome: header on top, footer at the bottom,
 * a floating WhatsApp button bottom-right (matches every uploaded screen).
 */
export function MainLayout({ children, user, shipTo }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader user={user} shipTo={shipTo} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <a
        href="https://wa.me/6281133331800"
        target="_blank"
        rel="noreferrer noopener"
        aria-label="Chat WhatsApp"
        className="fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-full bg-whatsapp text-white shadow-lg transition-transform hover:scale-105"
      >
        <MessageCircle className="h-7 w-7" />
      </a>
    </div>
  );
}
