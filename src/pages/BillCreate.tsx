import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Trash2, Plus, Lock, Download, Share2, Check, LayoutDashboard } from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/DashboardLayout";
import { SectionCard } from "@/components/SectionCard";
import { getMaterial } from "@/lib/catalog";
import { workers as workerCatalog, additionalCostPresets } from "@/lib/catalog";
import { formatCurrency } from "@/lib/project-service";
import { hydrateProject, patchBill, useProject } from "@/lib/project-store";

const field =
  "w-full rounded-2xl border border-border bg-input/40 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export default function BillCreate() {
  const project = useProject();
  const navigate = useNavigate();
  const bill = project.bill;
  const [confirming, setConfirming] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  useEffect(() => {
    hydrateProject();
  }, []);

  const locked = bill.locked;

  const materialItems = useMemo(
    () =>
      project.assignments
        .filter((a) => !bill.removedMaterialParts.includes(a.partId))
        .map((a) => {
          const material = getMaterial(a.materialId);
          const part = project.analysis?.parts.find((p) => p.id === a.partId);
          const price = bill.materialPrices[a.partId] ?? material?.price ?? 0;
          return {
            partId: a.partId,
            part: part?.label ?? a.partId,
            material: material?.name ?? a.materialId,
            unit: material?.unit ?? "unit",
            quantity: a.quantity,
            price,
            total: price * a.quantity,
          };
        }),
    [project.assignments, project.analysis, bill.materialPrices, bill.removedMaterialParts],
  );

  const workerItems = bill.workerIds.map((id) => {
    const w = workerCatalog.find((x) => x.id === id)!;
    return { ...w, fee: bill.workerFees[id] ?? w.fee };
  });

  const materialTotal = materialItems.reduce((s, m) => s + m.total, 0);
  const workerTotal = workerItems.reduce((s, w) => s + w.fee, 0);
  const additionalTotal = bill.additionalCosts.reduce((s, c) => s + c.amount, 0);
  const subtotal = materialTotal + workerTotal + additionalTotal;
  const taxable = Math.max(0, subtotal - bill.discount);
  const gst = (taxable * bill.gstPercent) / 100;
  const grandTotal = taxable + gst;

  const confirmBill = () => {
    if (!bill.client.name.trim() || !bill.client.email.trim()) {
      toast.error("Client name and email are required.");
      return;
    }
    if (!bill.company.name.trim()) {
      toast.error("Company name is required.");
      return;
    }
    if (!bill.dueDate) {
      toast.error("Select a project due date.");
      return;
    }
    if (new Date(bill.dueDate).getTime() < Date.now() - 86400000) {
      toast.error("The due date cannot be in the past.");
      return;
    }
    patchBill({
      locked: true,
      confirmedAt: new Date().toISOString(),
      id: `BILL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 8999)}`,
    });
    setConfirming(false);
    toast.success("Bill confirmed and saved. It is now locked.");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <header className="min-w-0">
          <Link to="/canvas" className="text-sm text-secondary-foreground hover:text-foreground">
            ← Back to Canvas
          </Link>
          <h1 className="mt-3 text-2xl font-semibold sm:text-3xl">Create Bill</h1>
          <p className="mt-2 text-sm text-secondary-foreground">
            {project.projectName} · {locked ? "Confirmed & locked" : "Draft quotation"}
          </p>
        </header>

        {locked && (
          <div className="glass-panel flex flex-wrap items-center gap-3 rounded-[18px] p-4 text-sm">
            <Lock size={15} className="text-accent" aria-hidden />
            <span>Bill {bill.id} is confirmed and can no longer be edited.</span>
            <div className="ml-auto flex gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="ember-gradient inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-xs font-medium text-primary-foreground"
              >
                <Download size={14} aria-hidden /> Download PDF
              </button>
              <button
                type="button"
                onClick={() => {
                  void navigator.clipboard?.writeText(`${window.location.origin}/bill/create#${bill.id}`);
                  toast.success("Share link copied");
                }}
                className="inline-flex items-center gap-2 rounded-2xl border border-border px-4 py-2 text-xs"
              >
                <Share2 size={14} aria-hidden /> Share with Client
              </button>
            </div>
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-2">
          <SectionCard title="Company Details" description="Your business information">
            <div className="grid gap-3 sm:grid-cols-2">
              {(
                [
                  ["name", "Company Name"],
                  ["gst", "GST Number"],
                  ["phone", "Phone"],
                  ["email", "Email"],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="block text-xs text-secondary-foreground">
                  {label}
                  <input
                    className={`${field} mt-1`}
                    disabled={locked}
                    value={bill.company[key]}
                    onChange={(e) => patchBill({ company: { ...bill.company, [key]: e.target.value } })}
                  />
                </label>
              ))}
              <label className="block text-xs text-secondary-foreground sm:col-span-2">
                Company Address
                <textarea
                  rows={2}
                  className={`${field} mt-1`}
                  disabled={locked}
                  value={bill.company.address}
                  onChange={(e) => patchBill({ company: { ...bill.company, address: e.target.value } })}
                />
              </label>
            </div>
          </SectionCard>

          <SectionCard title="Client Details" description="Who this quotation is for">
            <div className="grid gap-3 sm:grid-cols-2">
              {(
                [
                  ["name", "Client Name"],
                  ["gst", "GST / Tax ID"],
                  ["phone", "Phone"],
                  ["email", "Email"],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="block text-xs text-secondary-foreground">
                  {label}
                  <input
                    className={`${field} mt-1`}
                    disabled={locked}
                    value={bill.client[key]}
                    onChange={(e) => patchBill({ client: { ...bill.client, [key]: e.target.value } })}
                  />
                </label>
              ))}
              <label className="block text-xs text-secondary-foreground sm:col-span-2">
                Client Address
                <textarea
                  rows={2}
                  className={`${field} mt-1`}
                  disabled={locked}
                  value={bill.client.address}
                  onChange={(e) => patchBill({ client: { ...bill.client, address: e.target.value } })}
                />
              </label>
            </div>
          </SectionCard>
        </div>

        <SectionCard title="Worker Assignment" description="Assign the team delivering this project">
          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {workerCatalog.map((w) => {
              const active = bill.workerIds.includes(w.id);
              return (
                <li
                  key={w.id}
                  className={`rounded-[18px] border p-4 ${active ? "border-accent bg-accent/[0.07]" : "border-border bg-foreground/[0.03]"}`}
                >
                  <p className="text-sm font-medium">{w.name}</p>
                  <p className="text-xs text-accent">{w.role}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{w.profile}</p>
                  <p className="mt-2 text-xs">
                    {formatCurrency(bill.workerFees[w.id] ?? w.fee)} / {w.feeType}
                  </p>
                  <button
                    type="button"
                    disabled={locked}
                    onClick={() =>
                      patchBill({
                        workerIds: active ? bill.workerIds.filter((x) => x !== w.id) : [...bill.workerIds, w.id],
                      })
                    }
                    className={`mt-3 w-full rounded-2xl px-3 py-2 text-xs font-medium disabled:opacity-40 ${
                      active ? "border border-accent/40 text-accent" : "ember-gradient text-primary-foreground"
                    }`}
                  >
                    {active ? "Remove" : "Assign"}
                  </button>
                </li>
              );
            })}
          </ul>
          <label className="mt-4 block max-w-xs text-xs text-secondary-foreground">
            Project Due Date
            <input
              type="date"
              disabled={locked}
              className={`${field} mt-1`}
              value={bill.dueDate}
              onChange={(e) => patchBill({ dueDate: e.target.value })}
            />
          </label>
        </SectionCard>

        <SectionCard title="Cost Breakdown" description="Auto-populated from your Canvas workflow">
          <div className="space-y-5">
            <div>
              <h3 className="text-sm font-semibold">Materials</h3>
              <div className="mt-2 overflow-x-auto">
                <table className="w-full min-w-[620px] text-sm">
                  <thead className="text-xs text-muted-foreground">
                    <tr>
                      <th className="p-2 text-left">Material</th>
                      <th className="p-2 text-left">Part</th>
                      <th className="p-2 text-left">Qty</th>
                      <th className="p-2 text-left">Unit Price</th>
                      <th className="p-2 text-right">Total</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {materialItems.map((m) => (
                      <tr key={m.partId} className="border-t border-border">
                        <td className="p-2">{m.material}</td>
                        <td className="p-2 text-secondary-foreground">{m.part}</td>
                        <td className="p-2">{m.quantity}</td>
                        <td className="p-2">
                          <input
                            type="number"
                            min={0}
                            disabled={locked}
                            value={m.price}
                            onChange={(e) =>
                              patchBill({
                                materialPrices: { ...bill.materialPrices, [m.partId]: Number(e.target.value) || 0 },
                              })
                            }
                            className="w-28 rounded-xl border border-border bg-input/40 px-2 py-1 text-sm"
                          />
                        </td>
                        <td className="p-2 text-right">{formatCurrency(m.total)}</td>
                        <td className="p-2 text-right">
                          <button
                            type="button"
                            disabled={locked}
                            aria-label={`Delete ${m.material}`}
                            onClick={() => setPendingDelete(m.partId)}
                            className="rounded-xl border border-destructive/40 p-1.5 text-destructive disabled:opacity-40"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {materialItems.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-3 text-xs text-muted-foreground">
                          No materials on this bill.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold">Worker Fees</h3>
              <ul className="mt-2 space-y-2">
                {workerItems.map((w) => (
                  <li key={w.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 text-sm">
                    <span className="truncate">
                      {w.name} · <span className="text-muted-foreground">{w.role}</span>
                    </span>
                    <input
                      type="number"
                      min={0}
                      disabled={locked}
                      value={w.fee}
                      onChange={(e) => patchBill({ workerFees: { ...bill.workerFees, [w.id]: Number(e.target.value) || 0 } })}
                      className="w-32 rounded-xl border border-border bg-input/40 px-2 py-1 text-sm"
                    />
                  </li>
                ))}
                {workerItems.length === 0 && <li className="text-xs text-muted-foreground">No workers assigned.</li>}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold">Additional Costs</h3>
              <ul className="mt-2 space-y-2">
                {bill.additionalCosts.map((c) => (
                  <li key={c.id} className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 text-sm">
                    <span className="truncate">{c.label}</span>
                    <input
                      type="number"
                      min={0}
                      disabled={locked}
                      value={c.amount}
                      onChange={(e) =>
                        patchBill({
                          additionalCosts: bill.additionalCosts.map((x) =>
                            x.id === c.id ? { ...x, amount: Number(e.target.value) || 0 } : x,
                          ),
                        })
                      }
                      className="w-32 rounded-xl border border-border bg-input/40 px-2 py-1 text-sm"
                    />
                    <button
                      type="button"
                      disabled={locked}
                      aria-label={`Delete ${c.label}`}
                      onClick={() =>
                        patchBill({ additionalCosts: bill.additionalCosts.filter((x) => x.id !== c.id) })
                      }
                      className="rounded-xl border border-destructive/40 p-1.5 text-destructive disabled:opacity-40"
                    >
                      <Trash2 size={13} />
                    </button>
                  </li>
                ))}
              </ul>
              {!locked && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {additionalCostPresets.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() =>
                        patchBill({
                          additionalCosts: [
                            ...bill.additionalCosts,
                            { id: `${p.label}-${Date.now()}`, label: p.label, amount: p.amount },
                          ],
                        })
                      }
                      className="inline-flex items-center gap-1.5 rounded-2xl border border-accent/40 px-3 py-1.5 text-xs text-accent hover:bg-accent/10"
                    >
                      <Plus size={12} aria-hidden /> {p.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-xs text-secondary-foreground">
                GST / Tax (%)
                <input
                  type="number"
                  min={0}
                  max={100}
                  disabled={locked}
                  className={`${field} mt-1`}
                  value={bill.gstPercent}
                  onChange={(e) => patchBill({ gstPercent: Number(e.target.value) || 0 })}
                />
              </label>
              <label className="block text-xs text-secondary-foreground">
                Discount (₹)
                <input
                  type="number"
                  min={0}
                  disabled={locked}
                  className={`${field} mt-1`}
                  value={bill.discount}
                  onChange={(e) => patchBill({ discount: Number(e.target.value) || 0 })}
                />
              </label>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Final Bill Preview" description="Professional quotation">
          <article className="rounded-[18px] border border-border bg-background/40 p-5 sm:p-7">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h3 className="text-lg font-semibold">{bill.company.name}</h3>
                <p className="mt-1 whitespace-pre-line text-xs text-secondary-foreground">{bill.company.address}</p>
                <p className="text-xs text-muted-foreground">
                  {bill.company.phone} · {bill.company.email}
                </p>
                <p className="text-xs text-muted-foreground">GST: {bill.company.gst}</p>
              </div>
              <div className="sm:text-right">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Quotation</p>
                <p className="text-sm font-semibold">{bill.id ?? "Draft"}</p>
                <p className="mt-1 text-xs text-muted-foreground">Project: {project.projectName}</p>
                <p className="text-xs text-muted-foreground">Date: {new Date(project.createdAt).toLocaleDateString()}</p>
                <p className="text-xs text-muted-foreground">Due: {bill.dueDate || "—"}</p>
              </div>
            </div>

            <div className="mt-5 border-t border-border pt-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Billed to</p>
              <p className="text-sm font-medium">{bill.client.name || "—"}</p>
              <p className="whitespace-pre-line text-xs text-secondary-foreground">{bill.client.address}</p>
              <p className="text-xs text-muted-foreground">
                {bill.client.phone} {bill.client.email && `· ${bill.client.email}`}
              </p>
            </div>

            <ul className="mt-5 space-y-1.5 border-t border-border pt-4 text-sm">
              {materialItems.map((m) => (
                <li key={m.partId} className="flex justify-between gap-4">
                  <span className="min-w-0 truncate">
                    {m.material} — {m.part} ({m.quantity} {m.unit})
                  </span>
                  <span>{formatCurrency(m.total)}</span>
                </li>
              ))}
              {workerItems.map((w) => (
                <li key={w.id} className="flex justify-between gap-4">
                  <span className="min-w-0 truncate">
                    {w.name} — {w.role}
                  </span>
                  <span>{formatCurrency(w.fee)}</span>
                </li>
              ))}
              {bill.additionalCosts.map((c) => (
                <li key={c.id} className="flex justify-between gap-4">
                  <span className="min-w-0 truncate">{c.label}</span>
                  <span>{formatCurrency(c.amount)}</span>
                </li>
              ))}
            </ul>

            <dl className="mt-5 space-y-1.5 border-t border-border pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-secondary-foreground">Subtotal</dt>
                <dd>{formatCurrency(subtotal)}</dd>
              </div>
              {bill.discount > 0 && (
                <div className="flex justify-between">
                  <dt className="text-secondary-foreground">Discount</dt>
                  <dd>-{formatCurrency(bill.discount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-secondary-foreground">GST ({bill.gstPercent}%)</dt>
                <dd>{formatCurrency(gst)}</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
                <dt>Grand Total</dt>
                <dd className="text-accent">{formatCurrency(grandTotal)}</dd>
              </div>
            </dl>

            <p className="mt-5 border-t border-border pt-4 text-[11px] text-muted-foreground">
              Terms &amp; Conditions: 50% advance payable on confirmation. Balance due on delivery. Prices valid for 30
              days. Manufacturing begins after material approval. Delivery timelines are subject to material
              availability.
            </p>
          </article>

          {!locked && (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="ember-gradient ember-glow mt-5 w-full rounded-2xl px-5 py-3 text-sm font-medium text-primary-foreground"
            >
              Confirm &amp; Save Bill
            </button>
          )}
          {locked && (
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-center gap-2 text-sm text-success">
                <Check size={15} aria-hidden /> Saved on {new Date(bill.confirmedAt ?? "").toLocaleString()}
              </p>
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate({ to: "/dashboard" })}
                className="ember-gradient ember-glow inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <LayoutDashboard size={15} aria-hidden /> Go to Dashboard
              </motion.button>
            </div>
          )}
        </SectionCard>
      </div>

      {(confirming || pendingDelete) && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-background/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
          <motion.div initial={{ scale: 0.95, y: 12 }} animate={{ scale: 1, y: 0 }} className="glass-panel w-full max-w-md rounded-[18px] p-6">
            <h3 className="text-base font-semibold">{confirming ? "Confirm this bill?" : "Delete this item?"}</h3>
            <p className="mt-2 text-sm text-secondary-foreground">
              {confirming
                ? "Once confirmed, this bill cannot be edited."
                : "This item will be removed from the bill and all totals recalculated."}
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setConfirming(false);
                  setPendingDelete(null);
                }}
                className="rounded-2xl border border-border px-4 py-2 text-sm text-secondary-foreground"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirming) confirmBill();
                  else if (pendingDelete) {
                    patchBill({ removedMaterialParts: [...bill.removedMaterialParts, pendingDelete] });
                    setPendingDelete(null);
                    toast.success("Item removed from bill");
                  }
                }}
                className="ember-gradient rounded-2xl px-4 py-2 text-sm font-medium text-primary-foreground"
              >
                {confirming ? "Confirm Bill" : "Delete"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </DashboardLayout>
  );
}
