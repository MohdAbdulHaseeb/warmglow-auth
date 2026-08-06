import { motion } from "motion/react";
import { BrainCircuit, Layers, LineChart, Sparkles } from "lucide-react";
import logo from "@/assets/logo.svg";

const features = [
  { icon: BrainCircuit, title: "AI Blueprint Analysis", copy: "Parse drawings into parts in seconds." },
  { icon: Layers, title: "Material Intelligence", copy: "Optimal boards, edges and hardware." },
  { icon: LineChart, title: "Manufacturing Dashboard", copy: "Track every job from cut to crate." },
  { icon: Sparkles, title: "AI Room Visualization", copy: "See the build before you build it." },
];

/** Brand + value-proposition panel shown beside the auth card. */
export function AuthHeader() {
  return (
    <div className="flex h-full flex-col justify-center gap-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-3">
          <img src={logo} alt="" width={44} height={44} className="rounded-2xl" />
          <span className="font-display text-xl font-semibold tracking-tight">Buildify</span>
        </div>
        <h1 className="max-w-md text-4xl font-semibold leading-[1.1] lg:text-5xl">
          Build Smarter{" "}
          <span className="bg-gradient-to-r from-accent to-highlight bg-clip-text text-transparent">
            with AI
          </span>
        </h1>
        <p className="max-w-md text-base text-secondary-foreground">
          Transform furniture blueprints into intelligent manufacturing workflows.
        </p>
      </motion.div>

      <div className="grid max-w-lg grid-cols-1 gap-3 sm:grid-cols-2">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 + i * 0.09 }}
            whileHover={{ y: -4 }}
            className="glass-panel rounded-2xl p-4"
          >
            <feature.icon size={20} className="text-accent" aria-hidden />
            <p className="mt-3 text-sm font-medium text-foreground">{feature.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">{feature.copy}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
