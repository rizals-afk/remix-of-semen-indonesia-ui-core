import { Calendar } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { BlogArticle } from "@/data/blog";
import type { Blog } from "@/lib/api/blog";

/** Larger blog card used on the Blog & Inspirasi listing grid. */
export function BlogListCard({ post }: { post: BlogArticle | Blog }) {
  const isApiBlog = 'banner_photo' in post;
  const image = isApiBlog ? post.banner_photo || 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=400&q=70' : post.image;
  const date = isApiBlog ? new Date(post.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : post.date;
  const excerpt = isApiBlog ? (post.content || '').substring(0, 150) + '...' : post.excerpt;
  const linkParams = isApiBlog ? { id: post.id } : { slug: post.slug };
  const linkTo = isApiBlog ? "/blog/$id" : "/blog/$slug";

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-md">
      <Link
        to={linkTo}
        params={linkParams}
        className="aspect-[16/10] overflow-hidden bg-muted"
      >
        <img src={image} alt={post.title} loading="lazy" className="h-full w-full object-cover" />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="line-clamp-2 text-lg font-bold text-foreground">
          <Link to={linkTo} params={linkParams} className="hover:text-primary">
            {post.title}
          </Link>
        </h3>
        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" /> {date}
        </p>
        <p className="line-clamp-3 text-sm text-muted-foreground">{excerpt}</p>
        <Link
          to={linkTo}
          params={linkParams}
          className="mt-auto pt-2 text-sm font-bold text-primary hover:underline"
        >
          Baca Selengkapnya
        </Link>
      </div>
    </article>
  );
}

/** Horizontal media card used on tag/category listings. */
export function BlogRowCard({ post }: { post: BlogArticle | Blog }) {
  const isApiBlog = 'banner_photo' in post;
  const image = isApiBlog ? post.banner_photo || 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=400&q=70' : post.image;
  const date = isApiBlog ? new Date(post.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : post.date;
  const excerpt = isApiBlog ? post.content.substring(0, 150) + '...' : post.excerpt;
  const linkParams = isApiBlog ? { id: post.id } : { slug: post.slug };
  const linkTo = isApiBlog ? "/blog/$id" : "/blog/$slug";

  return (
    <article className="grid grid-cols-1 gap-5 border-b border-border pb-6 last:border-none sm:grid-cols-[300px_1fr]">
      <Link
        to={linkTo}
        params={linkParams}
        className="block aspect-[16/10] overflow-hidden rounded-2xl bg-muted sm:aspect-[4/3]"
      >
        <img src={image} alt={post.title} loading="lazy" className="h-full w-full object-cover" />
      </Link>
      <div className="flex flex-col justify-center gap-2">
        <h3 className="text-xl font-bold text-foreground">
          <Link to={linkTo} params={linkParams} className="hover:text-primary">
            {post.title}
          </Link>
        </h3>
        <p className="text-xs text-muted-foreground">🕒 {date}</p>
        <p className="line-clamp-2 text-sm text-muted-foreground">{excerpt}</p>
      </div>
    </article>
  );
}

/** Compact sidebar item for "Artikel Terkait". */
export function BlogRelatedItem({ post }: { post: BlogArticle | Blog }) {
  const isApiBlog = 'banner_photo' in post;
  const image = isApiBlog ? post.banner_photo || 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=400&q=70' : post.image;
  const date = isApiBlog ? new Date(post.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : post.date;
  const linkParams = isApiBlog ? { id: post.id } : { slug: post.slug };
  const linkTo = isApiBlog ? "/blog/$id" : "/blog/$slug";

  return (
    <Link
      to={linkTo}
      params={linkParams}
      className="flex items-start gap-3 rounded-md p-1 hover:bg-muted"
    >
      <span className="block h-16 w-24 shrink-0 overflow-hidden rounded-md bg-muted">
        <img src={image} alt="" loading="lazy" className="h-full w-full object-cover" />
      </span>
      <span className="min-w-0">
        <span className="line-clamp-2 text-sm font-bold text-foreground">{post.title}</span>
        <span className="mt-1 block text-xs text-muted-foreground">{date}</span>
      </span>
    </Link>
  );
}