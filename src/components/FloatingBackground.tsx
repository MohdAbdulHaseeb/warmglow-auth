import { motion } from "motion/react";

/** Soft ember gradient orbs behind the dashboard shell. */
export function FloatingBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.10]"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(circle at 40% 25%, black, transparent 78%)",
        }}
      />
      <motion.div
        className="absolute -left-40 top-0 h-[30rem] w-[30rem] rounded-full blur-[130px]"
        style={{ background: "var(--gradient-ember)", opacity: 0.22 }}
        animate={{ scale: [1, 1.12, 1], opacity: [0.16, 0.26, 0.16] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-32 bottom-10 h-[26rem] w-[26rem] rounded-full blur-[150px]"
        style={{ background: "var(--highlight)", opacity: 0.12 }}
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.08, 0.16, 0.08] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
