import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/common/ComingSoon";

export const Route = createFileRoute("/panduan/pembayaran")({
  component: () => <ComingSoon title="Seputar Pembayaran" />,
});
