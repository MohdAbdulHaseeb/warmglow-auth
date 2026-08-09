import { createFileRoute } from "@tanstack/react-router";
import Canvas from "@/pages/Canvas";

export const Route = createFileRoute("/canvas")({
  head: () => ({
    meta: [
      { title: "Project Canvas — Buildify Workflow" },
      {
        name: "description",
        content:
          "Upload a blueprint, assign materials, review AI design suggestions and visualise your furniture in 3D.",
      },
      { property: "og:title", content: "Project Canvas — Buildify" },
      { property: "og:description", content: "The Buildify furniture creation and manufacturing workflow." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Canvas,
});
