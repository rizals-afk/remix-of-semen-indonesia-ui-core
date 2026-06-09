import { ArrowRight, Calendar } from "lucide-react";

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
}

/**
 * Card used in the "Blog & Inspirasi" carousel on the home page.
 */
export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md">
      <div className="aspect-[16/10] overflow-hidden bg-muted">
        <img src={post.image} alt={post.title} loading="lazy" className="h-full w-full object-cover" />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 text-base font-semibold text-foreground">{post.title}</h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
        <div className="mt-auto flex items-center justify-between pt-3 text-xs">
          <span className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            {post.date}
          </span>
          <a href="#" className="inline-flex items-center gap-1 font-semibold text-accent">
            Baca Selengkapnya <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </article>
  );
}
