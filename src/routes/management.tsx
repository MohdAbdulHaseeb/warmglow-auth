import { createFileRoute } from "@tanstack/react-router";
import Management from "@/pages/Management";

export const Route = createFileRoute("/management")({
  head: () => ({
    meta: [
      { title: "Management — Buildify" },
      {
        name: "description",
        content: "Manage Buildify workers, materials, wages, pricing and stock availability in one place.",
      },
      { property: "og:title", content: "Management — Buildify" },
      {
        property: "og:description",
        content: "Internal administration for workers, materials, pricing and stock status.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Management,
});
