import { createFileRoute } from "@tanstack/react-router";
import Settings from "@/pages/Settings";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Buildify" },
      {
        name: "description",
        content: "Manage your Buildify profile, workspace preferences, subscription and alerts.",
      },
      { property: "og:title", content: "Settings — Buildify" },
      {
        property: "og:description",
        content: "Profile, preferences and notification settings for your Buildify workspace.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Settings,
});
