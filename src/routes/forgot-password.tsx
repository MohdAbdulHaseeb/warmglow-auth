import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { AuthCard } from "@/components/AuthCard";
import { AuthInput } from "@/components/AuthInput";
import { SubmitButton } from "@/components/SubmitButton";
import { useAuthForm, isEmail } from "@/hooks/useAuthForm";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset Password — Buildify" },
      {
        name: "description",
        content: "Request a password reset link for your Buildify account.",
      },
      { property: "og:title", content: "Reset Password — Buildify" },
      { property: "og:description", content: "Recover access to your Buildify workspace." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ForgotPassword,
});

function ForgotPassword() {
  const { values, errors, loading, success, setField, handleSubmit } = useAuthForm({
    initialValues: { email: "" },
    validate: (v) => ({
      email: !v.email ? "Email is required" : !isEmail(v.email) ? "Enter a valid email" : undefined,
    }),
    onSubmit: async () => {
      await new Promise((resolve) => setTimeout(resolve, 900));
    },
  });

  return (
    <AuthCard
      title="Reset your password"
      subtitle="We'll email you a secure reset link."
      footer={
        <Link to="/" className="font-medium text-accent hover:text-highlight">
          Back to Sign In
        </Link>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <AuthInput
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@studio.com"
          icon={<Mail size={18} aria-hidden />}
          value={values.email}
          error={errors.email}
          onChange={(e) => setField("email", e.target.value)}
        />
        <SubmitButton loading={loading} success={success} label="Send Reset Link" />
      </form>
    </AuthCard>
  );
}
