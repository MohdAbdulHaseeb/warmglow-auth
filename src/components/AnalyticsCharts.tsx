import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { SectionCard } from "./SectionCard";
import {
  projectsPerMonth,
  revenueData,
  materialUsage,
  manufacturingPerformance,
} from "@/lib/dashboard-data";

const axis = { stroke: "var(--muted-foreground)", fontSize: 12 };
const tooltipStyle = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: 14,
  color: "var(--foreground)",
  fontSize: 12,
};
const pieColors = ["var(--primary)", "var(--accent)", "var(--highlight)", "var(--muted-foreground)"];

export function AnalyticsCharts() {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <SectionCard title="Projects per Month" description="Delivered furniture projects">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={projectsPerMonth}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="month" tick={axis} tickLine={false} axisLine={false} />
            <YAxis tick={axis} tickLine={false} axisLine={false} width={28} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
            <Bar dataKey="projects" fill="var(--primary)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </SectionCard>

      <SectionCard title="Revenue" description="In ₹ lakhs">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.6} />
                <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="month" tick={axis} tickLine={false} axisLine={false} />
            <YAxis tick={axis} tickLine={false} axisLine={false} width={28} />
            <Tooltip contentStyle={tooltipStyle} />
            <Area dataKey="revenue" stroke="var(--highlight)" strokeWidth={2} fill="url(#revFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </SectionCard>

      <SectionCard title="Material Usage" description="Share of consumption">
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={materialUsage} dataKey="value" innerRadius={52} outerRadius={80} paddingAngle={3} stroke="none">
                {materialUsage.map((entry, i) => (
                  <Cell key={entry.name} fill={pieColors[i % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <ul className="grid w-full grid-cols-2 gap-2 text-xs sm:w-40 sm:grid-cols-1">
            {materialUsage.map((m, i) => (
              <li key={m.name} className="flex items-center gap-2 text-secondary-foreground">
                <span className="size-2.5 rounded-full" style={{ background: pieColors[i % pieColors.length] }} aria-hidden />
                {m.name} · {m.value}%
              </li>
            ))}
          </ul>
        </div>
      </SectionCard>

      <SectionCard title="Manufacturing Performance" description="Efficiency by stage">
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={manufacturingPerformance}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="stage" tick={axis} tickLine={false} axisLine={false} />
            <YAxis tick={axis} tickLine={false} axisLine={false} width={28} domain={[60, 100]} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line dataKey="value" stroke="var(--primary)" strokeWidth={2.5} dot={{ r: 4, fill: "var(--highlight)" }} />
          </LineChart>
        </ResponsiveContainer>
      </SectionCard>
    </div>
  );
}
