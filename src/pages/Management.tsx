import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Search, Pencil, Trash2, Users, Boxes, PackageOpen, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/DashboardLayout";
import { FilterSelect } from "@/components/projects/FilterSelect";
import { ConfirmDialog } from "@/components/management/ConfirmDialog";
import { WorkerFormModal, type WorkerDraft } from "@/components/management/WorkerFormModal";
import { MaterialFormModal, type MaterialDraft } from "@/components/management/MaterialFormModal";
import { formatCurrency } from "@/lib/project-service";
import {
  addMaterial,
  addWorker,
  materialManagementCategories,
  removeMaterial,
  removeWorker,
  stockStatuses,
  stockStyles,
  updateMaterial,
  updateWorker,
  useManagement,
  wageTypeLabel,
  workerStatusStyles,
  type ManagedMaterial,
  type ManagedWorker,
} from "@/lib/management-store";

type Tab = "workers" | "materials";

const searchField =
  "w-full rounded-2xl border border-border bg-input/40 py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export default function Management() {
  const { workers, materials } = useManagement();
  const [tab, setTab] = useState<Tab>("workers");

  // worker state
  const [workerQuery, setWorkerQuery] = useState("");
  const [workerStatus, setWorkerStatus] = useState("all");
  const [workerModal, setWorkerModal] = useState(false);
  const [editingWorker, setEditingWorker] = useState<ManagedWorker | null>(null);
  const [workerToRemove, setWorkerToRemove] = useState<ManagedWorker | null>(null);

  // material state
  const [materialQuery, setMaterialQuery] = useState("");
  const [materialCategory, setMaterialCategory] = useState("all");
  const [materialStock, setMaterialStock] = useState("all");
  const [materialModal, setMaterialModal] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<ManagedMaterial | null>(null);
  const [materialToRemove, setMaterialToRemove] = useState<ManagedMaterial | null>(null);

  const filteredWorkers = useMemo(() => {
    const q = workerQuery.trim().toLowerCase();
    return workers.filter((w) => {
      const matchesQuery =
        !q ||
        w.name.toLowerCase().includes(q) ||
        w.role.toLowerCase().includes(q) ||
        w.phone.toLowerCase().includes(q);
      const matchesStatus = workerStatus === "all" || w.status === workerStatus;
      return matchesQuery && matchesStatus;
    });
  }, [workers, workerQuery, workerStatus]);

  const filteredMaterials = useMemo(() => {
    const q = materialQuery.trim().toLowerCase();
    return materials.filter((m) => {
      const matchesQuery = !q || m.name.toLowerCase().includes(q) || m.category.toLowerCase().includes(q);
      const matchesCategory = materialCategory === "all" || m.category === materialCategory;
      const matchesStock = materialStock === "all" || m.stockStatus === materialStock;
      return matchesQuery && matchesCategory && matchesStock;
    });
  }, [materials, materialQuery, materialCategory, materialStock]);

  const submitWorker = (draft: WorkerDraft) => {
    if (editingWorker) {
      updateWorker(editingWorker.id, draft);
      toast.success("Worker updated successfully.");
    } else {
      addWorker({ ...draft, profile: draft.notes });
      toast.success("Worker added successfully.");
    }
    setWorkerModal(false);
    setEditingWorker(null);
  };

  const confirmRemoveWorker = () => {
    if (!workerToRemove) return;
    const result = removeWorker(workerToRemove.id);
    toast.success(
      result === "deactivated"
        ? "Worker marked as inactive. Existing projects keep their record."
        : "Worker removed successfully.",
    );
    setWorkerToRemove(null);
  };

  const submitMaterial = (draft: MaterialDraft) => {
    if (editingMaterial) {
      updateMaterial(editingMaterial.id, draft);
      toast.success("Material updated successfully.");
    } else {
      addMaterial({
        ...draft,
        isActive: true,
        swatch: "linear-gradient(135deg,#8a5a34,#c98d5c)",
      });
      toast.success("Material added successfully.");
    }
    setMaterialModal(false);
    setEditingMaterial(null);
  };

  const confirmRemoveMaterial = () => {
    if (!materialToRemove) return;
    removeMaterial(materialToRemove.id);
    toast.success("Material removed from new projects. Past bills are unchanged.");
    setMaterialToRemove(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-semibold sm:text-3xl">Management</h1>
          <p className="mt-2 text-sm text-secondary-foreground">
            Manage workers, materials, pricing and internal resources.
          </p>
        </header>

        <div
          role="tablist"
          aria-label="Management sections"
          className="inline-flex gap-1 rounded-2xl border border-border bg-foreground/[0.03] p-1"
        >
          {(
            [
              { id: "workers" as Tab, label: "Workers", icon: Users },
              { id: "materials" as Tab, label: "Materials", icon: Boxes },
            ]
          ).map((t) => (
            <button
              key={t.id}
              role="tab"
              type="button"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`relative flex items-center gap-2 rounded-xl px-4 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                tab === t.id ? "text-primary-foreground" : "text-secondary-foreground hover:text-foreground"
              }`}
            >
              {tab === t.id && (
                <motion.span layoutId="management-tab" className="ember-gradient absolute inset-0 rounded-xl" />
              )}
              <t.icon size={15} className="relative" aria-hidden />
              <span className="relative">{t.label}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {tab === "workers" ? (
            <motion.section
              key="workers"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="glass-panel rounded-[18px] p-5 sm:p-6"
            >
              <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
                  <label className="relative flex items-center">
                    <Search size={15} className="absolute left-3 text-muted-foreground" aria-hidden />
                    <span className="sr-only">Search workers</span>
                    <input
                      type="search"
                      value={workerQuery}
                      onChange={(e) => setWorkerQuery(e.target.value)}
                      placeholder="Search workers…"
                      className={searchField}
                    />
                  </label>
                  <FilterSelect
                    label="Worker status"
                    value={workerStatus}
                    onChange={setWorkerStatus}
                    options={[
                      { value: "all", label: "All Status" },
                      { value: "Active", label: "Active" },
                      { value: "Inactive", label: "Inactive" },
                    ]}
                    className="sm:w-44"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingWorker(null);
                    setWorkerModal(true);
                  }}
                  className="ember-gradient inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Plus size={16} aria-hidden /> Add Worker
                </button>
              </div>

              {filteredWorkers.length === 0 ? (
                <EmptyState
                  icon={<UserPlus size={22} aria-hidden />}
                  title={workers.length === 0 ? "No workers added yet." : "No workers match your search."}
                  action="+ Add Worker"
                  onAction={() => {
                    setEditingWorker(null);
                    setWorkerModal(true);
                  }}
                />
              ) : (
                <>
                  {/* Desktop table */}
                  <div className="mt-5 hidden overflow-x-auto lg:block">
                    <table className="w-full min-w-[860px] text-left text-sm">
                      <thead className="text-xs uppercase tracking-wide text-muted-foreground">
                        <tr>
                          <th className="py-3 pr-4 font-medium">Worker</th>
                          <th className="py-3 pr-4 font-medium">Role</th>
                          <th className="py-3 pr-4 font-medium">Contact</th>
                          <th className="py-3 pr-4 font-medium">Wage</th>
                          <th className="py-3 pr-4 font-medium">Status</th>
                          <th className="py-3 pr-4 font-medium">Projects</th>
                          <th className="py-3 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredWorkers.map((w) => (
                          <tr key={w.id} className="border-t border-border">
                            <td className="py-3 pr-4">
                              <div className="flex items-center gap-3">
                                <Avatar name={w.name} src={w.avatar} />
                                <span className="font-medium">{w.name}</span>
                              </div>
                            </td>
                            <td className="py-3 pr-4 text-secondary-foreground">{w.role}</td>
                            <td className="py-3 pr-4 text-xs text-muted-foreground">
                              <div>{w.phone}</div>
                              <div className="truncate">{w.email}</div>
                            </td>
                            <td className="py-3 pr-4 text-accent">
                              {formatCurrency(w.wage)} / {wageTypeLabel[w.wageType]}
                            </td>
                            <td className="py-3 pr-4">
                              <Badge className={workerStatusStyles[w.status]}>{w.status}</Badge>
                            </td>
                            <td className="py-3 pr-4 text-secondary-foreground">{w.activeProjects}</td>
                            <td className="py-3">
                              <RowActions
                                onEdit={() => {
                                  setEditingWorker(w);
                                  setWorkerModal(true);
                                }}
                                onRemove={() => setWorkerToRemove(w)}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile / tablet cards */}
                  <ul className="mt-5 space-y-3 lg:hidden">
                    {filteredWorkers.map((w) => (
                      <li key={w.id} className="rounded-[18px] border border-border bg-foreground/[0.03] p-4">
                        <div className="flex items-start gap-3">
                          <Avatar name={w.name} src={w.avatar} />
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium">{w.name}</p>
                            <p className="text-xs text-accent">{w.role}</p>
                            <p className="mt-1 text-xs text-muted-foreground">{w.phone}</p>
                            <p className="truncate text-xs text-muted-foreground">{w.email}</p>
                            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                              <span className="text-accent">
                                {formatCurrency(w.wage)} / {wageTypeLabel[w.wageType]}
                              </span>
                              <Badge className={workerStatusStyles[w.status]}>{w.status}</Badge>
                              <span className="text-muted-foreground">{w.activeProjects} projects</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3">
                          <RowActions
                            onEdit={() => {
                              setEditingWorker(w);
                              setWorkerModal(true);
                            }}
                            onRemove={() => setWorkerToRemove(w)}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </motion.section>
          ) : (
            <motion.section
              key="materials"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="glass-panel rounded-[18px] p-5 sm:p-6"
            >
              <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center">
                <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
                  <label className="relative flex items-center">
                    <Search size={15} className="absolute left-3 text-muted-foreground" aria-hidden />
                    <span className="sr-only">Search materials</span>
                    <input
                      type="search"
                      value={materialQuery}
                      onChange={(e) => setMaterialQuery(e.target.value)}
                      placeholder="Search materials…"
                      className={searchField}
                    />
                  </label>
                  <FilterSelect
                    label="Material category"
                    value={materialCategory}
                    onChange={setMaterialCategory}
                    options={[
                      { value: "all", label: "All Categories" },
                      ...materialManagementCategories.map((c) => ({ value: c, label: c })),
                    ]}
                    className="sm:w-44"
                  />
                  <FilterSelect
                    label="Stock status"
                    value={materialStock}
                    onChange={setMaterialStock}
                    options={[
                      { value: "all", label: "All Stock" },
                      ...stockStatuses.map((s) => ({ value: s, label: s })),
                    ]}
                    className="sm:w-44"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingMaterial(null);
                    setMaterialModal(true);
                  }}
                  className="ember-gradient inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Plus size={16} aria-hidden /> Add Material
                </button>
              </div>

              {filteredMaterials.length === 0 ? (
                <EmptyState
                  icon={<PackageOpen size={22} aria-hidden />}
                  title={materials.length === 0 ? "No materials available." : "No materials match your filters."}
                  action="+ Add Material"
                  onAction={() => {
                    setEditingMaterial(null);
                    setMaterialModal(true);
                  }}
                />
              ) : (
                <>
                  <div className="mt-5 hidden overflow-x-auto lg:block">
                    <table className="w-full min-w-[880px] text-left text-sm">
                      <thead className="text-xs uppercase tracking-wide text-muted-foreground">
                        <tr>
                          <th className="py-3 pr-4 font-medium">Material</th>
                          <th className="py-3 pr-4 font-medium">Category</th>
                          <th className="py-3 pr-4 font-medium">Price</th>
                          <th className="py-3 pr-4 font-medium">Stock</th>
                          <th className="py-3 pr-4 font-medium">Description</th>
                          <th className="py-3 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredMaterials.map((m) => (
                          <tr key={m.id} className="border-t border-border">
                            <td className="py-3 pr-4">
                              <div className="flex items-center gap-3">
                                <Swatch material={m} />
                                <div className="min-w-0">
                                  <p className="font-medium">{m.name}</p>
                                  {!m.isActive && (
                                    <p className="text-[11px] text-muted-foreground">Removed from new projects</p>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="py-3 pr-4 text-secondary-foreground">{m.category}</td>
                            <td className="py-3 pr-4 text-accent">
                              {formatCurrency(m.price)} / {m.unit}
                            </td>
                            <td className="py-3 pr-4">
                              <Badge className={stockStyles[m.stockStatus]}>{m.stockStatus}</Badge>
                            </td>
                            <td className="max-w-xs py-3 pr-4 text-xs text-muted-foreground">
                              <span className="line-clamp-2">{m.description}</span>
                            </td>
                            <td className="py-3">
                              <RowActions
                                onEdit={() => {
                                  setEditingMaterial(m);
                                  setMaterialModal(true);
                                }}
                                onRemove={() => setMaterialToRemove(m)}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <ul className="mt-5 space-y-3 lg:hidden">
                    {filteredMaterials.map((m) => (
                      <li key={m.id} className="rounded-[18px] border border-border bg-foreground/[0.03] p-4">
                        <div className="flex items-start gap-3">
                          <Swatch material={m} />
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium">{m.name}</p>
                            <p className="text-xs text-secondary-foreground">{m.category}</p>
                            <p className="mt-1 text-xs text-accent">
                              {formatCurrency(m.price)} / {m.unit}
                            </p>
                            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{m.description}</p>
                            <div className="mt-2">
                              <Badge className={stockStyles[m.stockStatus]}>{m.stockStatus}</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3">
                          <RowActions
                            onEdit={() => {
                              setEditingMaterial(m);
                              setMaterialModal(true);
                            }}
                            onRemove={() => setMaterialToRemove(m)}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      <WorkerFormModal
        open={workerModal}
        worker={editingWorker}
        onClose={() => {
          setWorkerModal(false);
          setEditingWorker(null);
        }}
        onSubmit={submitWorker}
      />
      <MaterialFormModal
        open={materialModal}
        material={editingMaterial}
        onClose={() => {
          setMaterialModal(false);
          setEditingMaterial(null);
        }}
        onSubmit={submitMaterial}
      />
      <ConfirmDialog
        open={workerToRemove !== null}
        title="Remove Worker?"
        message="This worker will no longer be available for new project assignments. Existing projects keep their record."
        confirmLabel="Remove Worker"
        onCancel={() => setWorkerToRemove(null)}
        onConfirm={confirmRemoveWorker}
      />
      <ConfirmDialog
        open={materialToRemove !== null}
        title="Remove Material?"
        message="This material will no longer be available for new projects. Completed projects and confirmed bills are unchanged."
        confirmLabel="Remove"
        onCancel={() => setMaterialToRemove(null)}
        onConfirm={confirmRemoveMaterial}
      />
    </DashboardLayout>
  );
}

function Badge({ children, className }: { children: React.ReactNode; className: string }) {
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${className}`}>
      {children}
    </span>
  );
}

function Avatar({ name, src }: { name: string; src: string | null }) {
  if (src) {
    return <img src={src} alt="" loading="lazy" className="size-10 shrink-0 rounded-2xl object-cover" />;
  }
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");
  return (
    <span className="ember-gradient grid size-10 shrink-0 place-items-center rounded-2xl text-xs font-semibold text-primary-foreground">
      {initials}
    </span>
  );
}

function Swatch({ material }: { material: ManagedMaterial }) {
  return material.image ? (
    <img src={material.image} alt="" loading="lazy" className="size-10 shrink-0 rounded-2xl object-cover" />
  ) : (
    <span className="size-10 shrink-0 rounded-2xl" style={{ background: material.swatch }} aria-hidden />
  );
}

function RowActions({ onEdit, onRemove }: { onEdit: () => void; onRemove: () => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={onEdit}
        className="inline-flex items-center gap-1.5 rounded-xl border border-accent/40 px-3 py-1.5 text-xs text-accent transition-colors hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Pencil size={13} aria-hidden /> Edit
      </button>
      <button
        type="button"
        onClick={onRemove}
        className="inline-flex items-center gap-1.5 rounded-xl border border-destructive/40 px-3 py-1.5 text-xs text-destructive transition-colors hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Trash2 size={13} aria-hidden /> Remove
      </button>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  action,
  onAction,
}: {
  icon: React.ReactNode;
  title: string;
  action: string;
  onAction: () => void;
}) {
  return (
    <div className="mt-6 grid place-items-center gap-3 rounded-[18px] border border-dashed border-border p-10 text-center">
      <span className="grid size-14 place-items-center rounded-2xl bg-accent/10 text-accent">{icon}</span>
      <p className="text-sm text-secondary-foreground">{title}</p>
      <button
        type="button"
        onClick={onAction}
        className="ember-gradient rounded-2xl px-4 py-2 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {action}
      </button>
    </div>
  );
}
