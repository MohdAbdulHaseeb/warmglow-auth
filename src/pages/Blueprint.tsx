import { DashboardLayout } from "@/components/DashboardLayout";
import { SectionCard } from "@/components/SectionCard";
import { UploadBlueprint } from "@/components/UploadBlueprint";
import { MaterialCards } from "@/components/MaterialCards";
import { RoomVisualization } from "@/components/RoomVisualization";

export default function Blueprint() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-semibold sm:text-3xl">Blueprint Analysis</h1>
          <p className="mt-2 text-sm text-secondary-foreground">
            Upload drawings and get AI-detected furniture, materials and costs.
          </p>
        </header>
        <SectionCard title="AI Blueprint Analysis" description="Drag & drop a PDF to begin">
          <UploadBlueprint />
        </SectionCard>
        <SectionCard title="Material Recommendations" description="Suggested from the last analysis">
          <MaterialCards />
        </SectionCard>
        <SectionCard title="AI Room Visualization" description="Render the detected layout">
          <RoomVisualization />
        </SectionCard>
      </div>
    </DashboardLayout>
  );
}
