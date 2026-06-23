import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { BlogListCard } from "@/components/blog/BlogListCard";
import { Pagination } from "@/components/common/Pagination";
import { BLOG_POSTS } from "@/data/blog";

export const Route = createFileRoute("/blog/")({
  head: () => ({ meta: [{ title: "Blog & Inspirasi — BahanMaterial.com" }] }),
  component: BlogIndexPage,
});

const PAGE_SIZE = 6;

function BlogIndexPage() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!q.trim()) return BLOG_POSTS;
    const k = q.toLowerCase();
    return BLOG_POSTS.filter(
      (p) => p.title.toLowerCase().includes(k) || p.excerpt.toLowerCase().includes(k),
    );
  }, [q]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <MainLayout user={{ name: "Auliya Gita Ananda" }}>
      <section className="container mx-auto max-w-7xl px-4 py-10">
        <header className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-extrabold text-primary md:text-4xl">Blog &amp; Inspirasi</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Temukan tren konstruksi terbaru, panduan pemilihan material, dan inspirasi desain
            untuk mewujudkan proyek impian Anda.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setPage(1);
            }}
            className="mt-6 flex w-full max-w-xl mx-auto overflow-hidden rounded-md border border-border bg-background"
          >
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
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
          {pageItems.map((p) => (
            <BlogListCard key={p.slug} post={p} />
          ))}
        </div>

        {totalPages > 1 ? (
          <div className="mt-10">
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        ) : null}
      </section>
    </MainLayout>
  );
}