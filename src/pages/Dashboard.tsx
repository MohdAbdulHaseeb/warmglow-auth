import { FolderKanban, ScanLine, Factory, IndianRupee } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { DashboardHeader } from "@/components/DashboardHeader";
import { StatsCard } from "@/components/StatsCard";
import { SectionCard } from "@/components/SectionCard";
import { ProjectTable } from "@/components/ProjectTable";
import { UploadBlueprint } from "@/components/UploadBlueprint";
import { MaterialCards } from "@/components/MaterialCards";
import { RoomVisualization } from "@/components/RoomVisualization";
import { ManufacturingTimeline } from "@/components/ManufacturingTimeline";
import { AnalyticsCharts } from "@/components/AnalyticsCharts";
import { ActivityTimeline } from "@/components/ActivityTimeline";
import { Notifications } from "@/components/Notifications";
import { QuickActions } from "@/components/QuickActions";
import { ProfileCard } from "@/components/ProfileCard";
import { notifications } from "@/lib/dashboard-data";

const stats = [
  { label: "Total Projects", value: 125, trend: "+12%", icon: FolderKanban, spark: [8, 12, 10, 16, 14, 21, 25] },
  { label: "AI Analyses", value: 487, trend: "+20%", icon: ScanLine, spark: [40, 52, 48, 70, 66, 88, 96] },
  { label: "Manufacturing Orders", value: 63, trend: "+9%", icon: Factory, spark: [6, 9, 8, 11, 10, 13, 14] },
  { label: "Revenue", value: 12.8, prefix: "₹", suffix: "L", decimals: 1, trend: "+18%", icon: IndianRupee, spark: [6.2, 7.4, 7.1, 9.6, 10.8, 11.9, 12.8] },
];

export default function Dashboard() {
  const unread = notifications.filter((n) => n.unread).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <DashboardHeader />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((s, i) => (
            <StatsCard key={s.label} {...s} delay={i * 0.08} />
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="space-y-6">
            <SectionCard title="Recent Projects" description="Latest furniture builds across your studio">
              <ProjectTable />
            </SectionCard>

            <SectionCard title="AI Blueprint Analysis" description="Upload a blueprint and let Buildify do the takeoff">
              <UploadBlueprint />
            </SectionCard>

            <SectionCard title="Material Recommendations" description="Ranked by quality, cost and sustainability">
              <MaterialCards />
            </SectionCard>

            <SectionCard title="AI Room Visualization" description="Before and after render preview">
              <RoomVisualization />
            </SectionCard>

            <SectionCard title="Manufacturing Status" description="Aurora Office Suite · Batch #2291">
              <ManufacturingTimeline />
            </SectionCard>
          </div>

          <div className="space-y-6">
            <SectionCard
              title="Notifications"
              description="Latest workspace updates"
              action={
                <span className="ember-gradient rounded-full px-2.5 py-1 text-xs font-semibold text-primary-foreground">
                  {unread} new
                </span>
              }
            >
              <Notifications />
            </SectionCard>

            <SectionCard title="Profile" description="Your workspace account">
              <ProfileCard />
            </SectionCard>

            <SectionCard title="Recent Activity" description="Your last few actions">
              <ActivityTimeline />
            </SectionCard>
          </div>
        </div>

        <SectionCard title="Quick Actions" description="Jump straight into a workflow">
          <QuickActions />
        </SectionCard>

        <AnalyticsCharts />
      </div>
    </DashboardLayout>
  );
}
