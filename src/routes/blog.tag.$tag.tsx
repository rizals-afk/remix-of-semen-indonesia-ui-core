import { createFileRoute } from "@tanstack/react-router";
import { MainLayout } from "@/components/layout/MainLayout";
import { BlogRowCard } from "@/components/blog/BlogListCard";
import { Pagination } from "@/components/common/Pagination";
import { getPostsByTag, tagFromSlug } from "@/data/blog";
import { useState } from "react";

export const Route = createFileRoute("/blog/tag/$tag")({
  head: ({ params }) => ({
    meta: [{ title: `#${params.tag} — Blog BahanMaterial.com` }],
  }),
  component: TagPage,
});

function TagPage() {
  const { tag } = Route.useParams();
  const label = tagFromSlug(tag);
  const posts = getPostsByTag(label);
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const totalPages = Math.max(1, Math.ceil(posts.length / pageSize));
  const items = posts.slice((page - 1) * pageSize, page * pageSize);

  return (
    <MainLayout user={{ name: "Auliya Gita Ananda" }}>
      <section className="container mx-auto max-w-5xl px-4 py-10">
        <header className="border-b border-border pb-4">
          <h1 className="border-l-4 border-accent pl-3 text-xl font-extrabold text-foreground">
            #{label.charAt(0).toUpperCase() + label.slice(1)}
          </h1>
        </header>
        <div className="mt-8 space-y-6">
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">Belum ada artikel pada tag ini.</p>
          ) : (
            items.map((p) => <BlogRowCard key={p.slug} post={p} />)
          )}
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