import { forwardRef, useId, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
  error?: string;
  trailing?: ReactNode;
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(function AuthInput(
  { label, icon, error, trailing, className, id, onFocus, onBlur, ...props },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const errorId = `${inputId}-error`;
  const [focused, setFocused] = useState(false);

  return (
    <div className="space-y-2">
      <label htmlFor={inputId} className="block text-sm font-medium text-secondary-foreground">
        {label}
      </label>
      <motion.div
        animate={{
          boxShadow: focused ? "var(--shadow-glow)" : "0 0 0 0 transparent",
          borderColor: error
            ? "var(--destructive)"
            : focused
              ? "var(--primary)"
              : "var(--border)",
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="flex items-center gap-3 rounded-2xl border bg-input/40 px-4 py-3 backdrop-blur-xl"
      >
        {icon ? (
          <span className={cn("shrink-0", focused ? "text-accent" : "text-muted-foreground")}>
            {icon}
          </span>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          className={cn(
            "w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none",
            className,
          )}
          {...props}
        />
        {trailing}
      </motion.div>
      {error ? (
        <p id={errorId} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
});
