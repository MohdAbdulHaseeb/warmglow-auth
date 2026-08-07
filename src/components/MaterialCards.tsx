import { motion } from "motion/react";
import { Star, Leaf } from "lucide-react";
import { materials } from "@/lib/dashboard-data";

export function MaterialCards() {
  return (
    <ul className="space-y-3">
      {materials.map((m, i) => (
        <motion.li
          key={m.id}
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.07 }}
          whileHover={{ y: -3 }}
          className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4 rounded-[18px] border border-border bg-white/[0.03] p-3 sm:flex sm:justify-between"
        >
          <div className="flex min-w-0 items-center gap-4">
            <span
              className="size-14 shrink-0 rounded-2xl"
              style={{ background: m.tone }}
              aria-hidden
            />
            <div className="min-w-0">
              <p className="truncate font-medium">{m.name}</p>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1 text-highlight">
                  <Star size={12} fill="currentColor" aria-hidden /> {m.rating}
                </span>
                <span>{m.price}</span>
                <span className="inline-flex items-center gap-1 text-success">
                  <Leaf size={12} aria-hidden /> {m.sustainability}% sustainable
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            className="col-span-2 shrink-0 rounded-2xl border border-accent/40 px-4 py-2 text-sm text-accent transition-colors hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:col-span-1"
          >
            Select Material
          </button>
        </motion.li>
      ))}
    </ul>
  );
}
