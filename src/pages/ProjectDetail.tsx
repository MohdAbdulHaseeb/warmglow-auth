import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  BadgeIndianRupee,
  CalendarClock,
  Check,
  Download,
  ExternalLink,
  FileText,
  Gauge,
  Layers,
  Lock,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Receipt,
  Share2,
  Sparkles,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/DashboardLayout";
import { SectionCard } from "@/components/SectionCard";
import { PaymentUpdateModal } from "@/components/projects/PaymentUpdateModal";
import { hydratePayments, usePaymentOverrides } from "@/lib/payment-store";
import { useManagement, wageTypeLabel } from "@/lib/management-store";
import { formatCurrency } from "@/lib/project-service";
import {
  formatINR,
  getMonitorProject,
  paymentStyles,
  progressStages,
  projectDocuments,
  stageProgressIndex,
  stageStyles,
} from "@/lib/projects-data";

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-foreground/[0.03] p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium break-words">{value}</p>
    </div>
  );
}

function StatCard({ label, value, sub, icon: Icon, badgeClass }: { label: string; value: string; sub?: string; icon: typeof Gauge; badgeClass?: string }) {
  return (
    <div className="glass-panel rounded-[18px] p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon size={14} className="text-accent" aria-hidden />
        {label}
      </div>
      {badgeClass ? (
        <span className={`mt-2 inline-flex rounded-full border px-2.5 py-0.5 text-xs ${badgeClass}`}>{value}</span>
      ) : (
        <p className="mt-2 text-lg font-semibold">{value}</p>
      )}
      {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

export default function ProjectDetail() {
  const { projectId } = useParams({ from: "/projects/$projectId" });
  const overrides = usePaymentOverrides();
  const { workers: managedWorkers } = useManagement();
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    hydratePayments();
  }, []);

  const base = useMemo(() => getMonitorProject(projectId), [projectId]);

  if (!base) {
    return (
      <DashboardLayout>
        <div className="glass-panel rounded-[18px] p-8 text-center">
          <h1 className="text-xl font-semibold">Project not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">The project “{projectId}” doesn’t exist.</p>
          <Link to="/projects" className="mt-4 inline-flex rounded-2xl border border-border px-4 py-2 text-sm hover:text-accent">
            Back to Projects
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const payment = overrides[base.id] ?? base.payment;
  const project = { ...base, payment };
  const total = project.bill?.total ?? 0;
  const remaining = Math.max(0, total - payment.paid);
  const currentStep = stageProgressIndex(project.stage);
  const allDone = project.completion >= 100;
  const docs = projectDocuments(project).filter((d) => d.available);

  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Project link copied");
    } catch {
      toast.error("Could not copy the link");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-sm text-secondary-foreground transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowLeft size={15} aria-hidden /> Back to Projects
        </Link>

        {/* Title + actions */}
        <header className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold sm:text-3xl">{project.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">Project ID: {project.code}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => toast.info("Project editing is coming soon")}
              className="inline-flex items-center gap-2 rounded-2xl border border-border px-3 py-2 text-sm text-secondary-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Pencil size={14} aria-hidden /> Edit Project
            </button>
            <Link
              to="/canvas/$projectId"
              params={{ projectId: project.id }}
              className="inline-flex items-center gap-2 rounded-2xl border border-border px-3 py-2 text-sm text-secondary-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Sparkles size={14} aria-hidden /> View Canvas
            </Link>
            <Link
              to="/bill/create"
              className="inline-flex items-center gap-2 rounded-2xl border border-border px-3 py-2 text-sm text-secondary-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Receipt size={14} aria-hidden /> View Bill
            </Link>
            <button
              type="button"
              onClick={() => window.print()}
              className="ember-gradient ember-glow inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Download size={14} aria-hidden /> Download Documents
            </button>
          </div>
        </header>

        {/* Assigned team + status cards */}
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <SectionCard
            title={project.team.length > 1 ? "Assigned Team" : "Assigned To"}
            description={`${project.team.length} member${project.team.length === 1 ? "" : "s"} on this project`}
          >
            <ul className="space-y-3">
              {project.team.map((w, i) => {
                const managed = managedWorkers.find((m) => m.id === w.id);
                return (
                <motion.li
                  key={w.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-border bg-foreground/[0.03] p-3"
                >
                  <span className="ember-gradient grid size-11 place-items-center rounded-full text-sm font-semibold text-primary-foreground">
                    {w.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{w.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{w.role}</p>
                    {managed && (
                      <p className="text-xs text-accent">
                        {formatCurrency(managed.wage)} / {wageTypeLabel[managed.wageType]}
                      </p>
                    )}
                    <p className="mt-1 flex flex-wrap gap-x-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><Phone size={11} aria-hidden />{w.phone}</span>
                      <span className="inline-flex items-center gap-1"><Mail size={11} aria-hidden />{w.email}</span>
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs ${
                      w.active ? "border-success/30 bg-success/15 text-success" : "border-border text-muted-foreground"
                    }`}
                  >
                    {managed ? managed.status : w.active ? "Active" : "Inactive"}
                  </span>
                </motion.li>
                );
              })}
              {project.team.length === 0 && <li className="text-sm text-muted-foreground">No workers assigned yet.</li>}
            </ul>
          </SectionCard>

          <div className="grid grid-cols-2 gap-4 self-start">
            <StatCard label="Project Status" value={project.stage} icon={Gauge} badgeClass={stageStyles[project.stage]} />
            <StatCard label="Completion" value={`${project.completion}%`} icon={Layers} sub={`Stage ${currentStep + 1} of ${progressStages.length}`} />
            <StatCard label="Payment" value={payment.status} icon={BadgeIndianRupee} badgeClass={paymentStyles[payment.status]} />
            <StatCard label="Due Date" value={project.dueDate} icon={CalendarClock} />
          </div>
        </div>

        {/* Progress timeline */}
        <SectionCard title="Project Progress" description="Manufacturing pipeline">
          <ol className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {progressStages.map((label, i) => {
              const done = allDone || i < currentStep;
              const current = !allDone && i === currentStep;
              return (
                <motion.li
                  key={label}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className={`rounded-2xl border p-3 ${
                    current ? "border-accent/50 bg-accent/10" : done ? "border-accent/25 bg-accent/[0.06]" : "border-border bg-foreground/[0.02]"
                  }`}
                >
                  <span
                    className={`grid size-7 place-items-center rounded-full text-xs ${
                      done || current ? "ember-gradient text-primary-foreground" : "border border-border text-muted-foreground"
                    }`}
                  >
                    {done ? <Check size={13} aria-hidden /> : i + 1}
                  </span>
                  <p className={`mt-2 text-sm font-medium ${current ? "text-accent" : ""}`}>{label}</p>
                  <p className="text-xs text-muted-foreground">{done ? "Completed" : current ? "In progress" : "Pending"}</p>
                </motion.li>
              );
            })}
          </ol>
        </SectionCard>

        <div className="grid gap-4 lg:grid-cols-2">
          <SectionCard title="Project Details" description="Core record">
            <div className="grid gap-3 sm:grid-cols-2">
              <Info label="Project Name" value={project.name} />
              <Info label="Project ID" value={project.code} />
              <Info label="Created" value={project.createdAt} />
              <Info label="Last Updated" value={project.updatedAt} />
              <Info label="Project Status" value={project.stage} />
              <Info label="Current Stage" value={progressStages[currentStep] ?? "—"} />
              <Info label="Due Date" value={project.dueDate} />
              <Info label="Completion" value={`${project.completion}%`} />
              <Info label="Assigned Team" value={project.team.map((w) => w.name).join(", ") || "Unassigned"} />
            </div>
          </SectionCard>

          <SectionCard title="Client Details" description={project.client.company}>
            <div className="grid gap-3 sm:grid-cols-2">
              <Info label="Client" value={project.client.name} />
              <Info label="Company" value={project.client.company} />
              <Info label="Contact" value={project.client.contact} />
              <Info label="Phone" value={project.client.phone} />
              <Info label="Email" value={project.client.email} />
              <Info label="Address" value={project.client.address} />
            </div>
            <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin size={12} aria-hidden /> Site location as recorded on the project brief.
            </p>
          </SectionCard>
        </div>

        {/* Blueprint */}
        <SectionCard title="Blueprint" description="Source drawing and AI analysis">
          {project.blueprint ? (
            <div className="grid gap-4 md:grid-cols-[220px_minmax(0,1fr)]">
              <div
                className="grid h-40 place-items-center rounded-2xl border border-border"
                style={{ background: project.blueprint.previewTone }}
                role="img"
                aria-label={`${project.name} blueprint preview`}
              >
                <FileText size={28} className="text-primary-foreground/80" aria-hidden />
              </div>
              <div className="min-w-0 space-y-3">
                <div className="grid gap-3 sm:grid-cols-3">
                  <Info label="File Name" value={project.blueprint.fileName} />
                  <Info label="File Type" value={project.blueprint.fileType} />
                  <Info label="Uploaded" value={project.blueprint.uploadedAt} />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs ${
                      project.blueprint.analyzed ? "border-success/30 bg-success/15 text-success" : "border-border text-muted-foreground"
                    }`}
                  >
                    {project.blueprint.analyzed ? <>Analyzed <Check size={12} aria-hidden /></> : "Not analyzed"}
                  </span>
                  <button type="button" onClick={() => toast.info("Opening blueprint viewer")} className="rounded-2xl border border-border px-3 py-1.5 text-xs hover:text-accent">
                    View Blueprint
                  </button>
                  <button type="button" onClick={() => toast.success("Blueprint download started")} className="rounded-2xl border border-border px-3 py-1.5 text-xs hover:text-accent">
                    Download Blueprint
                  </button>
                  {project.blueprint.analyzed && (
                    <Link
                      to="/canvas/$projectId"
                      params={{ projectId: project.id }}
                      className="inline-flex items-center gap-1 rounded-2xl border border-accent/40 bg-accent/10 px-3 py-1.5 text-xs text-accent"
                    >
                      View AI Analysis <ExternalLink size={12} aria-hidden />
                    </Link>
                  )}
                </div>
                {project.blueprint.analyzed && (
                  <div className="rounded-2xl border border-border bg-foreground/[0.03] p-3">
                    <p className="text-sm font-medium">
                      {project.blueprint.furniture}
                      <span className="ml-2 text-xs text-muted-foreground">{project.blueprint.confidence}% confidence</span>
                    </p>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {project.blueprint.parts.map((part) => (
                        <li key={part.id} className="rounded-full border border-border px-2.5 py-0.5 text-xs text-secondary-foreground">
                          {part.label} · {part.note}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No blueprint uploaded for this project yet.</p>
          )}
        </SectionCard>

        {/* Materials */}
        <SectionCard title="Assigned Materials" description={`${project.materials.length} assignments from the Canvas workflow`}>
          {project.materials.length ? (
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {project.materials.map((m, i) => (
                <motion.li
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-2xl border border-border bg-foreground/[0.03] p-4"
                >
                  <p className="font-medium">{m.material}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Assigned to: {m.assignedTo}</p>
                  <p className="mt-2 text-xs text-muted-foreground">Quantity: {m.quantity} {m.unit}</p>
                  <p className="mt-1 text-sm font-semibold text-accent">{formatINR(m.price)}</p>
                </motion.li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No materials assigned yet.</p>
          )}
        </SectionCard>

        {/* Bill + payment */}
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <SectionCard
            title="Project Bill"
            description={project.bill ? `${project.bill.id} · created ${project.bill.createdAt}` : "No bill generated"}
            action={
              project.bill?.confirmed ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground">
                  <Lock size={12} aria-hidden /> Confirmed · Locked
                </span>
              ) : undefined
            }
          >
            {project.bill ? (
              <>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{formatINR(project.bill.subtotal)}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">Worker Fees</dt><dd>{formatINR(project.bill.workerFees)}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">GST</dt><dd>{formatINR(project.bill.gst)}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">Additional Charges</dt><dd>{formatINR(project.bill.additional)}</dd></div>
                  <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
                    <dt>Grand Total</dt><dd className="text-accent">{formatINR(project.bill.total)}</dd>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground"><dt>Due Date</dt><dd>{project.bill.dueDate}</dd></div>
                </dl>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link to="/bill/create" className="rounded-2xl border border-border px-3 py-1.5 text-xs hover:text-accent">View Bill</Link>
                  <button type="button" onClick={() => window.print()} className="rounded-2xl border border-border px-3 py-1.5 text-xs hover:text-accent">Download PDF</button>
                  <button type="button" onClick={share} className="inline-flex items-center gap-1 rounded-2xl border border-border px-3 py-1.5 text-xs hover:text-accent">
                    <Share2 size={12} aria-hidden /> Share Bill
                  </button>
                </div>
                {project.bill.confirmed && (
                  <p className="mt-3 text-xs text-muted-foreground">
                    This bill was confirmed in the Bill workflow and can no longer be edited.
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">This project has no bill yet.</p>
            )}
          </SectionCard>

          <SectionCard title="Payment Status" description={payment.method ? `Last method: ${payment.method}` : "No payment recorded"}>
            <div className="flex items-center gap-2">
              <span className={`inline-flex rounded-full border px-3 py-1 text-sm font-medium ${paymentStyles[payment.status]}`}>
                ● {payment.status.toUpperCase()}
              </span>
            </div>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Total</dt><dd>{formatINR(total)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Paid</dt><dd>{formatINR(payment.paid)}</dd></div>
              <div className="flex justify-between font-medium"><dt className="text-muted-foreground">Remaining</dt><dd className={remaining > 0 ? "text-accent" : "text-success"}>{formatINR(remaining)}</dd></div>
              {payment.paidOn && (
                <div className="flex justify-between text-xs text-muted-foreground"><dt>Last payment</dt><dd>{payment.paidOn}</dd></div>
              )}
            </dl>
            {payment.notes && <p className="mt-3 text-xs text-muted-foreground">{payment.notes}</p>}
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="ember-gradient ember-glow mt-4 inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <BadgeIndianRupee size={15} aria-hidden /> Update Payment
            </button>
          </SectionCard>
        </div>

        {/* Documents + activity */}
        <div className="grid gap-4 lg:grid-cols-2">
          <SectionCard title="Documents" description={`${docs.length} available`}>
            <ul className="space-y-2">
              {docs.map((d) => (
                <li key={d.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-border bg-foreground/[0.03] p-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{d.label}</p>
                    {d.detail && <p className="truncate text-xs text-muted-foreground">{d.detail}</p>}
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => toast.info(`Opening ${d.label}`)} className="rounded-xl border border-border px-2.5 py-1 text-xs hover:text-accent">View</button>
                    <button type="button" onClick={() => toast.success(`${d.label} download started`)} className="rounded-xl border border-border px-2.5 py-1 text-xs hover:text-accent">Download</button>
                  </div>
                </li>
              ))}
              {docs.length === 0 && <li className="text-sm text-muted-foreground">No documents generated yet.</li>}
            </ul>
          </SectionCard>

          <SectionCard title="Activity" description="Project history">
            <ol className="relative space-y-4 border-l border-border pl-5">
              {project.activity.map((a, i) => (
                <motion.li
                  key={a.id}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <span className={`absolute -left-[5px] mt-1.5 size-2.5 rounded-full ${i === 0 ? "ember-gradient" : "bg-border"}`} aria-hidden />
                  <p className="text-xs text-muted-foreground">{a.date}</p>
                  <p className="text-sm font-medium">{a.title}</p>
                  <p className="text-xs text-muted-foreground">{a.detail}</p>
                </motion.li>
              ))}
            </ol>
          </SectionCard>
        </div>

        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <User size={12} aria-hidden /> Monitor view — create and process work in the Canvas workflow.
        </p>
      </div>

      <PaymentUpdateModal
        projectId={project.id}
        total={total}
        payment={payment}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </DashboardLayout>
  );
}
