import type { ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface SectionCardProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** Reusable glass section wrapper with a fade/slide entrance. */
export function SectionCard({ title, description, action, children, className }: SectionCardProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn("glass-panel rounded-[18px] p-5 sm:p-6", className)}
    >
      <header className="mb-5 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold sm:text-lg">{title}</h2>
          {description && (
            <p className="mt-1 truncate text-xs text-muted-foreground sm:text-sm">{description}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </header>
      {children}
    </motion.section>
  );
}
