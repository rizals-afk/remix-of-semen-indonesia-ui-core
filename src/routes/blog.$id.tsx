import { createFileRoute, Link } from "@tanstack/react-router";
import { Calendar, User, Tag, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { fetchBlogById } from "@/lib/api/blog";
import type { Blog } from "@/lib/api/blog";

export const Route = createFileRoute("/blog/$id")({
  component: BlogDetailPage,
});

function BlogDetailPage() {
  const { id } = Route.useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
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
      <div className="container mx-auto max-w-4xl px-4 py-12">
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

          <div className="mt-8 prose prose-sm max-w-none text-foreground md:prose-base">
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          </div>
        </article>
      </div>
    </MainLayout>
  );
}
