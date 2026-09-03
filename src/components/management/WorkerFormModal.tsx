import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { FilterSelect } from "@/components/projects/FilterSelect";
import { wageTypes, type ManagedWorker, type WageType, type WorkerStatus } from "@/lib/management-store";

const field =
  "w-full rounded-2xl border border-border bg-input/40 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export interface WorkerDraft {
  name: string;
  avatar: string | null;
  role: string;
  phone: string;
  email: string;
  address: string;
  wage: number;
  wageType: WageType;
  status: WorkerStatus;
  notes: string;
}

const emptyDraft: WorkerDraft = {
  name: "",
  avatar: null,
  role: "",
  phone: "",
  email: "",
  address: "",
  wage: 0,
  wageType: "day",
  status: "Active",
  notes: "",
};

interface Props {
  open: boolean;
  worker: ManagedWorker | null;
  onClose: () => void;
  onSubmit: (draft: WorkerDraft) => void;
}

export function WorkerFormModal({ open, worker, onClose, onSubmit }: Props) {
  const [draft, setDraft] = useState<WorkerDraft>(emptyDraft);
  const [errors, setErrors] = useState<Partial<Record<keyof WorkerDraft, string>>>({});
  const [initialisedFor, setInitialisedFor] = useState<string | null>(null);

  const key = worker?.id ?? "new";
  if (open && initialisedFor !== key) {
    setInitialisedFor(key);
    setErrors({});
    setDraft(
      worker
        ? {
            name: worker.name,
            avatar: worker.avatar,
            role: worker.role,
            phone: worker.phone,
            email: worker.email,
            address: worker.address,
            wage: worker.wage,
            wageType: worker.wageType,
            status: worker.status,
            notes: worker.notes,
          }
        : emptyDraft,
    );
  }
  if (!open && initialisedFor !== null) setInitialisedFor(null);

  const set = <K extends keyof WorkerDraft>(k: K, v: WorkerDraft[K]) => {
    setDraft((prev) => ({ ...prev, [k]: v }));
    setErrors((prev) => ({ ...prev, [k]: undefined }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Partial<Record<keyof WorkerDraft, string>> = {};
    if (!draft.name.trim()) next.name = "Full name is required.";
    if (!draft.role.trim()) next.role = "Role is required.";
    if (!draft.phone.trim()) next.phone = "Phone number is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email)) next.email = "Enter a valid email.";
    if (!draft.wage || draft.wage <= 0) next.wage = "Enter a wage greater than zero.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    onSubmit(draft);
  };

  const readPhoto = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => set("avatar", String(reader.result));
    reader.readAsDataURL(file);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 overflow-y-auto bg-background/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={worker ? "Edit worker" : "Add worker"}
        >
          <motion.form
            onSubmit={submit}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            className="glass-panel mx-auto w-full max-w-2xl rounded-[18px] p-6"
          >
            <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
              <div className="min-w-0">
                <h2 className="text-lg font-semibold">{worker ? "Edit Worker" : "Add Worker"}</h2>
                <p className="mt-1 text-xs text-secondary-foreground">
                  Workers marked Active can be assigned to new projects.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="rounded-xl p-2 text-muted-foreground hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X size={18} />
              </button>
            </header>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="block text-xs text-secondary-foreground">
                Full Name
                <input className={`${field} mt-1`} value={draft.name} onChange={(e) => set("name", e.target.value)} />
                {errors.name && <span className="mt-1 block text-[11px] text-destructive">{errors.name}</span>}
              </label>
              <label className="block text-xs text-secondary-foreground">
                Role
                <input
                  className={`${field} mt-1`}
                  placeholder="Carpenter, Designer…"
                  value={draft.role}
                  onChange={(e) => set("role", e.target.value)}
                />
                {errors.role && <span className="mt-1 block text-[11px] text-destructive">{errors.role}</span>}
              </label>
              <label className="block text-xs text-secondary-foreground">
                Phone
                <input className={`${field} mt-1`} value={draft.phone} onChange={(e) => set("phone", e.target.value)} />
                {errors.phone && <span className="mt-1 block text-[11px] text-destructive">{errors.phone}</span>}
              </label>
              <label className="block text-xs text-secondary-foreground">
                Email
                <input
                  type="email"
                  className={`${field} mt-1`}
                  value={draft.email}
                  onChange={(e) => set("email", e.target.value)}
                />
                {errors.email && <span className="mt-1 block text-[11px] text-destructive">{errors.email}</span>}
              </label>
              <label className="block text-xs text-secondary-foreground sm:col-span-2">
                Address
                <input
                  className={`${field} mt-1`}
                  value={draft.address}
                  onChange={(e) => set("address", e.target.value)}
                />
              </label>
              <label className="block text-xs text-secondary-foreground">
                Wage (₹)
                <input
                  type="number"
                  min={0}
                  className={`${field} mt-1`}
                  value={draft.wage || ""}
                  onChange={(e) => set("wage", Number(e.target.value) || 0)}
                />
                {errors.wage && <span className="mt-1 block text-[11px] text-destructive">{errors.wage}</span>}
              </label>
              <div className="text-xs text-secondary-foreground">
                Wage Type
                <FilterSelect
                  className="mt-1"
                  label="Wage type"
                  value={draft.wageType}
                  onChange={(v) => set("wageType", v as WageType)}
                  options={wageTypes.map((w) => ({ value: w.value, label: w.label }))}
                />
              </div>
              <div className="text-xs text-secondary-foreground">
                Status
                <FilterSelect
                  className="mt-1"
                  label="Worker status"
                  value={draft.status}
                  onChange={(v) => set("status", v as WorkerStatus)}
                  options={[
                    { value: "Active", label: "Active" },
                    { value: "Inactive", label: "Inactive" },
                  ]}
                />
              </div>
              <label className="block text-xs text-secondary-foreground">
                Profile Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => readPhoto(e.target.files?.[0])}
                  className={`${field} mt-1 file:mr-3 file:rounded-lg file:border-0 file:bg-accent/15 file:px-2 file:py-1 file:text-xs file:text-accent`}
                />
              </label>
              <label className="block text-xs text-secondary-foreground sm:col-span-2">
                Notes
                <textarea
                  rows={2}
                  className={`${field} mt-1`}
                  value={draft.notes}
                  onChange={(e) => set("notes", e.target.value)}
                />
              </label>
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-2xl border border-border px-4 py-2 text-sm hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="ember-gradient rounded-2xl px-4 py-2 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {worker ? "Save Worker" : "Add Worker"}
              </button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
