import { motion } from "motion/react";
import { Check } from "lucide-react";
import { manufacturingStages } from "@/lib/dashboard-data";

export function ManufacturingTimeline() {
  const doneCount = manufacturingStages.filter((s) => s.done).length;
  const percent = ((doneCount - 0.5) / manufacturingStages.length) * 100;

  return (
    <div className="relative">
      <div className="absolute left-4 top-0 h-full w-px bg-border md:left-0 md:top-5 md:h-px md:w-full" aria-hidden />
      <motion.div
        className="ember-gradient absolute left-4 top-0 w-px md:left-0 md:top-5 md:h-px"
        initial={{ height: 0, width: 1 }}
        whileInView={{ height: `${percent}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: "easeOut" }}
        aria-hidden
      />
      <ol className="relative grid gap-5 md:grid-cols-6 md:gap-3">
        {manufacturingStages.map((stage, i) => (
          <motion.li
            key={stage.label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="flex items-start gap-3 md:block"
          >
            <span
              className={`grid size-8 shrink-0 place-items-center rounded-full border text-xs md:mb-3 ${
                stage.done
                  ? "ember-gradient border-transparent text-primary-foreground"
                  : "border-border bg-secondary text-muted-foreground"
              }`}
            >
              {stage.done ? <Check size={14} aria-hidden /> : i + 1}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{stage.label}</p>
              <p className="text-xs text-muted-foreground">{stage.detail}</p>
            </div>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
