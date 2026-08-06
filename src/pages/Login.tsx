import { Link } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { AuthCard } from "@/components/AuthCard";
import { AuthInput } from "@/components/AuthInput";
import { PasswordInput } from "@/components/PasswordInput";
import { SocialLogin } from "@/components/SocialLogin";
import { SubmitButton } from "@/components/SubmitButton";
import { useAuthForm, isEmail } from "@/hooks/useAuthForm";

export default function Login() {
  const { values, errors, loading, success, setField, handleSubmit } = useAuthForm({
    initialValues: { email: "", password: "", remember: false },
    validate: (v) => ({
      email: !v.email ? "Email is required" : !isEmail(v.email) ? "Enter a valid email" : undefined,
      password: !v.password ? "Password is required" : undefined,
    }),
    // Placeholder — connect Lovable Cloud auth here later.
    onSubmit: async () => {
      await new Promise((resolve) => setTimeout(resolve, 900));
    },
  });

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to your Buildify workspace."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link to="/register" className="font-medium text-accent hover:text-highlight">
            Create Account
          </Link>
        </>
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
        <PasswordInput
          label="Password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={values.password}
          error={errors.password}
          onChange={(e) => setField("password", e.target.value)}
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex cursor-pointer items-center gap-2 text-secondary-foreground">
            <input
              type="checkbox"
              checked={values.remember}
              onChange={(e) => setField("remember", e.target.checked)}
              className="size-4 rounded border-border bg-input accent-primary focus-visible:ring-2 focus-visible:ring-ring"
            />
            Remember me
          </label>
          <Link to="/forgot-password" className="text-accent hover:text-highlight">
            Forgot password?
          </Link>
        </div>

        {errors.form ? (
          <p role="alert" className="text-sm text-destructive">
            {errors.form}
          </p>
        ) : null}

        <SubmitButton loading={loading} success={success} label="Sign In" />
      </form>

      <div className="mt-6">
        <SocialLogin label="Continue with Google" />
      </div>
    </AuthCard>
  );
}
