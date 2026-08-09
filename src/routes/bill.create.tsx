import { createFileRoute } from "@tanstack/react-router";
import BillCreate from "@/pages/BillCreate";

export const Route = createFileRoute("/bill/create")({
  head: () => ({
    meta: [
      { title: "Create Bill — Buildify Quotation" },
      {
        name: "description",
        content: "Build a professional furniture quotation with materials, workers, GST and a locked final bill.",
      },
      { property: "og:title", content: "Create Bill — Buildify" },
      { property: "og:description", content: "Generate and confirm a professional furniture project quotation." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BillCreate,
});
