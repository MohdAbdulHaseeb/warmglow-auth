import { createFileRoute } from "@tanstack/react-router";
import Canvas from "@/pages/Canvas";

export const Route = createFileRoute("/canvas/$projectId")({
  head: () => ({
    meta: [
      { title: "Project Canvas — Buildify Workflow" },
      {
        name: "description",
        content:
          "Continue a project's Canvas workflow: blueprint analysis, materials, design suggestions and 3D room visualisation.",
      },
      { property: "og:title", content: "Project Canvas — Buildify" },
      { property: "og:description", content: "Continue the Buildify furniture creation workflow for this project." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Canvas,
});
