import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Loader2, ScanLine, Layers3, CircleCheck } from "lucide-react";
import { toast } from "sonner";
import { FileDropzone } from "@/components/canvas/FileDropzone";
import { analyzeBlueprint, formatCurrency } from "@/lib/project-service";
import { patchProject, useProject } from "@/lib/project-store";

/** Module 1 — Blueprint upload and (mock) AI analysis. */
export function ModuleBlueprint() {
  const project = useProject();
  const [progress, setProgress] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);

  const runAnalysis = async () => {
    if (!project.blueprint || analyzing) return;
    setAnalyzing(true);
    setProgress(0);
    try {
      const analysis = await analyzeBlueprint(project.blueprint, setProgress);
      patchProject({
        analysis,
        initialAnalysis: analysis,
        analysisUpdated: false,
        assignments: [],
        materialPreviewReady: false,
        suggestions: [],
      });

      toast.success(`Analysis complete · ${analysis.parts.length} parts detected`);
    } catch {
      toast.error("AI analysis failed. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <FileDropzone
        file={project.blueprint}
        onFile={(file) =>
          patchProject({ blueprint: file, analysis: null, assignments: [], materialPreviewReady: false, suggestions: [] })
        }
        onRemove={() =>
          patchProject({ blueprint: null, analysis: null, assignments: [], materialPreviewReady: false, suggestions: [] })
        }
      />

      {project.blueprint && !project.analysis && (
        <div className="flex flex-col items-start gap-3">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => void runAnalysis()}
            disabled={analyzing}
            className="ember-gradient ember-glow inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {analyzing ? <Loader2 size={16} className="animate-spin" aria-hidden /> : <Sparkles size={16} aria-hidden />}
            {analyzing ? "Analyzing Blueprint…" : "Analyze Blueprint"}
          </motion.button>

          <AnimatePresence>
            {analyzing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="w-full max-w-md"
              >
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="text-secondary-foreground">Analyzing Blueprint…</span>
                  <span className="text-accent">{progress}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-foreground/10">
                  <motion.div className="ember-gradient h-full rounded-full" animate={{ width: `${progress}%` }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {project.analysis && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
          >
            <div className="rounded-[18px] border border-border bg-foreground/[0.03] p-5">
              <div className="flex flex-wrap items-center gap-2 text-accent">
                <ScanLine size={16} aria-hidden />
                <h3 className="text-sm font-semibold">Analysis Result</h3>
                {project.analysisUpdated && (
                  <span className="rounded-full bg-accent/15 px-2.5 py-1 text-xs text-accent">Analysis Updated</span>
                )}
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="uppercase tracking-wide text-muted-foreground">AI Confidence</span>
                  <span className="font-semibold text-success">{project.analysis.confidence}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-foreground/10">
                  <motion.div
                    className="ember-gradient h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${project.analysis.confidence}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </div>

              <p className="mt-4 text-xs uppercase tracking-wide text-muted-foreground">Detected Items</p>
              <p className="text-xl font-semibold">{project.analysis.furniture}</p>
              <p className="mt-4 text-xs uppercase tracking-wide text-muted-foreground">Estimated Material Cost</p>
              <p className="text-xl font-semibold text-accent">{formatCurrency(project.analysis.cost)}</p>
              <p className="mt-4 text-xs uppercase tracking-wide text-muted-foreground">Design structure</p>
              <p className="mt-1 text-sm text-secondary-foreground">{project.analysis.structure}</p>
              <p className="mt-4 text-xs uppercase tracking-wide text-muted-foreground">Characteristics</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {project.analysis.characteristics.map((c) => (
                  <li key={c} className="rounded-full border border-border px-3 py-1 text-xs text-secondary-foreground">
                    {c}
                  </li>
                ))}
              </ul>
            </div>


            <div className="rounded-[18px] border border-border bg-foreground/[0.03] p-5">
              <div className="flex items-center gap-2 text-accent">
                <Layers3 size={16} aria-hidden />
                <h3 className="text-sm font-semibold">Detected Parts &amp; Material Areas</h3>
              </div>
              <ul className="mt-4 space-y-2">
                {project.analysis.parts.map((part, i) => (
                  <motion.li
                    key={part.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-2xl border border-border bg-background/30 px-3 py-2"
                  >
                    <CircleCheck size={15} className="text-success" aria-hidden />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{part.label}</p>
                      <p className="truncate text-xs text-muted-foreground">{part.note}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-muted-foreground">
                These parts become the assignable material areas in the next module.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
