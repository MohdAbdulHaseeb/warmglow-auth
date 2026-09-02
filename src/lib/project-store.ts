/**
 * Client-side project workflow store.
 *
 * Holds the whole Canvas + Bill state in one place, persisted to
 * localStorage so Previous/Next navigation (and a page reload) never loses
 * data. The shape mirrors the intended database tables — Projects,
 * Blueprints, MaterialAssignments, DesignSuggestions, RoomImages, Workers,
 * Bills, BillItems — so it can be swapped for Lovable Cloud persistence by
 * replacing the read/write functions in `project-service.ts`.
 */
import { useSyncExternalStore } from "react";

export interface BlueprintFile {
  name: string;
  type: string;
  size: number;
  dataUrl: string;
}

export interface BlueprintAnalysis {
  furniture: string;
  structure: string;
  parts: { id: string; label: string; note: string }[];
  characteristics: string[];
  confidence: number;
  /** Estimated material cost in INR for the detected parts. */
  cost: number;
}

export type RoomStatus = "not-started" | "generating" | "generated" | "skipped";


export interface MaterialAssignment {
  partId: string;
  materialId: string;
  quantity: number;
}

export interface DesignSuggestion {
  id: string;
  name: string;
  description: string;
  materials: string;
  tone: string;
}

export type RoomSide = "front" | "back" | "left" | "right";

export interface AdditionalCost {
  id: string;
  label: string;
  amount: number;
}

export interface CompanyDetails {
  name: string;
  address: string;
  phone: string;
  email: string;
  gst: string;
  notes: string;
}

export interface ClientDetails {
  name: string;
  address: string;
  phone: string;
  email: string;
  gst: string;
}

export interface BillState {
  id: string | null;
  company: CompanyDetails;
  client: ClientDetails;
  workerIds: string[];
  workerFees: Record<string, number>;
  dueDate: string;
  materialPrices: Record<string, number>;
  removedMaterialParts: string[];
  additionalCosts: AdditionalCost[];
  gstPercent: number;
  discount: number;
  locked: boolean;
  confirmedAt: string | null;
}

export interface ProjectState {
  projectId: string;
  projectName: string;
  createdAt: string;
  blueprint: BlueprintFile | null;
  /** The current (latest) analysis — re-analysis overwrites this. */
  analysis: BlueprintAnalysis | null;
  /** Kept for history/audit only; the UI always shows `analysis`. */
  initialAnalysis: BlueprintAnalysis | null;
  analysisUpdated: boolean;
  assignments: MaterialAssignment[];
  materialPreviewReady: boolean;
  suggestions: DesignSuggestion[];
  selectedDesignId: string | null;
  roomImages: Partial<Record<RoomSide, BlueprintFile>>;
  roomGenerated: boolean;
  roomStatus: RoomStatus;
  bill: BillState;
}

const STORAGE_KEY = "buildify-project-v1";

export function createEmptyProject(name = "Untitled Project"): ProjectState {
  return {
    projectId: `prj-${Math.random().toString(36).slice(2, 8)}`,
    projectName: name,
    createdAt: new Date().toISOString(),
    blueprint: null,
    analysis: null,
    initialAnalysis: null,
    analysisUpdated: false,
    assignments: [],
    materialPreviewReady: false,
    suggestions: [],
    selectedDesignId: null,
    roomImages: {},
    roomGenerated: false,
    roomStatus: "not-started",
    bill: {
      id: null,
      company: {
        name: "Buildify Furniture Works",
        address: "24 Ember Lane, Industrial Estate, Bengaluru 560068",
        phone: "+91 98450 11223",
        email: "billing@buildify.studio",
        gst: "29ABCDE1234F1Z5",
        notes: "",
      },
      client: { name: "", address: "", phone: "", email: "", gst: "" },
      workerIds: [],
      workerFees: {},
      dueDate: "",
      materialPrices: {},
      removedMaterialParts: [],
      additionalCosts: [],
      gstPercent: 18,
      discount: 0,
      locked: false,
      confirmedAt: null,
    },
  };
}

let state: ProjectState = createEmptyProject();
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* quota or private mode — state stays in memory */
  }
}

export function hydrateProject() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as ProjectState;
      const withCost = (a: BlueprintAnalysis | null) => (a ? { ...a, cost: a.cost ?? 0 } : null);
      state = {
        ...createEmptyProject(),
        ...parsed,
        analysis: withCost(parsed.analysis),
        initialAnalysis: withCost(parsed.initialAnalysis),
        bill: { ...createEmptyProject().bill, ...parsed.bill },
      };
      emit();
    }
  } catch {
    /* corrupt payload — keep the empty project */
  }
}

export function getProject() {
  return state;
}

export function setProject(updater: (prev: ProjectState) => ProjectState) {
  state = updater(state);
  persist();
  emit();
}

export function patchProject(patch: Partial<ProjectState>) {
  setProject((prev) => ({ ...prev, ...patch }));
}

export function patchBill(patch: Partial<BillState>) {
  setProject((prev) => ({ ...prev, bill: { ...prev.bill, ...patch } }));
}

export function resetProject(name?: string) {
  state = createEmptyProject(name);
  persist();
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Reactive access to the project workflow state. */
export function useProject() {
  return useSyncExternalStore(subscribe, getProject, getProject);
}
