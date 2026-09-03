/**
 * Management data layer — master records for workers and materials.
 *
 * Persisted to localStorage and seeded from the static catalog. Shapes mirror
 * the intended Supabase tables (`workers`, `materials`) so this module can be
 * swapped for queries without touching presentation code.
 */

import { useEffect, useState } from "react";
import { materialCatalog, workers as workerSeed, type MaterialCategory } from "@/lib/catalog";

export type WageType = "hour" | "day" | "project" | "month";
export type WorkerStatus = "Active" | "Inactive";

export interface ManagedWorker {
  id: string;
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
  profile: string;
  activeProjects: number;
  createdAt: string;
  updatedAt: string;
}

export type StockStatus = "Available" | "Low Stock" | "Out of Stock";
export type PriceUnit = string;

export interface ManagedMaterial {
  id: string;
  name: string;
  category: MaterialCategory | "Leather" | "Plastic";
  type: string;
  description: string;
  price: number;
  unit: PriceUnit;
  quality: "Standard" | "Premium" | "Luxury";
  swatch: string;
  image: string | null;
  stockStatus: StockStatus;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const wageTypes: { value: WageType; label: string }[] = [
  { value: "hour", label: "Per Hour" },
  { value: "day", label: "Per Day" },
  { value: "project", label: "Per Project" },
  { value: "month", label: "Monthly" },
];

export const wageTypeLabel: Record<WageType, string> = {
  hour: "hour",
  day: "day",
  project: "project",
  month: "month",
};

export const materialManagementCategories = [
  "Wood",
  "Metal",
  "Fabric",
  "Leather",
  "Glass",
  "Plastic",
  "Other",
] as const;

export const priceUnits = [
  "Per Piece",
  "Per Kg",
  "Per Meter",
  "Per Sq Ft",
  "Per Ft",
  "Per Sheet",
  "Custom",
];

export const stockStatuses: StockStatus[] = ["Available", "Low Stock", "Out of Stock"];

const STORAGE_KEY = "buildify-management-v1";

interface ManagementState {
  workers: ManagedWorker[];
  materials: ManagedMaterial[];
}

function seedState(): ManagementState {
  const now = new Date().toISOString();
  return {
    workers: workerSeed.map((w, i) => ({
      id: w.id,
      name: w.name,
      avatar: null,
      role: w.role,
      phone: `+91 98${String(10000000 + i * 111111).slice(0, 8)}`,
      email: `${w.name.toLowerCase().replace(/\s+/g, ".")}@buildify.in`,
      address: "Hyderabad, Telangana",
      wage: w.fee,
      wageType: w.feeType === "hour" ? "hour" : "project",
      status: "Active" as WorkerStatus,
      notes: "",
      profile: w.profile,
      activeProjects: (i % 3) + 1,
      createdAt: now,
      updatedAt: now,
    })),
    materials: materialCatalog.map((m) => ({
      id: m.id,
      name: m.name,
      category: m.category,
      type: m.type,
      description: m.description,
      price: m.price,
      unit: m.unit,
      quality: m.quality,
      swatch: m.swatch,
      image: null,
      stockStatus: "Available" as StockStatus,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    })),
  };
}

let state: ManagementState = seedState();
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable */
  }
}

export function hydrateManagement() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<ManagementState>;
      const seed = seedState();
      state = {
        workers: parsed.workers?.length ? parsed.workers : seed.workers,
        materials: parsed.materials?.length ? parsed.materials : seed.materials,
      };
      emit();
    }
  } catch {
    /* ignore corrupt data */
  }
}

function update(next: ManagementState) {
  state = next;
  persist();
  emit();
}

export function getManagement() {
  return state;
}

/** Subscribed snapshot of the management records. */
export function useManagement() {
  const [snapshot, setSnapshot] = useState(state);

  useEffect(() => {
    hydrateManagement();
    setSnapshot(state);
    const listener = () => setSnapshot({ ...state });
    listeners.add(listener);
    return () => listeners.delete(listener);
  }, []);

  return snapshot;
}

/* ---------------- workers ---------------- */

export type WorkerInput = Omit<
  ManagedWorker,
  "id" | "createdAt" | "updatedAt" | "activeProjects" | "profile"
> & { profile?: string };

export function addWorker(input: WorkerInput) {
  const now = new Date().toISOString();
  const worker: ManagedWorker = {
    ...input,
    profile: input.profile ?? input.notes,
    id: `w-${Math.random().toString(36).slice(2, 8)}`,
    activeProjects: 0,
    createdAt: now,
    updatedAt: now,
  };
  update({ ...state, workers: [worker, ...state.workers] });
  return worker;
}

export function updateWorker(id: string, patch: Partial<ManagedWorker>) {
  update({
    ...state,
    workers: state.workers.map((w) =>
      w.id === id ? { ...w, ...patch, updatedAt: new Date().toISOString() } : w,
    ),
  });
}

/**
 * Soft removal — workers assigned to projects are marked Inactive so history
 * stays intact; only unassigned workers are deleted outright.
 */
export function removeWorker(id: string) {
  const worker = state.workers.find((w) => w.id === id);
  if (!worker) return "missing" as const;
  if (worker.activeProjects > 0) {
    updateWorker(id, { status: "Inactive" });
    return "deactivated" as const;
  }
  update({ ...state, workers: state.workers.filter((w) => w.id !== id) });
  return "removed" as const;
}

export function getWorkerById(id: string) {
  return state.workers.find((w) => w.id === id);
}

export function activeWorkers() {
  return state.workers.filter((w) => w.status === "Active");
}

/* ---------------- materials ---------------- */

export type MaterialInput = Omit<ManagedMaterial, "id" | "createdAt" | "updatedAt">;

export function addMaterial(input: MaterialInput) {
  const now = new Date().toISOString();
  const material: ManagedMaterial = {
    ...input,
    id: `m-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: now,
    updatedAt: now,
  };
  update({ ...state, materials: [material, ...state.materials] });
  return material;
}

export function updateMaterial(id: string, patch: Partial<ManagedMaterial>) {
  update({
    ...state,
    materials: state.materials.map((m) =>
      m.id === id ? { ...m, ...patch, updatedAt: new Date().toISOString() } : m,
    ),
  });
}

/** Soft delete — historical projects and confirmed bills keep their records. */
export function removeMaterial(id: string) {
  updateMaterial(id, { isActive: false, stockStatus: "Out of Stock" });
}

export function getManagedMaterial(id: string) {
  return state.materials.find((m) => m.id === id);
}

/** Materials offered during project creation (soft-deleted ones excluded). */
export function selectableMaterials() {
  return state.materials.filter((m) => m.isActive);
}

export const stockStyles: Record<StockStatus, string> = {
  Available: "bg-success/15 text-success border-success/30",
  "Low Stock": "bg-warning/15 text-warning border-warning/30",
  "Out of Stock": "bg-destructive/15 text-destructive border-destructive/30",
};

export const workerStatusStyles: Record<WorkerStatus, string> = {
  Active: "bg-success/15 text-success border-success/30",
  Inactive: "bg-muted/40 text-muted-foreground border-border",
};
