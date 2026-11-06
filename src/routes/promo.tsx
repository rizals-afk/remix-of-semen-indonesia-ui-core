import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/promo")({
  beforeLoad: () => {
    throw redirect({ to: "/flashsale" });
  },
});
