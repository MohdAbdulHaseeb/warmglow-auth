import { DashboardLayout } from "@/components/DashboardLayout";
import { AnalyticsCharts } from "@/components/AnalyticsCharts";

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
      </div>
    </DashboardLayout>
  );
}
