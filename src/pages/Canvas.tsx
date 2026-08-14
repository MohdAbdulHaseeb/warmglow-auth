import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/DashboardLayout";
import { SectionCard } from "@/components/SectionCard";
import { StepIndicator, canvasSteps } from "@/components/canvas/StepIndicator";
import { CanvasNav } from "@/components/canvas/CanvasNav";
import { ModuleBlueprint } from "@/components/canvas/ModuleBlueprint";
import { ModuleMaterials } from "@/components/canvas/ModuleMaterials";
import { ModuleSuggestions } from "@/components/canvas/ModuleSuggestions";
import { ModuleRoom } from "@/components/canvas/ModuleRoom";
import { hydrateProject, patchProject, useProject } from "@/lib/project-store";

const moduleMeta = [
  { title: "Blueprint Upload & AI Analysis", description: "Upload a furniture blueprint and let Buildify detect its parts" },
  { title: "Material Selection & Assignment", description: "Assign materials to each detected furniture part" },
  { title: "AI Design Suggestions", description: "Compare related designs — selecting one is optional" },
  { title: "3D Room Visualization", description: "Place your furniture inside your actual room" },
];

export default function Canvas() {
  const navigate = useNavigate();
  const project = useProject();
  const [step, setStep] = useState(1);
  const [confirmSkip, setConfirmSkip] = useState(false);

  useEffect(() => {
    hydrateProject();
  }, []);

  const completed: number[] = [];
  if (project.analysis) completed.push(1);
  if (project.materialPreviewReady) completed.push(2);
  if (completed.includes(2)) completed.push(3);
  if (project.roomGenerated) completed.push(4);

  const nextDisabled =
    (step === 1 && !project.analysis) || (step === 2 && !project.materialPreviewReady);

  const hints = [
    project.analysis ? "Analysis complete — continue to materials." : "Analyze the blueprint to continue.",
    project.materialPreviewReady ? "Materials confirmed — continue." : "Assign materials and confirm to continue.",
    "Selecting a suggestion is optional.",
    project.roomGenerated
      ? "3D visualization generated — continue to billing."
      : "The 3D visualization is optional — you can continue to billing.",
  ];

  const meta = moduleMeta[step - 1]!;

  const goToBill = () => {
    toast.success("Bill draft created from your Canvas project");
    void navigate({ to: "/bill/create" });
  };

  const goNext = () => {
    if (step === 4) {
      if (project.roomGenerated) {
        goToBill();
      } else {
        setConfirmSkip(true);
      }
      return;
    }
    setStep((s) => Math.min(4, s + 1));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <header className="min-w-0">
          <h1 className="text-2xl font-semibold sm:text-3xl">Project Canvas</h1>
          <p className="mt-2 text-sm text-secondary-foreground">
            {project.projectName} · Step {step} of {canvasSteps.length}
          </p>
        </header>

        <StepIndicator current={step} completed={completed} onSelect={setStep} />

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <SectionCard title={meta.title} description={meta.description}>
              {step === 1 && <ModuleBlueprint />}
              {step === 2 && <ModuleMaterials />}
              {step === 3 && <ModuleSuggestions />}
              {step === 4 && <ModuleRoom />}
            </SectionCard>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {confirmSkip && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 grid place-items-center bg-background/70 p-4 backdrop-blur-sm"
              role="dialog"
              aria-modal="true"
              aria-labelledby="skip-3d-title"
            >
              <motion.div
                initial={{ scale: 0.95, y: 12 }}
                animate={{ scale: 1, y: 0 }}
                className="glass-panel w-full max-w-md rounded-[18px] p-6"
              >
                <h3 id="skip-3d-title" className="text-base font-semibold">
                  Continue without a 3D visualization?
                </h3>
                <p className="mt-2 text-sm text-secondary-foreground">
                  You haven&apos;t generated a 3D visualization yet. Do you want to continue to Generate Bill without
                  it?
                </p>
                <div className="mt-5 flex flex-wrap justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setConfirmSkip(false)}
                    className="rounded-2xl border border-border px-4 py-2 text-sm text-secondary-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Go Back
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      patchProject({ roomStatus: "skipped" });
                      setConfirmSkip(false);
                      goToBill();
                    }}
                    className="ember-gradient rounded-2xl px-4 py-2 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Yes, Continue
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <CanvasNav
          onPrevious={() => setStep((s) => Math.max(1, s - 1))}
          onNext={goNext}
          previousDisabled={step === 1}
          nextDisabled={nextDisabled}
          nextLabel={step === 4 ? "Generate Bill" : "Next"}
          isFinal={step === 4}
          hint={hints[step - 1] ?? ""}
        />
      </div>
    </DashboardLayout>
  );
}
