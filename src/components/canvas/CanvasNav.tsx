import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, ReceiptText } from "lucide-react";

interface CanvasNavProps {
  onPrevious: () => void;
  onNext: () => void;
  previousDisabled?: boolean;
  nextDisabled?: boolean;
  nextLabel?: string;
  isFinal?: boolean;
  hint?: string;
}

/** Bottom Previous / Next (or Generate Bill) navigation bar. */
export function CanvasNav({
  onPrevious,
  onNext,
  previousDisabled,
  nextDisabled,
  nextLabel = "Next",
  isFinal = false,
  hint,
}: CanvasNavProps) {
  return (
    <div className="glass-panel sticky bottom-4 z-20 rounded-[18px] p-3 sm:p-4">
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <p className="order-2 min-w-0 text-xs text-muted-foreground sm:order-1">{hint}</p>
        <div className="order-1 grid grid-cols-2 gap-3 sm:order-2 sm:flex">
          <button
            type="button"
            onClick={onPrevious}
            disabled={previousDisabled}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border px-5 py-2.5 text-sm text-secondary-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowLeft size={15} aria-hidden /> Previous
          </button>
          <motion.button
            type="button"
            whileHover={nextDisabled ? {} : { scale: 1.02 }}
            whileTap={nextDisabled ? {} : { scale: 0.98 }}

            disabled={nextDisabled}
            className="ember-gradient ember-glow inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {isFinal ? <ReceiptText size={15} aria-hidden /> : null}
            {nextLabel}
            {!isFinal && <ArrowRight size={15} aria-hidden />}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
