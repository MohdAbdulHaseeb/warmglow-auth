import { DashboardLayout } from "@/components/DashboardLayout";
import { SectionCard } from "@/components/SectionCard";
import { ProfileCard } from "@/components/ProfileCard";
import { Notifications } from "@/components/Notifications";

const toggles = [
  { label: "Email notifications", detail: "Project and billing updates", on: true },
  { label: "AI auto-analysis", detail: "Analyse blueprints on upload", on: true },
  { label: "Weekly digest", detail: "Every Monday at 9:00 AM", on: false },
];

export default function Settings() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-semibold sm:text-3xl">Settings</h1>
          <p className="mt-2 text-sm text-secondary-foreground">
            Manage your profile, workspace preferences and alerts.
          </p>
        </header>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <SectionCard title="Profile" description="Account details">
            <ProfileCard />
          </SectionCard>
          <SectionCard title="Preferences" description="Workspace behaviour">
            <ul className="space-y-3">
              {toggles.map((t) => (
                <li
                  key={t.label}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-border bg-white/[0.03] p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{t.label}</p>
                    <p className="truncate text-xs text-muted-foreground">{t.detail}</p>
                  </div>
                  <span
                    role="switch"
                    aria-checked={t.on}
                    aria-label={t.label}
                    tabIndex={0}
                    className={`flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      t.on ? "ember-gradient justify-end" : "justify-start bg-white/10"
                    }`}
                  >
                    <span className="size-5 rounded-full bg-white" />
                  </span>
                </li>
              ))}
            </ul>
          </SectionCard>
          <SectionCard title="Notifications" description="Recent alerts" className="lg:col-span-2">
            <Notifications />
          </SectionCard>
        </div>
      </div>
    </DashboardLayout>
  );
}
