import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
}

/** Numeric pagination matching the bottom of the product listing + reviews. */
export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  const pages = buildPages(page, totalPages);
  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-2">
      <PagBtn aria-label="Sebelumnya" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        <ChevronLeft className="h-4 w-4" />
      </PagBtn>
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`e-${i}`} className="px-1 text-muted-foreground">…</span>
        ) : (
          <PagBtn key={p} active={p === page} onClick={() => onChange(p)}>
            {p}
          </PagBtn>
        ),
      )}
      <PagBtn aria-label="Selanjutnya" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
        <ChevronRight className="h-4 w-4" />
      </PagBtn>
    </nav>
  );
}

function PagBtn({
  active,
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      type="button"
      {...rest}
      className={
        "grid h-9 min-w-9 place-items-center rounded-md border px-2 text-sm font-medium transition-colors " +
        (active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background text-foreground hover:border-primary hover:text-primary disabled:opacity-40 disabled:hover:border-border disabled:hover:text-foreground")
      }
    >
      {children}
    </button>
  );
}

function buildPages(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const set = new Set<number>([1, 2, total - 1, total, current - 1, current, current + 1]);
  const arr = [...set].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const out: (number | "...")[] = [];
  arr.forEach((n, i) => {
    if (i > 0 && n - arr[i - 1] > 1) out.push("...");
    out.push(n);
  });
  return out;
}
