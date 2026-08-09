import { motion } from "motion/react";
import { Check } from "lucide-react";

export const canvasSteps = [
  { id: 1, label: "Blueprint" },
  { id: 2, label: "Materials" },
  { id: 3, label: "AI Suggestions" },
  { id: 4, label: "3D Visualization" },
] as const;

interface StepIndicatorProps {
  current: number;
  completed: number[];
  onSelect: (step: number) => void;
}

/** Horizontal (desktop) / vertical (mobile) Canvas progress indicator. */
export function StepIndicator({ current, completed, onSelect }: StepIndicatorProps) {
  return (
    <nav aria-label="Canvas progress" className="glass-panel rounded-[18px] p-4 sm:p-5">
      <ol className="grid gap-3 sm:grid-cols-4 sm:gap-2">
        {canvasSteps.map((step, i) => {
          const isDone = completed.includes(step.id);
          const isActive = current === step.id;
          const reachable = isDone || isActive || completed.includes(step.id - 1);
          return (
            <li key={step.id} className="min-w-0">
              <button
                type="button"
                disabled={!reachable}
                onClick={() => reachable && onSelect(step.id)}
                aria-current={isActive ? "step" : undefined}
                className="group grid w-full grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-2xl px-2 py-2 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span
                  className={`grid size-9 shrink-0 place-items-center rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? "ember-gradient ember-glow text-primary-foreground"
                      : isDone
                        ? "bg-accent/20 text-accent"
                        : "border border-border text-muted-foreground"
                  }`}
                >
                  {isDone && !isActive ? <Check size={16} aria-hidden /> : step.id}
                </span>
                <span className="min-w-0">
                  <span
                    className={`block truncate text-sm font-medium ${isActive ? "text-foreground" : "text-secondary-foreground"}`}
                  >
                    {step.label}
                  </span>
                  {isActive && (
                    <motion.span
                      layoutId="canvas-step-underline"
                      className="ember-gradient mt-1 block h-0.5 w-12 rounded-full"
                    />
                  )}
                </span>
              </button>
              {i < canvasSteps.length - 1 && (
                <span className="ml-6 block h-3 w-px bg-border sm:hidden" aria-hidden />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
