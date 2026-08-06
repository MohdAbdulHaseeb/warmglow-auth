import { Link } from "@tanstack/react-router";
import { Mail, User } from "lucide-react";
import { AuthCard } from "@/components/AuthCard";
import { AuthInput } from "@/components/AuthInput";
import { PasswordInput } from "@/components/PasswordInput";
import { SocialLogin } from "@/components/SocialLogin";
import { SubmitButton } from "@/components/SubmitButton";
import { useAuthForm, isEmail } from "@/hooks/useAuthForm";

export default function Register() {
  const { values, errors, loading, success, setField, handleSubmit } = useAuthForm({
    initialValues: { name: "", email: "", password: "", confirm: "", terms: false },
    validate: (v) => ({
      name: !v.name ? "Full name is required" : undefined,
      email: !v.email ? "Email is required" : !isEmail(v.email) ? "Enter a valid email" : undefined,
      password:
        v.password.length < 8 ? "Password must be at least 8 characters" : undefined,
      confirm: v.confirm !== v.password ? "Passwords do not match" : undefined,
      terms: !v.terms ? "Please accept the Terms & Conditions" : undefined,
    }),
    // Placeholder — connect Lovable Cloud auth here later.
    onSubmit: async () => {
      await new Promise((resolve) => setTimeout(resolve, 900));
    },
  });

  return (
    <AuthCard
      title="Create your account"
      subtitle="Start turning blueprints into production plans."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/" className="font-medium text-accent hover:text-highlight">
            Sign In
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <AuthInput
          label="Full Name"
          autoComplete="name"
          placeholder="Ada Carpenter"
          icon={<User size={18} aria-hidden />}
          value={values.name}
          error={errors.name}
          onChange={(e) => setField("name", e.target.value)}
        />
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
          autoComplete="new-password"
          placeholder="At least 8 characters"
          value={values.password}
          error={errors.password}
          onChange={(e) => setField("password", e.target.value)}
        />
        <PasswordInput
          label="Confirm Password"
          autoComplete="new-password"
          placeholder="Repeat your password"
          value={values.confirm}
          error={errors.confirm}
          onChange={(e) => setField("confirm", e.target.value)}
        />

        <div className="space-y-1">
          <label className="flex cursor-pointer items-start gap-2 text-sm text-secondary-foreground">
            <input
              type="checkbox"
              checked={values.terms}
              onChange={(e) => setField("terms", e.target.checked)}
              className="mt-0.5 size-4 rounded border-border bg-input accent-primary focus-visible:ring-2 focus-visible:ring-ring"
            />
            I agree to the Terms &amp; Conditions
          </label>
          {errors.terms ? (
            <p role="alert" className="text-xs text-destructive">
              {errors.terms}
            </p>
          ) : null}
        </div>

        {errors.form ? (
          <p role="alert" className="text-sm text-destructive">
            {errors.form}
          </p>
        ) : null}

        <SubmitButton loading={loading} success={success} label="Create Account" />
      </form>

      <div className="mt-6">
        <SocialLogin label="Sign up with Google" />
      </div>
    </AuthCard>
  );
}
