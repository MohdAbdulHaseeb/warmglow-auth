import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { AuthInput, type AuthInputProps } from "./AuthInput";

export function PasswordInput(props: Omit<AuthInputProps, "type" | "icon" | "trailing">) {
  const [visible, setVisible] = useState(false);

  return (
    <AuthInput
      {...props}
      type={visible ? "text" : "password"}
      icon={<Lock size={18} aria-hidden />}
      trailing={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="rounded-md p-1 text-muted-foreground transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {visible ? <EyeOff size={18} aria-hidden /> : <Eye size={18} aria-hidden />}
        </button>
      }
    />
  );
}
