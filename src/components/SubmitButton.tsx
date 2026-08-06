import { motion } from "motion/react";
import { Check, Loader2 } from "lucide-react";

export function SubmitButton({
  loading,
  success,
  label,
}: {
  loading: boolean;
  success: boolean;
  label: string;
}) {
  return (
    <motion.button
      type="submit"
      disabled={loading || success}
      whileHover={{ scale: loading || success ? 1 : 1.03 }}
      whileTap={{ scale: 0.98 }}
      className="ember-gradient ember-glow flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-primary-foreground transition-[filter] hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-80"
    >
      {loading ? <Loader2 size={18} className="animate-spin" aria-hidden /> : null}
      {success ? <Check size={18} aria-hidden /> : null}
      {success ? "Success" : label}
    </motion.button>
  );
}
