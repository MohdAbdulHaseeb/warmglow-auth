import { motion } from "motion/react";
import { activityFeed } from "@/lib/dashboard-data";

export function ActivityTimeline() {
  return (
    <ol className="relative space-y-5 pl-5">
      <span className="absolute left-1.5 top-1 h-[calc(100%-0.5rem)] w-px bg-border" aria-hidden />
      {activityFeed.map((item, i) => (
        <motion.li
          key={item.id}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: i * 0.07 }}
          className="relative"
        >
          <span className="ember-gradient absolute -left-[1.13rem] top-1.5 size-2.5 rounded-full" aria-hidden />
          <p className="text-sm font-medium">{item.title}</p>
          <p className="truncate text-xs text-muted-foreground">{item.detail}</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground/70">{item.time}</p>
        </motion.li>
      ))}
    </ol>
  );
}
