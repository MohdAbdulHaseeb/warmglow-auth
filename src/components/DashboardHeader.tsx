import { motion } from "motion/react";
import { Upload, FolderPlus, Sparkles, ReceiptText } from "lucide-react";

const quickActions = [
  { label: "Upload Blueprint", icon: Upload, primary: true },
  { label: "New Project", icon: FolderPlus },
  { label: "Generate Room", icon: Sparkles },
  { label: "Create Bill", icon: ReceiptText },
];

export function DashboardHeader() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center"
    >
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold sm:text-3xl lg:text-4xl">
          Welcome back, Mohammed <span aria-hidden>👋</span>
        </h1>
        <p className="mt-2 max-w-xl text-sm text-secondary-foreground sm:text-base">
          Manage your AI-powered furniture projects and manufacturing workflow.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {quickActions.map((action) => (
          <motion.button
            key={action.label}
            type="button"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={
              action.primary
                ? "ember-gradient ember-glow inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                : "inline-flex items-center gap-2 rounded-2xl border border-border bg-white/[0.03] px-4 py-2.5 text-sm text-secondary-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            }
          >
            <action.icon size={16} aria-hidden />
            {action.label}
          </motion.button>
        ))}
      </div>
    </motion.section>
  );
}
