import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/common/ComingSoon";

export const Route = createFileRoute("/promo")({
  component: () => <ComingSoon title="Promo Spesial" />,
});
