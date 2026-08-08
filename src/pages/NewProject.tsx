import { Link } from "@tanstack/react-router";
import { ArrowLeft, FolderPlus } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { SectionCard } from "@/components/SectionCard";

export default function NewProject() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <header className="min-w-0">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-secondary-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft size={15} aria-hidden /> Back to dashboard
          </Link>
          <h1 className="mt-3 text-2xl font-semibold sm:text-3xl">Create New Project</h1>
          <p className="mt-2 text-sm text-secondary-foreground">
            Start a new furniture project and attach blueprints, materials and a manufacturing plan.
          </p>
        </header>

        <SectionCard title="Project Details" description="Coming soon">
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-foreground/[0.02] px-6 py-14 text-center">
            <FolderPlus size={24} className="text-accent" aria-hidden />
            <p className="text-sm font-medium">Project setup wizard is on the way</p>
            <p className="max-w-sm text-xs text-muted-foreground">
              You'll be able to name your project, pick a client and upload blueprints right here.
            </p>
          </div>
        </SectionCard>
      </div>
    </DashboardLayout>
  );
}
