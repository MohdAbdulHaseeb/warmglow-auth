import { motion } from "motion/react";
import { Crown } from "lucide-react";

function Meter({ label, value, caption }: { label: string; value: number; caption: string }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="text-secondary-foreground">{label}</span>
        <span className="text-muted-foreground">{caption}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="ember-gradient h-full rounded-full"
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

export function ProfileCard() {
  return (
    <div className="space-y-5">
      <div className="flex min-w-0 items-center gap-3">
        <span className="ember-gradient grid size-14 shrink-0 place-items-center rounded-2xl font-display text-lg font-semibold text-primary-foreground">
          MA
        </span>
        <div className="min-w-0">
          <p className="truncate font-medium">Mohammed Abdul Haseeb</p>
          <p className="text-xs text-muted-foreground">Administrator</p>
        </div>
      </div>

      <Meter label="Profile Completion" value={82} caption="82%" />
      <Meter label="Storage Usage" value={64} caption="32 GB of 50 GB" />

      <div className="flex items-center justify-between rounded-2xl border border-highlight/25 bg-highlight/[0.07] p-3">
        <span className="flex items-center gap-2 text-sm">
          <Crown size={16} className="text-highlight" aria-hidden /> Studio Pro
        </span>
        <button
          type="button"
          className="rounded-xl border border-border px-3 py-1.5 text-xs text-secondary-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Manage
        </button>
      </div>
    </div>
  );
}
