import { DashboardLayout } from "@/components/DashboardLayout";
import { SectionCard } from "@/components/SectionCard";
import { ProjectTable } from "@/components/ProjectTable";

export default function Projects() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-semibold sm:text-3xl">Projects</h1>
          <p className="mt-2 text-sm text-secondary-foreground">
            Every furniture project across clients, workshops and delivery stages.
          </p>
        </header>
        <SectionCard title="All Projects" description="6 active records">
          <ProjectTable />
        </SectionCard>
      </div>
    </DashboardLayout>
  );
}
