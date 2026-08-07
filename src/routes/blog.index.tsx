import { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { BlogListCard } from "@/components/blog/BlogListCard";
import { Pagination } from "@/components/common/Pagination";
import { fetchBlogs } from "@/lib/api/blog";
import { getCurrentUserFromStorage } from "@/lib/auth";

export const Route = createFileRoute("/blog/")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search.q === "string" ? search.q : undefined,
    page: typeof search.page === "number" ? search.page : 1,
  }),
  head: () => ({ meta: [{ title: "Blog & Inspirasi — BahanMaterial.com" }] }),
  component: BlogIndexPage,
});

const PAGE_SIZE = 10;

function BlogIndexPage() {
  const { q = "", page = 1 } = Route.useSearch();
  const navigate = useNavigate({ from: "/blog/" });
  const user = getCurrentUserFromStorage();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const loadBlogs = async () => {
      setLoading(true);
      try {
        const response = await fetchBlogs({
          page,
          per_page: PAGE_SIZE,
          search: q || undefined,
        });
        setBlogs(response.data);
        setTotalPages(Math.max(1, Math.ceil(response.total / PAGE_SIZE)));
      } catch (error) {
        console.error("Failed to load blogs:", error);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    loadBlogs();
  }, [page, q]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({
      search: (prev: { q: string | undefined; page: number }) => ({
        ...prev,
        q: q || undefined,
        page: 1,
      }),
    });
  };

  const handlePageChange = (newPage: number) => {
    navigate({
      search: (prev: { q: string | undefined; page: number }) => ({
        ...prev,
        page: newPage,
      }),
    });
  };

  return (
    <MainLayout user={user}>
      <section className="container mx-auto max-w-7xl px-4 py-10">
        <header className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-extrabold text-primary md:text-4xl">Blog &amp; Inspirasi</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Temukan tren konstruksi terbaru, panduan pemilihan material, dan inspirasi desain
            untuk mewujudkan proyek impian Anda.
          </p>

          <form
            onSubmit={handleSearch}
            className="mt-6 flex w-full max-w-xl mx-auto overflow-hidden rounded-md border border-border bg-background"
          >
            <input
              value={q}
              onChange={(e) => {
                const value = e.target.value;
                navigate({
                  search: (prev: { q: string | undefined; page: number }) => ({
                    ...prev,
                    q: value || undefined,
                    page: 1,
                  }),
                });
              }}
              placeholder="Cari inspirasi material Anda"
              className="flex-1 px-4 py-3 text-sm focus:outline-none"
            />
            <button
              type="submit"
              className="grid w-12 place-items-center bg-primary text-primary-foreground"
              aria-label="Cari"
            >
              <Search className="h-4 w-4" />
            </button>
          </form>
        </header>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[16/10] rounded-2xl border border-border bg-muted animate-pulse" />
            ))
          ) : blogs.length > 0 ? (
            blogs.map((blog) => (
              <BlogListCard key={blog.id} post={blog} />
            ))
          ) : (
            <div className="col-span-full text-center text-sm text-muted-foreground">
              {q ? "Tidak ada blog yang cocok dengan pencarian Anda." : "Tidak ada blog tersedia."}
            </div>
          )}
        </div>

        {!loading && totalPages > 1 ? (
          <div className="mt-10">
            <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />
          </div>
        ) : null}
      </section>
    </MainLayout>
  );
}