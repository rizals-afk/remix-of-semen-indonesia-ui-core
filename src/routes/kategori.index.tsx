import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/common/ComingSoon";

export const Route = createFileRoute("/kategori/")({
  component: () => <ComingSoon title="Kategori Produk" />,
});
