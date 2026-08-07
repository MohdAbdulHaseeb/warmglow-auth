import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { TrendingUp, type LucideIcon } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  trend: string;
  icon: LucideIcon;
  spark: number[];
  delay?: number;
}

function useCountUp(target: number, run: boolean, decimals = 0) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!run) return;
    let frame = 0;
    const total = 48;
    const id = setInterval(() => {
      frame += 1;
      const p = 1 - Math.pow(1 - frame / total, 3);
      setValue(Number((target * p).toFixed(decimals)));
      if (frame >= total) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, [target, run, decimals]);
  return value;
}

function Spark({ points }: { points: number[] }) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const path = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * 100;
      const y = 28 - ((p - min) / (max - min || 1)) * 24;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg viewBox="0 0 100 32" preserveAspectRatio="none" className="h-8 w-24" aria-hidden>
      <motion.path
        d={path}
        fill="none"
        stroke="var(--highlight)"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
      />
    </svg>
  );
}

export function StatsCard({
  label,
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  trend,
  icon: Icon,
  spark,
  delay = 0,
}: StatsCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const count = useCountUp(value, inView, decimals);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay }}
      whileHover={{ y: -5 }}
      className="glass-panel rounded-[18px] p-5 transition-shadow hover:shadow-[var(--shadow-glow)]"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="ember-gradient grid size-10 shrink-0 place-items-center rounded-2xl text-primary-foreground">
          <Icon size={18} aria-hidden />
        </span>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-xs text-success">
          <TrendingUp size={12} aria-hidden />
          {trend}
        </span>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">{label}</p>
      <div className="mt-1 flex items-end justify-between gap-2">
        <p className="font-display text-2xl font-semibold sm:text-3xl">
          {prefix}
          {count.toLocaleString("en-IN", { minimumFractionDigits: decimals })}
          {suffix}
        </p>
        <Spark points={spark} />
      </div>
    </motion.div>
  );
}
