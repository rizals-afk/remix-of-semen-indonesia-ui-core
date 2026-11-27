import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CartProvider } from "@/store/cart";
import { CheckoutProvider, useCheckout } from "@/store/checkout";
import { WarehouseProvider } from "@/store/warehouse";
import { CustomerLocationProvider } from "@/store/customer-location";
import { UserProvider } from "@/store/user";
import { NotificationProvider } from "@/store/notification";
import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useRef, type ReactNode } from "react";
import { useTrackVisit } from "@/hooks/useTrackVisit";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import faviconUrl from "../assets/favicon.ico?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "author", content: "BahanMaterial.com" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "BahanMaterial.com — The Best Partner in Building Material" },
      {
        name: "description",
        content:
          "Distributor resmi material bangunan PT Semen Indonesia: semen, bata ringan, baja ringan, atap, sanitari, dan kebutuhan proyek lainnya dengan harga terjangkau dan pengiriman tepat waktu.",
      },
      { property: "og:title", content: "BahanMaterial.com" },
      { property: "og:description", content: "The Best Partner in Building Material" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "icon",
        type: "image/x-icon",
        href: faviconUrl,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function CheckoutRouteWatcher() {
  const { setVouchers, clearCalculatedDiscounts } = useCheckout();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const wasInCheckoutRef = useRef(false);

  useEffect(() => {
    const inCheckout = pathname === "/checkout" || pathname.startsWith("/checkout/");
    if (wasInCheckoutRef.current && !inCheckout) {
      setVouchers([]);
      clearCalculatedDiscounts();
    }
    wasInCheckoutRef.current = inCheckout;
  }, [pathname, setVouchers, clearCalculatedDiscounts]);

  return null;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  useTrackVisit();

  return (
    <QueryClientProvider client={queryClient}>
      <WarehouseProvider>
        <UserProvider>
          <NotificationProvider>
            <CustomerLocationProvider>
              <CartProvider>
                <CheckoutProvider>
                  <CheckoutRouteWatcher />
                  {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
                  <Outlet />
                  <Toaster richColors position="top-center" />
                </CheckoutProvider>
              </CartProvider>
            </CustomerLocationProvider>
          </NotificationProvider>
        </UserProvider>
      </WarehouseProvider>
    </QueryClientProvider>
  );
}
