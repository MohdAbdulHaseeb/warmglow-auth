import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, Sparkles, Check } from "lucide-react";
import { toast } from "sonner";
import { generateDesignSuggestions } from "@/lib/project-service";
import { patchProject, useProject } from "@/lib/project-store";

/** Module 3 — Optional AI design suggestion gallery. */
export function ModuleSuggestions() {
  const project = useProject();
  const [loading, setLoading] = useState(false);

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
    </div>
  );
}
