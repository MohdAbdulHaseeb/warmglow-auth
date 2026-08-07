import { createFileRoute } from "@tanstack/react-router";
import Login from "@/pages/Login";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In — Buildify" },
      {
        name: "description",
        content: "Sign in to your Buildify workspace for AI blueprint analysis and manufacturing.",
      },
      { property: "og:title", content: "Sign In — Buildify" },
      {
        property: "og:description",
        content: "Access your Buildify AI furniture manufacturing workspace.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Login,
});
