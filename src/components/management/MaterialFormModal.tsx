import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { FilterSelect } from "@/components/projects/FilterSelect";
import {
  materialManagementCategories,
  priceUnits,
  stockStatuses,
  type ManagedMaterial,
  type StockStatus,
} from "@/lib/management-store";

const field =
  "w-full rounded-2xl border border-border bg-input/40 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export interface MaterialDraft {
  name: string;
  category: ManagedMaterial["category"];
  type: string;
  description: string;
  price: number;
  unit: string;
  quality: ManagedMaterial["quality"];
  stockStatus: StockStatus;
  image: string | null;
}

const emptyDraft: MaterialDraft = {
  name: "",
  category: "Wood",
  type: "",
  description: "",
  price: 0,
  unit: "Per Sq Ft",
  quality: "Standard",
  stockStatus: "Available",
  image: null,
};

interface Props {
  open: boolean;
  material: ManagedMaterial | null;
  onClose: () => void;
  onSubmit: (draft: MaterialDraft) => void;
}

export function MaterialFormModal({ open, material, onClose, onSubmit }: Props) {
  const [draft, setDraft] = useState<MaterialDraft>(emptyDraft);
  const [errors, setErrors] = useState<Partial<Record<keyof MaterialDraft, string>>>({});
  const [initialisedFor, setInitialisedFor] = useState<string | null>(null);

  const key = material?.id ?? "new";
  if (open && initialisedFor !== key) {
    setInitialisedFor(key);
    setErrors({});
    setDraft(
      material
        ? {
            name: material.name,
            category: material.category,
            type: material.type,
            description: material.description,
            price: material.price,
            unit: material.unit,
            quality: material.quality,
            stockStatus: material.stockStatus,
            image: material.image,
          }
        : emptyDraft,
    );
  }
  if (!open && initialisedFor !== null) setInitialisedFor(null);

  const set = <K extends keyof MaterialDraft>(k: K, v: MaterialDraft[K]) => {
    setDraft((prev) => ({ ...prev, [k]: v }));
    setErrors((prev) => ({ ...prev, [k]: undefined }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Partial<Record<keyof MaterialDraft, string>> = {};
    if (!draft.name.trim()) next.name = "Material name is required.";
    if (!draft.price || draft.price <= 0) next.price = "Enter a price greater than zero.";
    if (!draft.unit.trim()) next.unit = "Unit is required.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    onSubmit(draft);
  };

  const readImage = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => set("image", String(reader.result));
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
          aria-label={material ? "Edit material" : "Add material"}
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
                <h2 className="text-lg font-semibold">{material ? "Edit Material" : "Add Material"}</h2>
                <p className="mt-1 text-xs text-secondary-foreground">
                  New prices apply to new projects only — confirmed bills keep their original price.
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
                Material Name
                <input className={`${field} mt-1`} value={draft.name} onChange={(e) => set("name", e.target.value)} />
                {errors.name && <span className="mt-1 block text-[11px] text-destructive">{errors.name}</span>}
              </label>
              <div className="text-xs text-secondary-foreground">
                Category
                <FilterSelect
                  className="mt-1"
                  label="Material category"
                  value={draft.category}
                  onChange={(v) => set("category", v as ManagedMaterial["category"])}
                  options={materialManagementCategories.map((c) => ({ value: c, label: c }))}
                />
              </div>
              <label className="block text-xs text-secondary-foreground">
                Type
                <input
                  className={`${field} mt-1`}
                  placeholder="Hardwood, Alloy…"
                  value={draft.type}
                  onChange={(e) => set("type", e.target.value)}
                />
              </label>
              <div className="text-xs text-secondary-foreground">
                Quality
                <FilterSelect
                  className="mt-1"
                  label="Material quality"
                  value={draft.quality}
                  onChange={(v) => set("quality", v as ManagedMaterial["quality"])}
                  options={[
                    { value: "Standard", label: "Standard" },
                    { value: "Premium", label: "Premium" },
                    { value: "Luxury", label: "Luxury" },
                  ]}
                />
              </div>
              <label className="block text-xs text-secondary-foreground">
                Price (₹)
                <input
                  type="number"
                  min={0}
                  className={`${field} mt-1`}
                  value={draft.price || ""}
                  onChange={(e) => set("price", Number(e.target.value) || 0)}
                />
                {errors.price && <span className="mt-1 block text-[11px] text-destructive">{errors.price}</span>}
              </label>
              <div className="text-xs text-secondary-foreground">
                Unit
                <FilterSelect
                  className="mt-1"
                  label="Price unit"
                  value={priceUnits.includes(draft.unit) ? draft.unit : "Custom"}
                  onChange={(v) => set("unit", v)}
                  options={priceUnits.map((u) => ({ value: u, label: u }))}
                />
              </div>
              <div className="text-xs text-secondary-foreground">
                Stock Status
                <FilterSelect
                  className="mt-1"
                  label="Stock status"
                  value={draft.stockStatus}
                  onChange={(v) => set("stockStatus", v as StockStatus)}
                  options={stockStatuses.map((s) => ({ value: s, label: s }))}
                />
              </div>
              <label className="block text-xs text-secondary-foreground">
                Material Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => readImage(e.target.files?.[0])}
                  className={`${field} mt-1 file:mr-3 file:rounded-lg file:border-0 file:bg-accent/15 file:px-2 file:py-1 file:text-xs file:text-accent`}
                />
              </label>
              <label className="block text-xs text-secondary-foreground sm:col-span-2">
                Description
                <textarea
                  rows={2}
                  className={`${field} mt-1`}
                  value={draft.description}
                  onChange={(e) => set("description", e.target.value)}
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
                {material ? "Save Material" : "Add Material"}
              </button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
