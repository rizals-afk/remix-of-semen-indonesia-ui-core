import { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

interface LegalPageLayoutProps {
  title: string;
  lastUpdated: string;
  breadcrumbPath?: { label: string; href: string }[];
  children: ReactNode;
  showTableOfContents?: boolean;
  tableOfContents?: { id: string; title: string }[];
}

export function LegalPageLayout({
  title,
  lastUpdated,
  breadcrumbPath,
  children,
  showTableOfContents = false,
  tableOfContents = [],
}: LegalPageLayoutProps) {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-5xl px-4 py-16 md:px-6 lg:px-8">
        {/* Breadcrumb */}
        {breadcrumbPath && (
          <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
            {breadcrumbPath.map((item, index) => (
              <div key={item.href} className="flex items-center gap-2">
                {index > 0 && <ChevronRight className="h-4 w-4" />}
                {index === breadcrumbPath.length - 1 ? (
                  <span className="font-medium text-foreground">{item.label}</span>
                ) : (
                  <Link to={item.href} className="hover:text-foreground transition-colors">
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        )}

        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold text-primary md:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Last updated: {lastUpdated}
          </p>
        </header>

        {/* Content with optional Table of Contents */}
        <div className="grid gap-12 lg:grid-cols-[1fr,280px]">
          {/* Main Content */}
          <article className="min-w-0">{children}</article>

          {/* Table of Contents (Desktop) */}
          {showTableOfContents && tableOfContents.length > 0 && (
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <h3 className="mb-4 text-sm font-semibold text-foreground">Contents</h3>
                <nav className="space-y-2">
                  {tableOfContents.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item.title}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>
          )}
        </div>
      </div>
    </main>
  );
}
