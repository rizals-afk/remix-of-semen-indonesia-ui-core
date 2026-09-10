import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/notifikasi")({
  beforeLoad: () => {
    throw redirect({ to: "/akun/notifikasi" });
  },
});
