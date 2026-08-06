import { createFileRoute } from "@tanstack/react-router";
import Register from "@/pages/Register";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create Account — Buildify" },
      {
        name: "description",
        content:
          "Create a Buildify account to analyze furniture blueprints with AI and manage manufacturing workflows.",
      },
      { property: "og:title", content: "Create Account — Buildify" },
      {
        property: "og:description",
        content: "Join Buildify and build smarter with AI-powered blueprint analysis.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Register,
});
