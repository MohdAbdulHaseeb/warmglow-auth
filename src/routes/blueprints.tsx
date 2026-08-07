import { createFileRoute } from "@tanstack/react-router";
import Blueprint from "@/pages/Blueprint";

export const Route = createFileRoute("/blueprints")({
  head: () => ({
    meta: [
      { title: "Blueprint Analysis — Buildify" },
      {
        name: "description",
        content: "Upload furniture blueprints and get AI-detected items, materials and cost estimates.",
      },
      { property: "og:title", content: "Blueprint Analysis — Buildify" },
      {
        property: "og:description",
        content: "AI takeoff for furniture blueprints with confidence scoring.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Blueprint,
});
