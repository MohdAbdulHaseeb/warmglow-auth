import { motion } from "motion/react";

export function SocialLogin({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4" role="separator" aria-label="or">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">or</span>
        <span className="h-px flex-1 bg-border" />
      </div>
      <motion.button
        type="button"
        onClick={onClick}
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.99 }}
        className="flex w-full items-center justify-center gap-3 rounded-2xl border border-primary/40 bg-transparent px-4 py-3 text-sm font-medium text-foreground transition-colors hover:border-primary hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
          <path
            fill="#EA4335"
            d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 3.2 14.7 2.2 12 2.2 6.9 2.2 2.8 6.4 2.8 11.5S6.9 20.8 12 20.8c5.8 0 9.6-4.1 9.6-9.8 0-.66-.07-1.16-.16-1.66H12Z"
          />
        </svg>
        {label}
      </motion.button>
    </div>
  );
}
