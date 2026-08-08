import { motion } from "motion/react";

export function DashboardHeader() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="min-w-0"
    >
      <h1 className="text-2xl font-semibold sm:text-3xl lg:text-4xl">
        Welcome back, Mohammed <span aria-hidden>👋</span>
      </h1>
      <p className="mt-2 max-w-xl text-sm text-secondary-foreground sm:text-base">
        Manage your AI-powered furniture projects and manufacturing workflow.
      </p>
    </motion.section>
  );
}
