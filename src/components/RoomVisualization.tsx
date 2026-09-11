import { useState } from "react";
import { motion } from "motion/react";
import { Sparkles, Loader2 } from "lucide-react";

function Frame({ label, tone }: { label: string; tone: string }) {
  return (
    <div className="relative overflow-hidden rounded-[18px] border border-border" style={{ background: tone }}>
      <div className="aspect-[4/3] w-full" aria-hidden />
      <span className="absolute left-3 top-3 rounded-full bg-surface/80 px-3 py-1 text-xs backdrop-blur-md">
        {label}
      </span>
    </div>
  );
}

export function RoomVisualization() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Frame label="Before" tone="var(--gradient-preview)" />
        <div className="relative">
          <Frame label="After" tone="var(--gradient-canvas)" />
          {loading && (
            <div className="absolute inset-0 grid place-items-center rounded-[18px] bg-background/75 backdrop-blur-sm">
              <Loader2 className="animate-spin text-highlight" aria-hidden />
            </div>
          )}
        </div>
      </div>
      <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          setLoading(true);
          setTimeout(() => setLoading(false), 1800);
        }}
        className="ember-gradient inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Sparkles size={16} aria-hidden />
        {loading ? "Generating…" : "Generate AI Preview"}
      </motion.button>
    </div>
  );
}
