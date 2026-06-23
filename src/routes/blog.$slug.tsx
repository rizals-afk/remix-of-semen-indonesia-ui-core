import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { MainLayout } from "@/components/layout/MainLayout";
import { BlogRelatedItem } from "@/components/blog/BlogListCard";
import { ProductCard } from "@/components/product/ProductCard";
import { ALL_PRODUCTS } from "@/data/catalog";
import { getPostBySlug, relatedPosts, tagSlug } from "@/data/blog";

export const Route = createFileRoute("/blog/$slug")({
  head: ({ params }) => ({
    meta: [{ title: `${params.slug} — Blog BahanMaterial.com` }],
  }),
  loader: ({ params }) => {
    const post = getPostBySlug(params.slug);
    if (!post) throw notFound();
    return post;
  },
  component: BlogDetailPage,
});

function BlogDetailPage() {
  const post = Route.useLoaderData();
  const related = relatedPosts(post.slug);
  const recommendations = ALL_PRODUCTS.slice(0, 5);

  return (
    <MainLayout user={{ name: "Auliya Gita Ananda" }}>
      <article className="container mx-auto max-w-7xl px-4 py-10">
        <header className="mx-auto max-w-4xl text-center">
          <h1 className="text-2xl font-extrabold text-primary md:text-3xl">{post.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{post.longDate}</p>
          <div className="mt-4 flex items-center justify-start gap-3">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-muted text-muted-foreground">
              👤
            </span>
            <span className="text-sm font-semibold text-foreground">{post.author}</span>
          </div>
        </header>

        <div className="mt-6 overflow-hidden rounded-2xl">
          <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="space-y-5 text-sm leading-7 text-foreground">
            {post.content.map((p, i) => (
              <p key={i}>{p}</p>
            ))}

            <div className="flex flex-wrap gap-2 pt-4">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  to="/blog/tag/$tag"
                  params={{ tag: tagSlug(tag) }}
                  className="rounded-full border border-primary px-3 py-1 text-xs font-semibold text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>

          <aside className="space-y-3">
            <h2 className="text-base font-bold text-foreground">Artikel Terkait</h2>
            <div className="space-y-3">
              {related.map((p) => (
                <BlogRelatedItem key={p.slug} post={p} />
              ))}
            </div>
          </aside>
        </div>

        <section className="mt-12">
          <h2 className="text-lg font-bold text-foreground">Rekomendasi Produk</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {recommendations.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </article>
    </MainLayout>
  );
}