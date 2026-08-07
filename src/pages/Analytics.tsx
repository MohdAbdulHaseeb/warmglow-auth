import { DashboardLayout } from "@/components/DashboardLayout";
import { AnalyticsCharts } from "@/components/AnalyticsCharts";
import { SectionCard } from "@/components/SectionCard";
import { ManufacturingTimeline } from "@/components/ManufacturingTimeline";

export default function Analytics() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-semibold sm:text-3xl">Analytics</h1>
          <p className="mt-2 text-sm text-secondary-foreground">
            Production, revenue and material insights across your studio.
          </p>
        </header>
        <AnalyticsCharts />
        <SectionCard title="Manufacturing Status" description="Current batch progress">
          <ManufacturingTimeline />
        </SectionCard>
      </div>
    </DashboardLayout>
  );
}
