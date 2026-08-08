import { createFileRoute } from "@tanstack/react-router";
import Projects from "@/pages/Projects";

export const Route = createFileRoute("/projects/")({
  head: () => ({
    meta: [
      { title: "Projects — Buildify" },
      {
        name: "description",
        content: "Browse every Buildify furniture project with client, status and completion tracking.",
      },
      { property: "og:title", content: "Projects — Buildify" },
      {
        property: "og:description",
        content: "Client projects, statuses and completion progress in one place.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Projects,
});
