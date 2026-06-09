import type { ReactNode } from "react";
import { MainLayout } from "@/components/layout/MainLayout";

/**
 * Placeholder shell used by routes that have not been built out yet.
 * Keeps shared chrome (header + footer) consistent while the page is wired up.
 */
export function ComingSoon({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <MainLayout>
      <div className="container mx-auto max-w-7xl px-4 py-16">
        <h1 className="text-2xl font-bold text-primary md:text-3xl">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Halaman ini sedang dibangun mengikuti spesifikasi desain.
        </p>
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </MainLayout>
  );
}
