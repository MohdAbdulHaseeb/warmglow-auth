import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { Search, X, SearchX, ChevronRight, Filter } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { SectionCard } from "@/components/SectionCard";
import {
  monitorProjects,
  allAssignedWorkers,
  paymentStatuses,
  paymentStyles,
  projectStages,
  stageStyles,
  type PaymentStatus,
  type ProjectStage,
} from "@/lib/projects-data";
import { usePaymentOverrides } from "@/lib/payment-store";

function Badge({ label, className }: { label: string; className: string }) {
  return (
    <span className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs ${className}`}>
      {label}
    </span>
  );
}

function Bar({ value }: { value: number }) {
  return (
    <div className="flex min-w-24 items-center gap-2">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-foreground/10">
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

const selectClass =
  "rounded-2xl border border-border bg-input/40 px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export default function Projects() {
  const overrides = usePaymentOverrides();
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState<ProjectStage | "all">("all");
  const [payment, setPayment] = useState<PaymentStatus | "all">("all");
  const [workerId, setWorkerId] = useState("all");
  const [dateQuery, setDateQuery] = useState("");

  const workers = useMemo(() => allAssignedWorkers(), []);

  const rows = useMemo(
    () =>
      monitorProjects.map((p) => ({ ...p, payment: overrides[p.id] ?? p.payment })),
    [overrides],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const d = dateQuery.trim().toLowerCase();
    return rows.filter((p) => {
      const team = p.team.map((w) => w.name).join(" ");
      const haystack = [p.name, p.client.name, p.client.company, team, p.date, p.code].join(" ").toLowerCase();
      if (q && !haystack.includes(q)) return false;
      if (stage !== "all" && p.stage !== stage) return false;
      if (payment !== "all" && p.payment.status !== payment) return false;
      if (workerId !== "all" && !p.team.some((w) => w.id === workerId)) return false;
      if (d && !p.date.toLowerCase().includes(d) && !p.dueDate.toLowerCase().includes(d)) return false;
      return true;
    });
  }, [rows, query, stage, payment, workerId, dateQuery]);

  const resetFilters = () => {
    setStage("all");
    setPayment("all");
    setWorkerId("all");
    setDateQuery("");
    setQuery("");
  };

  const hasFilters = stage !== "all" || payment !== "all" || workerId !== "all" || !!dateQuery || !!query;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-semibold sm:text-3xl">Projects</h1>
          <p className="mt-2 text-sm text-secondary-foreground">
            Every furniture project across clients, workshops and delivery stages.
          </p>
        </header>

        <SectionCard
          title="All Projects"
          description={`${filtered.length} of ${rows.length} records`}
          action={
            <label className="relative flex w-full items-center sm:w-64">
              <Search size={15} className="absolute left-3 text-muted-foreground" aria-hidden />
              <span className="sr-only">Search projects</span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search projects..."
                className="w-full rounded-2xl border border-border bg-input/40 py-2 pl-9 pr-9 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-2 rounded-lg p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <X size={14} />
                </button>
              )}
            </label>
          }
          className="[&>header]:grid-cols-1 [&>header]:sm:grid-cols-[minmax(0,1fr)_auto]"
        >
          {/* Filters */}
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Filter size={14} aria-hidden /> Filters
            </span>
            <label className="sr-only" htmlFor="f-stage">Project status</label>
            <select id="f-stage" className={selectClass} value={stage} onChange={(e) => setStage(e.target.value as ProjectStage | "all")}>
              <option value="all">All Status</option>
              {projectStages.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <label className="sr-only" htmlFor="f-pay">Payment status</label>
            <select id="f-pay" className={selectClass} value={payment} onChange={(e) => setPayment(e.target.value as PaymentStatus | "all")}>
              <option value="all">All Payments</option>
              {paymentStatuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <label className="sr-only" htmlFor="f-worker">Assigned worker</label>
            <select id="f-worker" className={selectClass} value={workerId} onChange={(e) => setWorkerId(e.target.value)}>
              <option value="all">All Workers</option>
              {workers.map((w) => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
            <label className="sr-only" htmlFor="f-date">Date</label>
            <input
              id="f-date"
              value={dateQuery}
              onChange={(e) => setDateQuery(e.target.value)}
              placeholder="Date (e.g. Aug 2026)"
              className={`${selectClass} w-44 placeholder:text-muted-foreground`}
            />
            {hasFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="rounded-2xl border border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Reset
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-foreground/[0.02] px-6 py-12 text-center"
            >
              <SearchX size={22} className="text-accent" aria-hidden />
              <p className="text-sm font-medium">No projects found</p>
              <p className="text-xs text-muted-foreground">Try a different search or clear the filters.</p>
            </motion.div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="text-xs uppercase tracking-wide text-muted-foreground">
                      <th scope="col" className="px-3 py-2 font-medium">Project Name</th>
                      <th scope="col" className="px-3 py-2 font-medium">Client</th>
                      <th scope="col" className="px-3 py-2 font-medium">Assigned To</th>
                      <th scope="col" className="px-3 py-2 font-medium">Status</th>
                      <th scope="col" className="px-3 py-2 font-medium">Payment</th>
                      <th scope="col" className="px-3 py-2 font-medium">Completion</th>
                      <th scope="col" className="px-3 py-2 font-medium">Date</th>
                      <th scope="col" className="px-3 py-2 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((p, i) => (
                      <motion.tr
                        key={p.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.2) }}
                        className="group border-t border-border transition-colors hover:bg-accent/[0.06]"
                      >
                        <td className="px-3 py-3 font-medium">
                          <Link
                            to="/projects/$projectId"
                            params={{ projectId: p.id }}
                            className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring group-hover:text-accent"
                          >
                            {p.name}
                          </Link>
                          <span className="block text-xs text-muted-foreground">{p.code}</span>
                        </td>
                        <td className="px-3 py-3 text-secondary-foreground">{p.client.name}</td>
                        <td className="px-3 py-3 text-secondary-foreground">
                          {p.team[0]?.name ?? "Unassigned"}
                          {p.team.length > 1 && (
                            <span className="ml-1 text-xs text-muted-foreground">+{p.team.length - 1}</span>
                          )}
                        </td>
                        <td className="px-3 py-3"><Badge label={p.stage} className={stageStyles[p.stage]} /></td>
                        <td className="px-3 py-3"><Badge label={p.payment.status} className={paymentStyles[p.payment.status]} /></td>
                        <td className="px-3 py-3"><Bar value={p.completion} /></td>
                        <td className="px-3 py-3 text-muted-foreground">{p.date}</td>
                        <td className="px-3 py-3">
                          <Link
                            to="/projects/$projectId"
                            params={{ projectId: p.id }}
                            className="inline-flex items-center gap-1 rounded-xl px-2 py-1 text-xs text-accent transition-colors hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            Open <ChevronRight size={13} aria-hidden />
                          </Link>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <ul className="space-y-3 md:hidden">
                {filtered.map((p) => (
                  <li key={p.id}>
                    <Link
                      to="/projects/$projectId"
                      params={{ projectId: p.id }}
                      className="block rounded-2xl border border-border bg-foreground/[0.03] p-4 transition-colors hover:border-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                        <div className="min-w-0">
                          <p className="truncate font-medium">{p.name}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {p.client.name} · {p.date}
                          </p>
                        </div>
                        <Badge label={p.payment.status} className={paymentStyles[p.payment.status]} />
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <Badge label={p.stage} className={stageStyles[p.stage]} />
                        <span className="text-xs text-muted-foreground">
                          {p.team[0]?.name ?? "Unassigned"}
                        </span>
                      </div>
                      <div className="mt-3"><Bar value={p.completion} /></div>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </SectionCard>
      </div>
    </DashboardLayout>
  );
}
