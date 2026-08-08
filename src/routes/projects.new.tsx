import { createFileRoute } from "@tanstack/react-router";
import NewProject from "@/pages/NewProject";

export const Route = createFileRoute("/projects/new")({
  head: () => ({
    meta: [
      { title: "Create New Project — Buildify" },
      {
        name: "description",
        content: "Start a new Buildify furniture project with blueprints, materials and manufacturing.",
      },
      { property: "og:title", content: "Create New Project — Buildify" },
      {
        property: "og:description",
        content: "Set up a new furniture project in your Buildify workspace.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NewProject,
});
