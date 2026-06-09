import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/common/ComingSoon";

export const Route = createFileRoute("/masuk")({
  component: () => <ComingSoon title="Masuk" />,
});
