import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { MainLayout } from "@/components/layout/MainLayout";
import { BlogRelatedItem } from "@/components/blog/BlogListCard";
import { ProductCard } from "@/components/product/ProductCard";
import { ALL_PRODUCTS } from "@/data/catalog";
import { getPostBySlug, relatedPosts, tagSlug, type BlogArticle } from "@/data/blog";
import { fetchBlogProducts, fetchBlogs, type BlogProduct } from "@/lib/api/blog";
import { useState, useEffect } from "react";

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
  const post = Route.useLoaderData() as BlogArticle;
  const [relatedBlogs, setRelatedBlogs] = useState<any[]>([]);
  const [blogProducts, setBlogProducts] = useState<BlogProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch related blogs (per_page: 4, page: 1)
  useEffect(() => {
    const loadRelatedBlogs = async () => {
      try {
        const response = await fetchBlogs({ per_page: 4, page: 1 });
        console.log("Related blogs API response:", response);
        setRelatedBlogs(response.data);
      } catch (error) {
        console.error("Failed to load related blogs:", error);
        // Fallback to static data
        const related = relatedPosts(post.slug);
        setRelatedBlogs(related);
      }
    };
    loadRelatedBlogs();
  }, [post.slug]);

  // Fetch blog products (using blog_id from post if available, or use a default)
  useEffect(() => {
    const loadBlogProducts = async () => {
      try {
        // Use post.id as blog_id, or fallback to a default if needed
        const blogId = post.id || "16";
        console.log("Fetching blog products with blog_id:", blogId);
        const response = await fetchBlogProducts({ per_page: 15, page: 1, blog_id: blogId });
        console.log("Blog products API response:", response);
        setBlogProducts(response.data);
      } catch (error) {
        console.error("Failed to load blog products:", error);
        // Fallback to static data
        setBlogProducts(ALL_PRODUCTS.slice(0, 5));
      } finally {
        setLoading(false);
      }
    };
    loadBlogProducts();
  }, [post.id]);

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
              {relatedBlogs.length > 0 ? (
                relatedBlogs.map((p: any) => (
                  <BlogRelatedItem key={p.slug} post={p} />
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Tidak ada artikel terkait</p>
              )}
            </div>
          </aside>
        </div>

        <section className="mt-12">
          <h2 className="text-lg font-bold text-foreground">Rekomendasi Produk</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {blogProducts.length > 0 ? (
              blogProducts.map((p: BlogProduct) => (
                <ProductCard key={p.id} product={p} />
              ))
            ) : (
              <p className="col-span-full text-sm text-muted-foreground">Tidak ada produk rekomendasi</p>
            )}
          </div>
        </section>
      </article>
    </MainLayout>
  );
}