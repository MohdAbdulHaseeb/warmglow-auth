import { motion } from "motion/react";
import { notifications } from "@/lib/dashboard-data";

export function Notifications() {
  return (
    <ul className="space-y-3">
      {notifications.map((n, i) => (
        <motion.li
          key={n.id}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: i * 0.06 }}
          className={`rounded-2xl border p-3 transition-colors ${
            n.unread ? "border-accent/30 bg-accent/[0.07]" : "border-border bg-white/[0.02]"
          }`}
        >
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
            <p className="truncate text-sm font-medium">{n.title}</p>
            <span className="shrink-0 text-[11px] text-muted-foreground">{n.time}</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{n.detail}</p>
        </motion.li>
      ))}
    </ul>
  );
}
