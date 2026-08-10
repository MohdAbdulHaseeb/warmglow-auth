import { createFileRoute } from "@tanstack/react-router";
import ProjectDetail from "@/pages/ProjectDetail";

export const Route = createFileRoute("/projects/$projectId")({
  head: () => ({
    meta: [
      { title: "Project Monitor — Buildify" },
      {
        name: "description",
        content:
          "Track a furniture project end to end: assigned team, progress, client, blueprint, materials, bill and payment status.",
      },
      { property: "og:title", content: "Project Monitor — Buildify" },
      {
        property: "og:description",
        content: "Monitor project progress, documents, bills and payments in one place.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProjectDetail,
});
