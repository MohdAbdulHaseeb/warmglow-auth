import { useState } from "react";
import { motion } from "motion/react";
import { Loader2, Box, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { FileDropzone } from "@/components/canvas/FileDropzone";
import { generateRoomVisualization } from "@/lib/project-service";
import { getMaterial } from "@/lib/catalog";
import { patchProject, useProject, type RoomSide } from "@/lib/project-store";

const sides: { id: RoomSide; label: string }[] = [
  { id: "front", label: "Front View" },
  { id: "back", label: "Back View" },
  { id: "left", label: "Left View" },
  { id: "right", label: "Right View" },
];

const IMAGE_TYPES = ["image/png", "image/jpeg"];

/** Module 4 — Four-side room upload and (placeholder) 3D room visualization. */
export function ModuleRoom() {
  const project = useProject();
  const [stage, setStage] = useState<string | null>(null);

  const allUploaded = sides.every((s) => project.roomImages[s.id]);

  const generate = async () => {
    if (!allUploaded) {
      toast.error("Upload all four room views before generating.");
      return;
    }
    try {
      const ok = await generateRoomVisualization(setStage);
      patchProject({ roomGenerated: ok });
      toast.success("3D room visualization ready");
    } catch {
      toast.error("Room generation failed. Please try again.");
    } finally {
      setStage(null);
    }
  };

  const selectedDesign = project.suggestions.find((s) => s.id === project.selectedDesignId);

  return (
    <div className="space-y-6">
      <p className="rounded-[18px] border border-border bg-foreground/[0.03] p-4 text-sm text-secondary-foreground">
        Upload photos of your room from all four sides so the furniture can be placed in context.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {sides.map((side) => (
          <div key={side.id} className="space-y-2">
            <h3 className="text-sm font-medium">{side.label}</h3>
            <FileDropzone
              compact
              accept={IMAGE_TYPES}
              hint="PNG or JPG · up to 25MB"
              title={side.label}
              file={project.roomImages[side.id] ?? null}
              onFile={(file) =>
                patchProject({ roomImages: { ...project.roomImages, [side.id]: file }, roomGenerated: false })
              }
              onRemove={() => {
                const next = { ...project.roomImages };
                delete next[side.id];
                patchProject({ roomImages: next, roomGenerated: false });
              }}
            />
          </div>
        ))}
      </div>

      <div className="rounded-[18px] border border-border bg-foreground/[0.03] p-5">
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold">3D Room Visualization</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Placeholder viewport — no 3D engine or AI model is connected yet.
            </p>
          </div>
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => void generate()}
            disabled={!allUploaded || stage !== null}
            className="ember-gradient ember-glow inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {stage ? <Loader2 size={15} className="animate-spin" aria-hidden /> : <Sparkles size={15} aria-hidden />}
            {stage ?? "Generate 3D Room"}
          </motion.button>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-background/40">
          {stage ? (
            <div className="grid h-72 place-items-center gap-3">
              <Loader2 className="animate-spin text-accent" aria-hidden />
              <p className="text-sm text-secondary-foreground">{stage}</p>
            </div>
          ) : project.roomGenerated ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative h-72"
              style={{ background: "linear-gradient(160deg,#2a211c,#4a2f1f 55%,#c96a3d)" }}
            >
              <div className="absolute inset-0 grid place-items-center">
                <div className="glass-panel rounded-[18px] px-5 py-4 text-center">
                  <Box className="mx-auto text-highlight" aria-hidden />
                  <p className="mt-2 text-sm font-semibold">
                    {selectedDesign?.name ?? project.analysis?.furniture ?? "Furniture"} placed in room
                  </p>
                  <p className="mt-1 text-xs text-secondary-foreground">
                    {project.assignments
                      .slice(0, 3)
                      .map((a) => getMaterial(a.materialId)?.name)
                      .filter(Boolean)
                      .join(" · ") || "No materials assigned"}
                  </p>
                </div>
              </div>
              <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
                {sides.map((s) => (
                  <span
                    key={s.id}
                    className="rounded-full bg-background/60 px-2.5 py-1 text-[11px] backdrop-blur"
                  >
                    {s.label}
                  </span>
                ))}
              </div>
            </motion.div>
          ) : (
            <div className="grid h-72 place-items-center px-6 text-center text-xs text-muted-foreground">
              Upload all four room views, then generate the visualization.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
