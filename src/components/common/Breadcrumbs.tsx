import { Link } from "@tanstack/react-router";
import { Fragment } from "react";

export interface Crumb {
  label: string;
  to?: string;
}

/** Slash-separated breadcrumb trail used above listings & detail pages. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-muted-foreground">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <Fragment key={`${item.label}-${i}`}>
              <li>
                {item.to && !last ? (
                  <Link to={item.to} className="hover:text-primary">
                    {item.label}
                  </Link>
                ) : (
                  <span className={last ? "font-semibold text-primary" : ""}>{item.label}</span>
                )}
              </li>
              {!last && <li aria-hidden>/</li>}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
