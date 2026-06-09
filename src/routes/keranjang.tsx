import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/common/ComingSoon";

export const Route = createFileRoute("/keranjang")({
  component: () => <ComingSoon title="Keranjang Belanja" />,
});
