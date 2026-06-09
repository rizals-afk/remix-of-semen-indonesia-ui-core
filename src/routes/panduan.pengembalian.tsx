import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/common/ComingSoon";

export const Route = createFileRoute("/panduan/pengembalian")({
  component: () => <ComingSoon title="Seputar Pengembalian" />,
});
