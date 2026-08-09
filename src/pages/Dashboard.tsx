import { FolderKanban, ScanLine, Factory, IndianRupee } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { DashboardHeader } from "@/components/DashboardHeader";
import { StatsCard } from "@/components/StatsCard";
import { RecentProjectsSection } from "@/components/RecentProjectsSection";

const stats = [
  { label: "Total Projects", value: 125, trend: "+12%", icon: FolderKanban, spark: [8, 12, 10, 16, 14, 21, 25] },
  { label: "AI Analyses", value: 487, trend: "+20%", icon: ScanLine, spark: [40, 52, 48, 70, 66, 88, 96] },
  { label: "Manufacturing Orders", value: 63, trend: "+9%", icon: Factory, spark: [6, 9, 8, 11, 10, 13, 14] },
  { label: "Revenue", value: 12.8, prefix: "₹", suffix: "L", decimals: 1, trend: "+18%", icon: IndianRupee, spark: [6.2, 7.4, 7.1, 9.6, 10.8, 11.9, 12.8] },
];

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <DashboardHeader />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((s, i) => (
            <StatsCard key={s.label} {...s} delay={i * 0.08} />
          ))}
        </div>

        <RecentProjectsSection />
      </div>
    </DashboardLayout>
  );
}
