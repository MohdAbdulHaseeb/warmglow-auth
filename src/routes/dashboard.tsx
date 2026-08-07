import { createFileRoute } from "@tanstack/react-router";
import Dashboard from "@/pages/Dashboard";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Buildify Manufacturing Workspace" },
      {
        name: "description",
        content:
          "Track furniture projects, AI blueprint analyses, manufacturing orders and revenue in one Buildify dashboard.",
      },
      { property: "og:title", content: "Buildify Dashboard" },
      {
        property: "og:description",
        content: "AI-powered furniture project, blueprint and manufacturing overview.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});
