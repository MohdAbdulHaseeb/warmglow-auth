import { createFileRoute } from "@tanstack/react-router";
import Analytics from "@/pages/Analytics";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — Buildify" },
      {
        name: "description",
        content: "Revenue, project volume, material usage and manufacturing performance analytics.",
      },
      { property: "og:title", content: "Analytics — Buildify" },
      {
        property: "og:description",
        content: "Studio-wide production and revenue insights for furniture manufacturing.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Analytics,
});
