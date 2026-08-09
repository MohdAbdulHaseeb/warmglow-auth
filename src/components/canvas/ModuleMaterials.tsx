import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, Loader2, Pencil, Trash2, Sparkles, Search, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { materialCatalog, materialCategories, getMaterial, type CatalogMaterial } from "@/lib/catalog";
import { formatCurrency, generateMaterialPreview } from "@/lib/project-service";
import { patchProject, useProject } from "@/lib/project-store";

/** Module 2 — Material library, part assignment and 2D material preview. */
export function ModuleMaterials() {
  const project = useProject();
  const parts = project.analysis?.parts ?? [];
  const [selected, setSelected] = useState<CatalogMaterial | null>(null);
  const [pendingParts, setPendingParts] = useState<string[]>([]);
  const [conflict, setConflict] = useState<{ partIds: string[]; material: CatalogMaterial } | null>(null);
  const [query, setQuery] = useState("");
  const [openCategory, setOpenCategory] = useState<string | null>("Wood");
  const [generating, setGenerating] = useState(false);
  const [editingPart, setEditingPart] = useState<string | null>(null);

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    return materialCategories.map((category) => ({
      category,
      items: materialCatalog.filter(
        (m) => m.category === category && (!q || m.name.toLowerCase().includes(q) || m.type.toLowerCase().includes(q)),
      ),
    }));
  }, [query]);

  const assignedMap = useMemo(
    () => Object.fromEntries(project.assignments.map((a) => [a.partId, a])),
    [project.assignments],
  );

  const commitAssignment = (material: CatalogMaterial, partIds: string[]) => {
    const next = project.assignments.filter((a) => !partIds.includes(a.partId));
    partIds.forEach((partId) => next.push({ partId, materialId: material.id, quantity: 1 }));
    patchProject({ assignments: next, materialPreviewReady: false, suggestions: [] });
    toast.success(`${material.name} assigned to ${partIds.length} part${partIds.length > 1 ? "s" : ""}`);
    setPendingParts([]);
    setSelected(null);
    setEditingPart(null);
  };

  const assign = () => {
    if (!selected || pendingParts.length === 0) {
      toast.error("Select at least one part to assign this material to.");
      return;
    }
    const clashing = pendingParts.filter((p) => assignedMap[p]);
    if (clashing.length > 0) {
      setConflict({ partIds: pendingParts, material: selected });
      return;
    }
    commitAssignment(selected, pendingParts);
  };

  const removeAssignment = (partId: string) => {
    patchProject({
      assignments: project.assignments.filter((a) => a.partId !== partId),
      materialPreviewReady: false,
      suggestions: [],
    });
    toast.success("Assignment removed");
  };

  const confirmMaterials = async () => {
    if (project.assignments.length === 0) {
      toast.error("Assign at least one material before confirming.");
      return;
    }
    setGenerating(true);
    try {
      const ok = await generateMaterialPreview(project.assignments);
      patchProject({ materialPreviewReady: ok });
      toast.success("2D material preview generated");
    } catch {
      toast.error("Preview generation failed. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  if (parts.length === 0) {
    return (
      <p className="rounded-[18px] border border-border bg-foreground/[0.03] p-6 text-sm text-secondary-foreground">
        Upload and analyse a blueprint in Module 1 to unlock material assignment.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        {/* LEFT — blueprint / furniture preview */}
        <div className="space-y-4">
          <div className="rounded-[18px] border border-border bg-foreground/[0.03] p-4">
            <h3 className="text-sm font-semibold">Blueprint Preview</h3>
            <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-background/40">
              {project.blueprint?.type.startsWith("image/") ? (
                <img
                  src={project.blueprint.dataUrl}
                  alt="Uploaded blueprint"
                  loading="lazy"
                  className="max-h-64 w-full object-contain"
                />
              ) : (
                <div className="grid h-48 place-items-center text-xs text-muted-foreground">
                  {project.blueprint?.name ?? "No blueprint"}
                </div>
              )}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              {project.analysis?.furniture} · {parts.length} assignable parts
            </p>
          </div>

          {/* 2D material visualization */}
          <div className="rounded-[18px] border border-border bg-foreground/[0.03] p-4">
            <h3 className="text-sm font-semibold">2D Material Visualization</h3>
            {generating ? (
              <div className="mt-3 grid h-56 place-items-center gap-3 rounded-2xl border border-border bg-background/40">
                <Loader2 className="animate-spin text-accent" aria-hidden />
                <p className="text-xs text-secondary-foreground">Generating 2D Material Preview…</p>
              </div>
            ) : project.materialPreviewReady ? (
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {project.assignments.map((a) => {
                  const part = parts.find((p) => p.id === a.partId);
                  const material = getMaterial(a.materialId);
                  return (
                    <motion.div
                      key={a.partId}
                      initial={{ opacity: 0, scale: 0.94 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="overflow-hidden rounded-2xl border border-border"
                    >
                      <div className="h-16 w-full" style={{ background: material?.swatch }} aria-hidden />
                      <div className="p-2">
                        <p className="truncate text-xs font-medium">{part?.label}</p>
                        <p className="truncate text-[11px] text-muted-foreground">{material?.name}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <p className="mt-3 rounded-2xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
                Confirm your materials to render the 2D preview. This is a visual mock until the AI image service is
                connected.
              </p>
            )}
          </div>
        </div>

        {/* RIGHT — material library */}
        <div className="space-y-4">
          <div className="rounded-[18px] border border-border bg-foreground/[0.03] p-4">
            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
              <h3 className="text-sm font-semibold">Material Library</h3>
              <label className="relative flex items-center">
                <Search size={14} className="absolute left-3 text-muted-foreground" aria-hidden />
                <span className="sr-only">Search materials</span>
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search materials…"
                  className="w-full rounded-2xl border border-border bg-input/40 py-2 pl-9 pr-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-56"
                />
              </label>
            </div>

            <div className="mt-4 space-y-2">
              {grouped.map(({ category, items }) => (
                <div key={category} className="rounded-2xl border border-border">
                  <button
                    type="button"
                    onClick={() => setOpenCategory((c) => (c === category ? null : category))}
                    className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-expanded={openCategory === category}
                  >
                    <span className="uppercase tracking-wide">{category}</span>
                    <span className="flex items-center gap-2 text-xs text-muted-foreground">
                      {items.length}
                      <ChevronDown
                        size={15}
                        className={`transition-transform ${openCategory === category ? "rotate-180" : ""}`}
                        aria-hidden
                      />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {openCategory === category && items.length > 0 && (
                      <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        {items.map((m) => (
                          <li
                            key={m.id}
                            className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3 border-t border-border p-3"
                          >
                            <span className="size-12 shrink-0 rounded-xl" style={{ background: m.swatch }} aria-hidden />
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-sm font-medium">{m.name}</p>
                                <span className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground">
                                  {m.type}
                                </span>
                                <span className="rounded-full bg-highlight/15 px-2 py-0.5 text-[11px] text-highlight">
                                  {m.quality}
                                </span>
                              </div>
                              <p className="mt-1 text-xs text-muted-foreground">{m.description}</p>
                              <div className="mt-2 flex flex-wrap items-center gap-3">
                                <span className="text-xs text-accent">
                                  {formatCurrency(m.price)} / {m.unit}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelected(m);
                                    setPendingParts(editingPart ? [editingPart] : []);
                                  }}
                                  className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                                    selected?.id === m.id
                                      ? "ember-gradient text-primary-foreground"
                                      : "border border-accent/40 text-accent hover:bg-accent/10"
                                  }`}
                                >
                                  {selected?.id === m.id ? "Selected" : "Select"}
                                </button>
                              </div>
                            </div>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          {/* Assignment panel */}
          <AnimatePresence>
            {selected && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="rounded-[18px] border border-accent/40 bg-accent/[0.06] p-4"
              >
                <h3 className="text-sm font-semibold">Where do you want to assign this material?</h3>
                <p className="mt-1 text-xs text-secondary-foreground">
                  Assign <span className="text-accent">{selected.name}</span> to one or more parts.
                </p>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {parts.map((part) => {
                    const existing = assignedMap[part.id];
                    const checked = pendingParts.includes(part.id);
                    return (
                      <li key={part.id}>
                        <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-border bg-background/40 px-3 py-2 text-sm">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) =>
                              setPendingParts((prev) =>
                                e.target.checked ? [...prev, part.id] : prev.filter((p) => p !== part.id),
                              )
                            }
                            className="size-4 accent-[oklch(0.585_0.124_45.5)]"
                          />
                          <span className="min-w-0">
                            <span className="block truncate">{part.label}</span>
                            {existing && (
                              <span className="block truncate text-[11px] text-warning">
                                Already: {getMaterial(existing.materialId)?.name}
                              </span>
                            )}
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={assign}
                    className="ember-gradient rounded-2xl px-4 py-2 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Assign Material
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelected(null);
                      setPendingParts([]);
                      setEditingPart(null);
                    }}
                    className="rounded-2xl border border-border px-4 py-2 text-sm text-secondary-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Assigned materials */}
          <div className="rounded-[18px] border border-border bg-foreground/[0.03] p-4">
            <h3 className="text-sm font-semibold">Assigned Materials</h3>
            {project.assignments.length === 0 ? (
              <p className="mt-3 text-xs text-muted-foreground">No materials assigned yet.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {project.assignments.map((a) => {
                  const part = parts.find((p) => p.id === a.partId);
                  const material = getMaterial(a.materialId);
                  return (
                    <li
                      key={a.partId}
                      className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-border bg-background/40 p-3"
                    >
                      <span className="size-9 rounded-xl" style={{ background: material?.swatch }} aria-hidden />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{part?.label}</p>
                        <p className="truncate text-xs text-accent">→ {material?.name}</p>
                      </div>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          aria-label={`Edit material for ${part?.label}`}
                          onClick={() => {
                            setEditingPart(a.partId);
                            setPendingParts([a.partId]);
                            setSelected(null);
                            toast.info("Pick a new material from the library for this part.");
                          }}
                          className="rounded-xl border border-border p-2 text-secondary-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          type="button"
                          aria-label={`Remove material from ${part?.label}`}
                          onClick={() => removeAssignment(a.partId)}
                          className="rounded-xl border border-destructive/40 p-2 text-destructive hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}

            <button
              type="button"
              onClick={() => void confirmMaterials()}
              disabled={generating || project.assignments.length === 0}
              className="ember-gradient ember-glow mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {generating ? <Loader2 size={15} className="animate-spin" aria-hidden /> : <Sparkles size={15} aria-hidden />}
              {generating ? "Generating 2D Material Preview…" : "Confirm Materials"}
            </button>
            {project.materialPreviewReady && (
              <p className="mt-2 flex items-center gap-1.5 text-xs text-success">
                <Check size={13} aria-hidden /> Materials confirmed — you can continue.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Duplicate assignment confirmation */}
      <AnimatePresence>
        {conflict && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-background/70 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="conflict-title"
          >
            <motion.div
              initial={{ scale: 0.95, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              className="glass-panel w-full max-w-md rounded-[18px] p-6"
            >
              <h3 id="conflict-title" className="text-base font-semibold">
                Replace existing material?
              </h3>
              <p className="mt-2 text-sm text-secondary-foreground">
                This part has already been assigned a material. Do you want to replace it?
              </p>
              <div className="mt-5 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setConflict(null)}
                  className="rounded-2xl border border-border px-4 py-2 text-sm text-secondary-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  No
                </button>
                <button
                  type="button"
                  onClick={() => {
                    commitAssignment(conflict.material, conflict.partIds);
                    setConflict(null);
                  }}
                  className="ember-gradient rounded-2xl px-4 py-2 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Yes, Replace
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
