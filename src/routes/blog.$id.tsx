import { createFileRoute, Link } from "@tanstack/react-router";
import { Calendar, User, Tag, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { BlogRelatedItem } from "@/components/blog/BlogListCard";
import { ProductCard } from "@/components/product/ProductCard";
import { fetchBlogById, fetchBlogs, type Blog } from "@/lib/api/blog";

export const Route = createFileRoute("/blog/$id")({
  component: BlogDetailPage,
});

function BlogDetailPage() {
  const { id } = Route.useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBlog = async () => {
      try {
        const data = await fetchBlogById(id);
        setBlog(data);
      } catch (error) {
        console.error("Failed to load blog:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBlog();
  }, [id]);

  // Fetch related blogs (per_page: 4, page: 1)
  useEffect(() => {
    const loadRelatedBlogs = async () => {
      try {
        const response = await fetchBlogs({ per_page: 4, page: 1 });
        console.log("Related blogs API response:", response);
        setRelatedBlogs(response.data);
      } catch (error) {
        console.error("Failed to load related blogs:", error);
      }
    };
    loadRelatedBlogs();
  }, []);

  // Map blog_products to product card format
  const mappedProducts = blog?.blog_products?.map((item) => {
    const variant = item.product_variant;
    const product = item.product;
    const pricelist = variant.pricelists?.[0];
    const media = variant.media?.[0] || product.media?.[0];

    return {
      id: String(product.id),
      name: product.name,
      price: pricelist ? parseFloat(pricelist.branch_price_max) : 0,
      image: media?.url || product.photo || '',
      warehouse: pricelist?.branch?.name || 'Gudang Utama',
      rating: undefined,
      categorySlug: product.category?.name?.toLowerCase().replace(/\s+/g, '-'),
      variantName: variant.variant_name,
    };
  }) || [];

  if (loading) {
    return (
      <MainLayout user={null}>
        <div className="container mx-auto max-w-4xl px-4 py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-1/3 rounded bg-muted" />
            <div className="aspect-[16/9] rounded-xl bg-muted" />
            <div className="space-y-3">
              <div className="h-4 w-full rounded bg-muted" />
              <div className="h-4 w-full rounded bg-muted" />
              <div className="h-4 w-3/4 rounded bg-muted" />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!blog) {
    return (
      <MainLayout user={null}>
        <div className="container mx-auto max-w-4xl px-4 py-12">
          <p className="text-center text-muted-foreground">Blog tidak ditemukan.</p>
        </div>
      </MainLayout>
    );
  }

  const formattedDate = new Date(blog.created_at).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <MainLayout user={null}>
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <Breadcrumbs items={[
          { label: "Home", to: "/" },
          { label: "Blog", to: "/blog" },
          { label: blog.title },
        ]} />

        <Link
          to="/blog"
          search={{
            q: undefined,
            page: 1,
          }}
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Blog
        </Link>

        <article className="mt-8">
          <h1 className="text-3xl font-bold text-primary md:text-4xl">{blog.title}</h1>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {blog.author}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formattedDate}
            </span>
          </div>

          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary"
                >
                  <Tag className="h-3 w-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {blog.banner_photo && (
            <div className="mt-6 aspect-[16/9] overflow-hidden rounded-xl border border-border bg-muted">
              <img
                src={blog.banner_photo}
                alt={blog.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}
        </article>

        {/* CONTENT + ARTIKEL TERKAIT */}
        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_320px]">
          {/* Article Content */}
          <div className="space-y-5 text-sm leading-7 text-foreground">
            <div className="prose prose-sm max-w-none text-foreground md:prose-base">
              <div dangerouslySetInnerHTML={{ __html: blog.content }} />
            </div>
          </div>

          {/* Artikel Terkait Sidebar */}
          <aside className="space-y-3 lg:sticky lg:top-24 lg:self-start">
            <h2 className="text-base font-bold text-foreground">Artikel Terkait</h2>
            <div className="space-y-3">
              {relatedBlogs.length > 0 ? (
                relatedBlogs.map((p: Blog) => (
                  <BlogRelatedItem key={p.id} post={p} />
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Tidak ada artikel terkait</p>
              )}
            </div>
          </aside>
        </div>

        {/* REKOMENDASI PRODUK */}
        <section className="mt-12">
          <h2 className="text-lg font-bold text-foreground">Rekomendasi Produk</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {mappedProducts.length > 0 ? (
              mappedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))
            ) : (
              <p className="col-span-full text-sm text-muted-foreground">Tidak ada produk rekomendasi</p>
            )}
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
