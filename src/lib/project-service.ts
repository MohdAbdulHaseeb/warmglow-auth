/**
 * Mock service layer for the Canvas workflow.
 *
 * NOTE: no AI model or 3D engine is connected yet. Every function here
 * returns deterministic placeholder data after a simulated delay. The
 * signatures are intentionally async and file-based so each one can be
 * swapped for a real server function / AI Gateway call without changing
 * any component.
 */
import type { BlueprintAnalysis, BlueprintFile, DesignSuggestion, MaterialAssignment } from "./project-store";
import { getMaterial } from "./catalog";

export const ACCEPTED_BLUEPRINT_TYPES = ["application/pdf", "image/png", "image/jpeg"];
export const MAX_FILE_MB = 25;

export function validateFile(file: File, accept: string[] = ACCEPTED_BLUEPRINT_TYPES) {
  if (!accept.includes(file.type)) {
    return "Unsupported format. Upload a PDF, PNG, JPG or JPEG file.";
  }
  if (file.size > MAX_FILE_MB * 1024 * 1024) {
    return `File is too large. Maximum size is ${MAX_FILE_MB}MB.`;
  }
  return null;
}

export function readFileAsBlueprint(file: File): Promise<BlueprintFile> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read that file."));
    reader.onload = () =>
      resolve({
        name: file.name,
        type: file.type,
        size: file.size,
        dataUrl: typeof reader.result === "string" ? reader.result : "",
      });
    reader.readAsDataURL(file);
  });
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

const CHAIR_ANALYSIS: BlueprintAnalysis = {
  furniture: "Chair",
  structure: "Four-leg frame with a floating seat pan, sculpted backrest and bolt-through armrests.",
  confidence: 94,
  cost: 4800,
  parts: [
    { id: "seat", label: "Seat", note: "Primary contact surface · 480 × 460 mm" },
    { id: "backrest", label: "Backrest", note: "Curved lumbar panel · 420 × 380 mm" },
    { id: "leg-fl", label: "Front Left Leg", note: "Tapered · 440 mm" },
    { id: "leg-fr", label: "Front Right Leg", note: "Tapered · 440 mm" },
    { id: "leg-bl", label: "Back Left Leg", note: "Tapered · 440 mm" },
    { id: "leg-br", label: "Back Right Leg", note: "Tapered · 440 mm" },
    { id: "armrest-l", label: "Left Armrest", note: "Bolt-through · 320 mm" },
    { id: "armrest-r", label: "Right Armrest", note: "Bolt-through · 320 mm" },
  ],
  characteristics: [
    "Mid-century silhouette",
    "Load path through rear legs",
    "Upholstery-ready seat pan",
    "Exposed joinery details",
    "Suitable for hardwood + fabric mix",
  ],
};

const TABLE_ANALYSIS: BlueprintAnalysis = {
  furniture: "Table",
  structure: "Rectangular top on an apron frame with four corner legs and a lower stretcher.",
  confidence: 91,
  cost: 9600,
  parts: [
    { id: "top", label: "Table Top", note: "1600 × 900 mm surface" },
    { id: "apron", label: "Apron Frame", note: "Perimeter support rail" },
    { id: "leg-fl", label: "Front Left Leg", note: "Square section · 720 mm" },
    { id: "leg-fr", label: "Front Right Leg", note: "Square section · 720 mm" },
    { id: "leg-bl", label: "Back Left Leg", note: "Square section · 720 mm" },
    { id: "leg-br", label: "Back Right Leg", note: "Square section · 720 mm" },
    { id: "stretcher", label: "Stretcher", note: "Lower cross brace" },
  ],
  characteristics: ["Dining scale", "Solid-top construction", "Edge banding required", "Knock-down assembly"],
};

const CABINET_ANALYSIS: BlueprintAnalysis = {
  furniture: "Cabinet",
  structure: "Carcass box with two hinged doors, three internal shelves and a plinth base.",
  confidence: 89,
  cost: 14200,
  parts: [
    { id: "carcass", label: "Carcass", note: "Main box · 1800 × 900 mm" },
    { id: "door-l", label: "Left Door", note: "Hinged panel" },
    { id: "door-r", label: "Right Door", note: "Hinged panel" },
    { id: "shelves", label: "Internal Shelves", note: "3 adjustable shelves" },
    { id: "back-panel", label: "Back Panel", note: "Rear closing panel" },
    { id: "plinth", label: "Plinth Base", note: "100 mm recessed base" },
    { id: "handles", label: "Handles", note: "Hardware set" },
  ],
  characteristics: ["Storage unit", "Hardware-heavy", "Veneer or laminate finish", "Wall-anchor recommended"],
};

