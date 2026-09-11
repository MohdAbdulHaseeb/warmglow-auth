import { motion } from "motion/react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { recentProjects, statusStyles, type Project } from "@/lib/dashboard-data";

function Actions() {
  const actions = [
    { label: "View", icon: Eye },
    { label: "Edit", icon: Pencil },
    { label: "Delete", icon: Trash2 },
  ];
  return (
    <div className="flex items-center gap-1">
      {actions.map((a) => (
        <button
          key={a.label}
          type="button"
          aria-label={a.label}
          className={`rounded-xl p-2 transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            a.label === "Delete" ? "text-destructive/80 hover:text-destructive" : "text-secondary-foreground hover:text-accent"
          }`}
        >
          <a.icon size={15} aria-hidden />
        </button>
      ))}
    </div>
  );
}

function StatusPill({ status }: { status: Project["status"] }) {
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs ${statusStyles[status]}`}>
      {status}
    </span>
  );
}

function Bar({ value }: { value: number }) {
  return (
    <div className="flex min-w-24 items-center gap-2">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
        <motion.div
          className="ember-gradient h-full rounded-full"
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
      </div>
      <span className="shrink-0 text-xs text-muted-foreground">{value}%</span>
    </div>
  );
}

export function ProjectTable({ projects = recentProjects }: { projects?: Project[] }) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-muted-foreground">
              <th scope="col" className="px-3 py-2 font-medium">Project Name</th>
              <th scope="col" className="px-3 py-2 font-medium">Client</th>
              <th scope="col" className="px-3 py-2 font-medium">Status</th>
              <th scope="col" className="px-3 py-2 font-medium">Completion</th>
              <th scope="col" className="px-3 py-2 font-medium">Date</th>
              <th scope="col" className="px-3 py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p, i) => (
              <motion.tr
                key={p.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                className="border-t border-border transition-colors hover:bg-secondary/70"
              >
                <td className="px-3 py-3 font-medium">{p.name}</td>
                <td className="px-3 py-3 text-secondary-foreground">{p.client}</td>
                <td className="px-3 py-3"><StatusPill status={p.status} /></td>
                <td className="px-3 py-3"><Bar value={p.completion} /></td>
                <td className="px-3 py-3 text-muted-foreground">{p.date}</td>
                <td className="px-3 py-3"><Actions /></td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <ul className="space-y-3 md:hidden">
        {projects.map((p) => (
          <li key={p.id} className="rounded-2xl border border-border bg-surface p-4">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
              <div className="min-w-0">
                <p className="truncate font-medium">{p.name}</p>
                <p className="truncate text-xs text-muted-foreground">{p.client} · {p.date}</p>
              </div>
              <StatusPill status={p.status} />
            </div>
            <div className="mt-3"><Bar value={p.completion} /></div>
            <div className="mt-2"><Actions /></div>
          </li>
        ))}
      </ul>
    </>
  );
}
