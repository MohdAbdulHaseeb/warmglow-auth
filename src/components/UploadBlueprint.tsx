import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { UploadCloud, FileText, Gauge, Sofa, IndianRupee, Loader2 } from "lucide-react";

export function UploadBlueprint() {
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);

  const runAnalysis = () => {
    if (analyzing) return;
    setAnalyzing(true);
    setProgress(0);
    const id = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(id);
          setAnalyzing(false);
          return 100;
        }
        return p + 4;
      });
    }, 60);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            runAnalysis();
          }}
          className={`grid place-items-center rounded-[18px] border-2 border-dashed p-8 text-center transition-colors ${
            dragging ? "border-accent bg-accent/10" : "border-border bg-white/[0.02]"
          }`}
        >
          <motion.span
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="ember-gradient grid size-12 place-items-center rounded-2xl text-primary-foreground"
          >
            <UploadCloud size={22} aria-hidden />
          </motion.span>
          <p className="mt-4 text-sm font-medium">Drag & drop your blueprint here</p>
          <p className="mt-1 text-xs text-muted-foreground">PDF, DWG or PNG up to 50MB</p>
          <button
            type="button"
            onClick={runAnalysis}
            className="ember-gradient mt-4 rounded-2xl px-4 py-2 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Upload PDF
          </button>
        </div>

        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-border bg-white/[0.03] p-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent/15 text-accent">
            <FileText size={18} aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm">skyline-loft-v4.pdf</p>
            <p className="text-xs text-muted-foreground">Preview placeholder · 12 pages</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-secondary-foreground">AI Analysis Progress</span>
            <span className="text-accent">{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="ember-gradient h-full rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.2 }}
            />
          </div>
          <AnimatePresence>
            {analyzing && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-2 flex items-center gap-2 text-xs text-muted-foreground"
              >
                <Loader2 size={13} className="animate-spin" aria-hidden /> Detecting furniture geometry…
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { label: "Confidence", value: "94%", icon: Gauge },
            { label: "Detected Items", value: "18", icon: Sofa },
            { label: "Material Cost", value: "₹2.4L", icon: IndianRupee },
          ].map((m) => (
            <div key={m.label} className="rounded-2xl border border-border bg-white/[0.03] p-3">
              <m.icon size={16} className="text-highlight" aria-hidden />
              <p className="mt-2 text-lg font-semibold">{m.value}</p>
              <p className="text-xs text-muted-foreground">{m.label}</p>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="w-full rounded-2xl border border-border bg-white/[0.03] py-2.5 text-sm text-secondary-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Generate Report
        </button>
      </div>
    </div>
  );
}
