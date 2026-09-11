import { motion } from "motion/react";
import {
  Upload,
  FolderPlus,
  Sparkles,
  Layers,
  ReceiptText,
  Users,
  BarChart3,
  Settings,
} from "lucide-react";

const actions = [
  { label: "Upload Blueprint", icon: Upload },
  { label: "Create Project", icon: FolderPlus },
  { label: "Generate AI Room", icon: Sparkles },
  { label: "Material Library", icon: Layers },
  { label: "Generate Bill", icon: ReceiptText },
  { label: "Assign Workers", icon: Users },
  { label: "Analytics", icon: BarChart3 },
  { label: "Settings", icon: Settings },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {actions.map((a, i) => (
        <motion.button
          key={a.label}
          type="button"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
          whileHover={{ y: -4, scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="group grid aspect-square place-items-center gap-2 rounded-[18px] border border-border bg-surface p-3 text-center transition-colors hover:border-accent/40 hover:bg-selected focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="grid size-11 place-items-center rounded-2xl bg-accent/12 text-accent transition-colors group-hover:bg-accent/20">
            <a.icon size={19} aria-hidden />
          </span>
          <span className="text-xs text-secondary-foreground group-hover:text-foreground">{a.label}</span>
        </motion.button>
      ))}
    </div>
  );
}
