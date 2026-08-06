import { createFileRoute } from "@tanstack/react-router";
import Login from "@/pages/Login";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sign In — Buildify AI Blueprint Platform" },
      {
        name: "description",
        content:
          "Sign in to Buildify to turn furniture blueprints into intelligent manufacturing workflows with AI.",
      },
      { property: "og:title", content: "Sign In — Buildify" },
      {
        property: "og:description",
        content: "Access your Buildify workspace for AI blueprint analysis and manufacturing.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Login,
});
