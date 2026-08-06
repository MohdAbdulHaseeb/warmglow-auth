import { motion } from "motion/react";
import { useMemo } from "react";

/** Ambient warm-ember canvas: glowing orbs, blueprint grid and floating embers. */
export function AnimatedBackground() {
  const embers = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: (i * 37) % 100,
        size: 2 + ((i * 7) % 5),
        delay: (i % 9) * 0.9,
        duration: 12 + ((i * 3) % 9),
        drift: ((i % 5) - 2) * 24,
      })),
    [],
  );

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(circle at 30% 40%, black, transparent 75%)",
        }}
      />
      <motion.div
        className="absolute -left-32 top-1/4 h-[28rem] w-[28rem] rounded-full blur-[120px]"
        style={{ background: "var(--gradient-ember)", opacity: 0.28 }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.22, 0.34, 0.22] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-24 bottom-0 h-[24rem] w-[24rem] rounded-full blur-[140px]"
        style={{ background: "var(--highlight)", opacity: 0.14 }}
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
      />
      {embers.map((e) => (
        <motion.span
          key={e.id}
          className="absolute bottom-[-4rem] rounded-full bg-highlight"
          style={{ left: `${e.left}%`, width: e.size, height: e.size, filter: "blur(0.5px)" }}
          animate={{ y: [0, -900], x: [0, e.drift], opacity: [0, 0.8, 0] }}
          transition={{
            duration: e.duration,
            delay: e.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}
