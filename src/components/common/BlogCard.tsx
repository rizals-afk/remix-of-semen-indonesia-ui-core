import { ArrowRight, Calendar } from "lucide-react";
import { Link } from "@tanstack/react-router";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
}

export interface Blog {
  id: string;
  title: string;
  author: string;
  banner_photo: string | null;
  tags: string[];
  content: string;
  created_at: string;
  updated_at: string;
}

/**
 * Card used in the "Blog & Inspirasi" carousel on the home page.
 */
export function BlogCard({ post }: { post: BlogPost | Blog }) {
  const isApiBlog = 'banner_photo' in post;
  const image = isApiBlog ? post.banner_photo || 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=400&q=70' : post.image;
  const date = isApiBlog ? new Date(post.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : post.date;
  const excerpt = isApiBlog ? (post.content || '').substring(0, 150) + '...' : post.excerpt;
  const linkParams = isApiBlog ? { id: post.id } : { slug: post.slug };
  const linkTo = isApiBlog ? "/blog/$id" : "/blog/$slug";

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md">
      <Link to={linkTo} params={linkParams} className="aspect-[16/10] overflow-hidden bg-muted">
        <img src={image} alt={post.title} loading="lazy" className="h-full w-full object-cover" />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 text-base font-semibold text-foreground">
          <Link to={linkTo} params={linkParams} className="hover:text-primary">
            {post.title}
          </Link>
        </h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{excerpt}</p>
        <div className="mt-auto flex items-center justify-between pt-3 text-xs">
          <span className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            {date}
          </span>
          <Link to={linkTo} params={linkParams} className="inline-flex items-center gap-1 font-semibold text-accent">
            Baca Selengkapnya <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
