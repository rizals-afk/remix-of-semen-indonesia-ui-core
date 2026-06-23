import { Calendar } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { BlogArticle } from "@/data/blog";

/** Larger blog card used on the Blog & Inspirasi listing grid. */
export function BlogListCard({ post }: { post: BlogArticle }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-md">
      <Link
        to="/blog/$slug"
        params={{ slug: post.slug }}
        className="aspect-[16/10] overflow-hidden bg-muted"
      >
        <img src={post.image} alt={post.title} loading="lazy" className="h-full w-full object-cover" />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="line-clamp-2 text-lg font-bold text-foreground">
          <Link to="/blog/$slug" params={{ slug: post.slug }} className="hover:text-primary">
            {post.title}
          </Link>
        </h3>
        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" /> {post.date}
        </p>
        <p className="line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>
        <Link
          to="/blog/$slug"
          params={{ slug: post.slug }}
          className="mt-auto pt-2 text-sm font-bold text-primary hover:underline"
        >
          Baca Selengkapnya
        </Link>
      </div>
    </article>
  );
}

/** Horizontal media card used on tag/category listings. */
export function BlogRowCard({ post }: { post: BlogArticle }) {
  return (
    <article className="grid grid-cols-1 gap-5 border-b border-border pb-6 last:border-none sm:grid-cols-[300px_1fr]">
      <Link
        to="/blog/$slug"
        params={{ slug: post.slug }}
        className="block aspect-[16/10] overflow-hidden rounded-2xl bg-muted sm:aspect-[4/3]"
      >
        <img src={post.image} alt={post.title} loading="lazy" className="h-full w-full object-cover" />
      </Link>
      <div className="flex flex-col justify-center gap-2">
        <h3 className="text-xl font-bold text-foreground">
          <Link to="/blog/$slug" params={{ slug: post.slug }} className="hover:text-primary">
            {post.title}
          </Link>
        </h3>
        <p className="text-xs text-muted-foreground">🕒 {post.date}</p>
        <p className="line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
      </div>
    </article>
  );
}

/** Compact sidebar item for "Artikel Terkait". */
export function BlogRelatedItem({ post }: { post: BlogArticle }) {
  return (
    <Link
      to="/blog/$slug"
      params={{ slug: post.slug }}
      className="flex items-start gap-3 rounded-md p-1 hover:bg-muted"
    >
      <span className="block h-16 w-24 shrink-0 overflow-hidden rounded-md bg-muted">
        <img src={post.image} alt="" loading="lazy" className="h-full w-full object-cover" />
      </span>
      <span className="min-w-0">
        <span className="line-clamp-2 text-sm font-bold text-foreground">{post.title}</span>
        <span className="mt-1 block text-xs text-muted-foreground">{post.date}</span>
      </span>
    </Link>
  );
}