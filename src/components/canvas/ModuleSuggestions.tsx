import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, Sparkles, Check, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { formatCurrency, generateDesignSuggestions, reanalyzeBlueprint } from "@/lib/project-service";
import { resolveMaterial as getMaterial } from "@/lib/management-store";
import { patchProject, useProject } from "@/lib/project-store";

/** Module 3 — Optional AI design suggestion gallery. */
export function ModuleSuggestions() {
  const project = useProject();
  const [loading, setLoading] = useState(false);
  const [reanalyzing, setReanalyzing] = useState(false);
  const [progress, setProgress] = useState(0);

  const parts = project.analysis?.parts ?? [];
  const selectedDesign = project.suggestions.find((s) => s.id === project.selectedDesignId);

  const rerun = async () => {
    const base = project.initialAnalysis ?? project.analysis;
    if (!base) return;
    setReanalyzing(true);
    setProgress(0);
    try {
      const updated = await reanalyzeBlueprint(base, project.assignments, selectedDesign?.name, setProgress);
      patchProject({ analysis: updated, analysisUpdated: true, materialPreviewReady: true });
      toast.success("Analysis updated with your materials");
    } catch {
      toast.error("Re-analysis failed. Please try again.");
    } finally {
      setReanalyzing(false);
    }
  };

  const run = async () => {
    if (!project.analysis) return;
    setLoading(true);
    try {
      const suggestions = await generateDesignSuggestions(project.analysis, project.assignments);
      patchProject({ suggestions });
      toast.success("Design suggestions ready");
    } catch {
      toast.error("Could not generate design suggestions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-[18px] border border-border bg-foreground/[0.03] p-4 text-sm text-secondary-foreground">
        Generated from your blueprint analysis and assigned materials. Selecting a design is optional — you can continue
        with your current configuration.
      </div>

      {project.suggestions.length === 0 ? (
        <div className="grid place-items-center gap-3 rounded-[18px] border border-dashed border-border p-10 text-center">
          {loading ? (
            <>
              <Loader2 className="animate-spin text-accent" aria-hidden />
              <p className="text-sm text-secondary-foreground">Generating Design Suggestions…</p>
            </>
          ) : (
            <>
              <p className="text-sm font-medium">No suggestions yet</p>
              <button
                type="button"
                onClick={() => void run()}
                className="ember-gradient inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Sparkles size={15} aria-hidden /> Generate Suggestions
              </button>
              <p className="text-xs text-muted-foreground">
                Placeholder output — no image model is connected yet.
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <AnimatePresence>
            {project.suggestions.map((s, i) => {
              const isSelected = project.selectedDesignId === s.id;
              return (
                <motion.article
                  key={s.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ y: -4 }}
                  className={`overflow-hidden rounded-[18px] border transition-colors ${
                    isSelected ? "border-accent bg-accent/[0.07]" : "border-border bg-foreground/[0.03]"
                  }`}
                >
                  <div className="relative h-36 w-full" style={{ background: s.tone }} aria-hidden>
                    {isSelected && (
                      <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-background/70 px-2.5 py-1 text-[11px] text-accent backdrop-blur">
                        <Check size={12} /> Selected
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-semibold">{s.name}</h3>
                    <p className="mt-1 text-xs text-secondary-foreground">{s.description}</p>
                    <p className="mt-2 text-xs text-muted-foreground">Materials: {s.materials}</p>
                    <button
                      type="button"
                      onClick={() => {
                        patchProject({ selectedDesignId: isSelected ? null : s.id });
                        toast.success(isSelected ? "Design deselected" : `${s.name} selected`);
                      }}
                      className={`mt-3 w-full rounded-2xl px-3 py-2 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                        isSelected
                          ? "border border-accent/40 text-accent hover:bg-accent/10"
                          : "ember-gradient text-primary-foreground"
                      }`}
                    >
                      {isSelected ? "Deselect" : "Select Design"}
                    </button>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* AI re-analysis + updated 2D preview */}
      <div className="rounded-[18px] border border-border bg-foreground/[0.03] p-5">
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold">AI Re-analysis</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Re-runs the analysis using your blueprint, assigned materials and selected design. The updated results
              replace the initial analysis.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void rerun()}
            disabled={reanalyzing || !project.analysis}
            className="ember-gradient ember-glow inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {reanalyzing ? <Loader2 size={15} className="animate-spin" aria-hidden /> : <RefreshCw size={15} aria-hidden />}
            {reanalyzing ? "Re-analyzing Blueprint…" : "Run AI Re-analysis"}
          </button>
        </div>

        {reanalyzing && (
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-foreground/10">
            <motion.div className="ember-gradient h-full rounded-full" animate={{ width: `${progress}%` }} />
          </div>
        )}

        {project.analysisUpdated && project.analysis && !reanalyzing && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-accent/40 bg-accent/[0.06] p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Updated Analysis</p>
              <p className="mt-2 text-sm">
                Confidence <span className="font-semibold text-success">{project.analysis.confidence}%</span>
              </p>
              <p className="mt-1 text-sm text-secondary-foreground">{project.analysis.furniture}</p>
              <p className="mt-2 text-sm">
                Material Cost{" "}
                <span className="font-semibold text-accent">{formatCurrency(project.analysis.cost)}</span>
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-background/40 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Updated 2D Preview</p>
              {project.assignments.length === 0 ? (
                <p className="mt-3 text-xs text-muted-foreground">No materials assigned.</p>
              ) : (
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {project.assignments.map((a) => {
                    const material = getMaterial(a.materialId);
                    const part = parts.find((p) => p.id === a.partId);
                    return (
                      <div key={a.partId} className="overflow-hidden rounded-xl border border-border">
                        <div className="h-12 w-full" style={{ background: material?.swatch }} aria-hidden />
                        <div className="p-2">
                          <p className="truncate text-[11px] font-medium">{part?.label}</p>
                          <p className="truncate text-[11px] text-muted-foreground">{material?.name}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