/** Mock AI blueprint analysis — picks a template from the file name. */
export async function analyzeBlueprint(
  file: BlueprintFile,
  onProgress?: (p: number) => void,
): Promise<BlueprintAnalysis> {
  const total = 2200;
  const started = Date.now();
  await new Promise<void>((resolve) => {
    const id = setInterval(() => {
      const pct = Math.min(100, Math.round(((Date.now() - started) / total) * 100));
      onProgress?.(pct);
      if (pct >= 100) {
        clearInterval(id);
        resolve();
      }
    }, 80);
  });

  const n = file.name.toLowerCase();
  if (n.includes("table") || n.includes("desk")) return TABLE_ANALYSIS;
  if (n.includes("cabinet") || n.includes("wardrobe") || n.includes("shelf")) return CABINET_ANALYSIS;
  return CHAIR_ANALYSIS;
}

/**
 * Mock AI re-analysis. Combines the original analysis with the assigned
 * materials and the optionally selected design to produce updated values
 * that OVERWRITE the initial analysis result.
 */
export async function reanalyzeBlueprint(
  base: BlueprintAnalysis,
  assignments: MaterialAssignment[],
  selectedDesignName?: string,
  onProgress?: (p: number) => void,
): Promise<BlueprintAnalysis> {
  const total = 2000;
  const started = Date.now();
  await new Promise<void>((resolve) => {
    const id = setInterval(() => {
      const pct = Math.min(100, Math.round(((Date.now() - started) / total) * 100));
      onProgress?.(pct);
      if (pct >= 100) {
        clearInterval(id);
        resolve();
      }
    }, 80);
  });

  const materials = assignments
    .map((a) => ({ part: a.partId, material: getMaterial(a.materialId) }))
    .filter((m) => m.material);

  const cost = Math.round(
    materials.reduce((sum, m) => sum + (m.material?.price ?? 0) * 0.45, 0) || base.cost,
  );

  const grouped = new Map<string, number>();
  materials.forEach((m) => grouped.set(m.material!.name, (grouped.get(m.material!.name) ?? 0) + 1));
  const summary = [...grouped.entries()].map(([name, n]) => `${name}×${n}`).join(", ");

  const coverage = base.parts.length ? materials.length / base.parts.length : 0;
  const confidence = Math.min(99, Math.round(base.confidence + coverage * 5 + (selectedDesignName ? 1 : 0)));

  return {
    ...base,
    confidence,
    cost,
    furniture: summary ? `${base.furniture} with ${summary}` : base.furniture,
    structure: selectedDesignName
      ? `${base.structure} Adapted to the ${selectedDesignName} design direction.`
      : base.structure,
    characteristics: [
      ...base.characteristics,
      ...(summary ? [`Material set: ${summary}`] : []),
      ...(selectedDesignName ? [`Design: ${selectedDesignName}`] : []),
    ],
  };
}

/** Mock 2D material preview generation. */
export async function generateMaterialPreview(assignments: MaterialAssignment[]): Promise<boolean> {
  await new Promise((r) => setTimeout(r, 1800));
  return assignments.length > 0;
}

/** Mock AI design suggestions derived from the analysis + assigned materials. */
export async function generateDesignSuggestions(
  analysis: BlueprintAnalysis,
  assignments: MaterialAssignment[],
): Promise<DesignSuggestion[]> {
  await new Promise((r) => setTimeout(r, 2000));
  const names = [...new Set(assignments.map((a) => getMaterial(a.materialId)?.name).filter(Boolean))].join(", ");
  const summary = names || "Selected materials";
  const type = analysis.furniture;
  return [
    { id: "s1", name: `Modern Minimal ${type}`, description: "Pared-back geometry, thin profiles and clean shadow lines.", materials: summary, tone: "linear-gradient(150deg,#3a2a20,#a06a44)" },
    { id: "s2", name: `Scandinavian ${type}`, description: "Light timber, soft radii and an airy, functional stance.", materials: summary, tone: "linear-gradient(150deg,#8a6a4a,#e2c79c)" },
    { id: "s3", name: `Luxury Wooden ${type}`, description: "Deep grain, brass detailing and a hand-polished finish.", materials: summary, tone: "linear-gradient(150deg,#2f1d14,#c98a3d)" },
    { id: "s4", name: `Contemporary ${type}`, description: "Mixed-material contrast with sculpted, gallery-ready form.", materials: summary, tone: "linear-gradient(150deg,#4a2f1f,#c96a3d)" },
  ];
}

/** Mock room analysis + 3D room generation. */
export async function generateRoomVisualization(onStage?: (stage: string) => void): Promise<boolean> {
  onStage?.("Analyzing Room...");
  await new Promise((r) => setTimeout(r, 1600));
  onStage?.("Generating 3D Room...");
  await new Promise((r) => setTimeout(r, 2000));
  return true;
}

export function formatCurrency(value: number) {
  return `₹${value.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}
