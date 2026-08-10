/**
 * Project Monitor data layer.
 *
 * Shapes mirror the intended Supabase tables — projects, clients, workers,
 * project_workers, blueprints, material_assignments, bills, payments,
 * project_activity — so each list here can be swapped for a query without
 * touching the presentation components.
 */

export type ProjectStage =
  | "Planning"
  | "Blueprint Analysis"
  | "Material Selection"
  | "Design Review"
  | "Manufacturing"
  | "Quality Check"
  | "Ready for Delivery"
  | "Delivered"
  | "Completed"
  | "Cancelled";

export type PaymentStatus = "Paid" | "Unpaid" | "Partially Paid" | "Overdue";

export interface ClientRecord {
  id: string;
  name: string;
  company: string;
  contact: string;
  phone: string;
  email: string;
  address: string;
}

export interface AssignedWorker {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  active: boolean;
}

export interface BlueprintRecord {
  fileName: string;
  fileType: string;
  uploadedAt: string;
  previewTone: string;
  analyzed: boolean;
  furniture: string;
  confidence: number;
  parts: { id: string; label: string; note: string }[];
}

export interface AssignedMaterialRecord {
  id: string;
  material: string;
  assignedTo: string;
  quantity: number;
  unit: string;
  price: number;
}

export interface BillRecord {
  id: string;
  createdAt: string;
  dueDate: string;
  subtotal: number;
  workerFees: number;
  gst: number;
  additional: number;
  total: number;
  confirmed: boolean;
}

export interface PaymentRecord {
  status: PaymentStatus;
  paid: number;
  paidOn: string | null;
  method: string | null;
  notes: string;
}

export interface ProjectDocument {
  id: string;
  label: string;
  detail: string;
  available: boolean;
}

export interface ActivityEntry {
  id: string;
  date: string;
  title: string;
  detail: string;
}

export interface MonitorProject {
  id: string;
  code: string;
  name: string;
  client: ClientRecord;
  team: AssignedWorker[];
  stage: ProjectStage;
  completion: number;
  createdAt: string;
  updatedAt: string;
  date: string;
  dueDate: string;
  blueprint: BlueprintRecord | null;
  materials: AssignedMaterialRecord[];
  designSuggestion: string | null;
  roomVisualization: boolean;
  bill: BillRecord | null;
  payment: PaymentRecord;
  activity: ActivityEntry[];
}

export const projectStages: ProjectStage[] = [
  "Planning",
  "Blueprint Analysis",
  "Material Selection",
  "Design Review",
  "Manufacturing",
  "Quality Check",
  "Ready for Delivery",
  "Delivered",
  "Completed",
  "Cancelled",
];

export const paymentStatuses: PaymentStatus[] = ["Paid", "Unpaid", "Partially Paid", "Overdue"];

/** Badge classes per project stage — Warm Ember accent stays primary. */
export const stageStyles: Record<ProjectStage, string> = {
  Planning: "bg-muted/40 text-muted-foreground border-border",
  "Blueprint Analysis": "bg-accent/10 text-accent border-accent/25",
  "Material Selection": "bg-accent/10 text-accent border-accent/25",
  "Design Review": "bg-accent/15 text-accent border-accent/30",
  Manufacturing: "bg-accent/20 text-accent border-accent/40",
  "Quality Check": "bg-warning/15 text-warning border-warning/30",
  "Ready for Delivery": "bg-warning/15 text-warning border-warning/30",
  Delivered: "bg-success/15 text-success border-success/30",
  Completed: "bg-success/15 text-success border-success/30",
  Cancelled: "bg-destructive/15 text-destructive border-destructive/30",
};

export const paymentStyles: Record<PaymentStatus, string> = {
  Paid: "bg-success/15 text-success border-success/30",
  Unpaid: "bg-accent/15 text-accent border-accent/30",
  "Partially Paid": "bg-warning/15 text-warning border-warning/30",
  Overdue: "bg-destructive/15 text-destructive border-destructive/30",
};

/** Ordered manufacturing pipeline used by the progress timeline. */
export const progressStages = [
  "Blueprint",
  "Materials",
  "Design",
  "Manufacturing",
  "Quality Check",
  "Delivery",
] as const;

/** Maps a project stage onto the 6-step progress timeline index. */
export function stageProgressIndex(stage: ProjectStage) {
  switch (stage) {
    case "Planning":
    case "Blueprint Analysis":
      return 0;
    case "Material Selection":
      return 1;
    case "Design Review":
      return 2;
    case "Manufacturing":
      return 3;
    case "Quality Check":
      return 4;
    case "Ready for Delivery":
    case "Delivered":
    case "Completed":
      return 5;
    default:
      return 0;
  }
}

const worker = (
  id: string,
  name: string,
  role: string,
  phone: string,
  email: string,
  active = true,
): AssignedWorker => ({ id, name, role, phone, email, active });

export const monitorProjects: MonitorProject[] = [
  {
    id: "PRJ-2026-001",
    code: "PRJ-2026-001",
    name: "Skyline Loft Kitchen",
    client: {
      id: "c1",
      name: "Meridian Interiors",
      company: "Meridian Interiors Pvt Ltd",
      contact: "John Mathew",
      phone: "+91 98450 22114",
      email: "projects@meridianinteriors.in",
      address: "Banjara Hills, Hyderabad, Telangana",
    },
    team: [
      worker("w1", "Rahul Kumar", "Senior Carpenter", "+91 98860 10021", "rahul@buildify.studio"),
      worker("w3", "Imran Shaikh", "Finishing Worker", "+91 98860 10023", "imran@buildify.studio"),
    ],
    stage: "Completed",
    completion: 100,
    createdAt: "06 Jun 2026",
    updatedAt: "12 Jul 2026",
    date: "12 Jul 2026",
    dueDate: "10 Jul 2026",
    blueprint: {
      fileName: "skyline-loft-kitchen-v4.pdf",
      fileType: "application/pdf",
      uploadedAt: "07 Jun 2026",
      previewTone: "linear-gradient(150deg,#2f1d14,#c98a3d)",
      analyzed: true,
      furniture: "Modular Kitchen",
      confidence: 94,
      parts: [
        { id: "base", label: "Base Cabinets", note: "6 modules · 3600 mm run" },
        { id: "wall", label: "Wall Units", note: "4 modules · 2400 mm run" },
        { id: "counter", label: "Countertop", note: "Quartz · 3600 × 600 mm" },
        { id: "handles", label: "Handles", note: "Hardware set · 20 units" },
      ],
    },
    materials: [
      { id: "m1", material: "Oak Wood", assignedTo: "Base Cabinets", quantity: 42, unit: "sq.ft", price: 102900 },
      { id: "m2", material: "Brushed Brass", assignedTo: "Handles", quantity: 20, unit: "unit", price: 12800 },
      { id: "m3", material: "Tempered Glass", assignedTo: "Wall Units", quantity: 8, unit: "sq.ft", price: 9600 },
    ],
    designSuggestion: "Modern Minimal Kitchen",
    roomVisualization: true,
    bill: {
      id: "INV-2026-0142",
      createdAt: "08 Jul 2026",
      dueDate: "22 Jul 2026",
      subtotal: 125300,
      workerFees: 38000,
      gst: 29394,
      additional: 8500,
      total: 201194,
      confirmed: true,
    },
    payment: { status: "Paid", paid: 201194, paidOn: "18 Jul 2026", method: "Bank Transfer", notes: "Settled in full." },
    activity: [
      { id: "a1", date: "18 Jul 2026", title: "Payment received", detail: "₹2,01,194 via bank transfer" },
      { id: "a2", date: "12 Jul 2026", title: "Project completed", detail: "Handover signed by client" },
      { id: "a3", date: "08 Jul 2026", title: "Bill confirmed", detail: "INV-2026-0142 locked" },
      { id: "a4", date: "20 Jun 2026", title: "3D visualization generated", detail: "Kitchen room render" },
      { id: "a5", date: "07 Jun 2026", title: "Blueprint analyzed", detail: "94% confidence" },
      { id: "a6", date: "06 Jun 2026", title: "Project created", detail: "Meridian Interiors" },
    ],
  },
  {
    id: "PRJ-2026-002",
    code: "PRJ-2026-002",
    name: "Aurora Office Suite",
    client: {
      id: "c2",
      name: "Northwind Corp",
      company: "Northwind Corporate Services",
      contact: "Priya Nair",
      phone: "+91 99000 31182",
      email: "facilities@northwind.co",
      address: "Whitefield, Bengaluru, Karnataka",
    },
    team: [
      worker("w2", "Arjun Singh", "Furniture Designer", "+91 98860 10022", "arjun@buildify.studio"),
      worker("w5", "Sameer Khan", "Installer", "+91 98860 10025", "sameer@buildify.studio"),
    ],
    stage: "Manufacturing",
    completion: 68,
    createdAt: "02 Jul 2026",
    updatedAt: "05 Aug 2026",
    date: "21 Jul 2026",
    dueDate: "25 Aug 2026",
    blueprint: {
      fileName: "aurora-office-desks.png",
      fileType: "image/png",
      uploadedAt: "03 Jul 2026",
      previewTone: "linear-gradient(150deg,#3a2a20,#a06a44)",
      analyzed: true,
      furniture: "Workstation Cluster",
      confidence: 91,
      parts: [
        { id: "top", label: "Desk Tops", note: "12 units · 1400 × 700 mm" },
        { id: "legs", label: "Steel Legs", note: "24 pairs · 720 mm" },
        { id: "screen", label: "Privacy Screens", note: "12 fabric panels" },
      ],
    },
    materials: [
      { id: "m1", material: "Ash Wood", assignedTo: "Desk Tops", quantity: 120, unit: "sq.ft", price: 222000 },
      { id: "m2", material: "Stainless Steel", assignedTo: "Steel Legs", quantity: 48, unit: "kg", price: 139200 },
      { id: "m3", material: "Linen", assignedTo: "Privacy Screens", quantity: 36, unit: "metre", price: 33840 },
    ],
    designSuggestion: "Contemporary Workstation",
    roomVisualization: true,
    bill: {
      id: "INV-2026-0188",
      createdAt: "01 Aug 2026",
      dueDate: "25 Aug 2026",
      subtotal: 395040,
      workerFees: 62000,
      gst: 82267,
      additional: 18500,
      total: 557807,
      confirmed: true,
    },
    payment: { status: "Unpaid", paid: 0, paidOn: null, method: null, notes: "" },
    activity: [
      { id: "a1", date: "05 Aug 2026", title: "Manufacturing update", detail: "68% complete — frames assembled" },
      { id: "a2", date: "01 Aug 2026", title: "Bill confirmed", detail: "INV-2026-0188 locked" },
      { id: "a3", date: "22 Jul 2026", title: "3D visualization generated", detail: "Open-plan office render" },
      { id: "a4", date: "10 Jul 2026", title: "Material assignments confirmed", detail: "3 materials assigned" },
      { id: "a5", date: "03 Jul 2026", title: "Blueprint analyzed", detail: "91% confidence" },
      { id: "a6", date: "02 Jul 2026", title: "Project created", detail: "Northwind Corp" },
    ],
  },
  {
    id: "PRJ-2026-003",
    code: "PRJ-2026-003",
    name: "Cedar Wardrobe Line",
    client: {
      id: "c3",
      name: "Haus & Co.",
      company: "Haus & Co. Retail",
      contact: "Meera Kapoor",
      phone: "+91 90080 44521",
      email: "buying@hausandco.in",
      address: "Koregaon Park, Pune, Maharashtra",
    },
    team: [worker("w4", "Sunita Desai", "Upholstery Specialist", "+91 98860 10024", "sunita@buildify.studio")],
    stage: "Material Selection",
    completion: 24,
    createdAt: "20 Jul 2026",
    updatedAt: "02 Aug 2026",
    date: "28 Jul 2026",
    dueDate: "18 Sep 2026",
    blueprint: {
      fileName: "cedar-wardrobe-set.jpg",
      fileType: "image/jpeg",
      uploadedAt: "21 Jul 2026",
      previewTone: "linear-gradient(150deg,#4a2f1f,#c96a3d)",
      analyzed: true,
      furniture: "Wardrobe",
      confidence: 88,
      parts: [
        { id: "carcass", label: "Carcass", note: "2400 × 1800 mm" },
        { id: "doors", label: "Sliding Doors", note: "2 panels" },
        { id: "shelves", label: "Internal Shelves", note: "6 adjustable" },
      ],
    },
    materials: [
      { id: "m1", material: "Cedar Wood", assignedTo: "Carcass", quantity: 60, unit: "sq.ft", price: 96000 },
      { id: "m2", material: "Mirror Glass", assignedTo: "Sliding Doors", quantity: 12, unit: "sq.ft", price: 21600 },
    ],
    designSuggestion: null,
    roomVisualization: false,
    bill: {
      id: "INV-2026-0201",
      createdAt: "02 Aug 2026",
      dueDate: "30 Aug 2026",
      subtotal: 117600,
      workerFees: 22000,
      gst: 25128,
      additional: 6500,
      total: 171228,
      confirmed: false,
    },
    payment: {
      status: "Partially Paid",
      paid: 60000,
      paidOn: "04 Aug 2026",
      method: "UPI",
      notes: "Advance received against material procurement.",
    },
    activity: [
      { id: "a1", date: "04 Aug 2026", title: "Advance received", detail: "₹60,000 via UPI" },
      { id: "a2", date: "02 Aug 2026", title: "Draft bill generated", detail: "INV-2026-0201" },
      { id: "a3", date: "28 Jul 2026", title: "Material assignments started", detail: "2 materials assigned" },
      { id: "a4", date: "21 Jul 2026", title: "Blueprint analyzed", detail: "88% confidence" },
      { id: "a5", date: "20 Jul 2026", title: "Project created", detail: "Haus & Co." },
    ],
  },
  {
    id: "PRJ-2026-004",
    code: "PRJ-2026-004",
    name: "Marina Lounge Seating",
    client: {
      id: "c4",
      name: "Blue Harbour Hotels",
      company: "Blue Harbour Hospitality",
      contact: "Devan Pillai",
      phone: "+91 97400 88123",
      email: "projects@blueharbour.com",
      address: "Marine Drive, Kochi, Kerala",
    },
    team: [
      worker("w1", "Rahul Kumar", "Senior Carpenter", "+91 98860 10021", "rahul@buildify.studio"),
      worker("w4", "Sunita Desai", "Upholstery Specialist", "+91 98860 10024", "sunita@buildify.studio"),
      worker("w5", "Sameer Khan", "Installer", "+91 98860 10025", "sameer@buildify.studio", false),
    ],
    stage: "Quality Check",
    completion: 82,
    createdAt: "18 Jun 2026",
    updatedAt: "01 Aug 2026",
    date: "01 Aug 2026",
    dueDate: "20 Jul 2026",
    blueprint: {
      fileName: "marina-lounge-sofa.pdf",
      fileType: "application/pdf",
      uploadedAt: "19 Jun 2026",
      previewTone: "linear-gradient(150deg,#8a6a4a,#e2c79c)",
      analyzed: true,
      furniture: "Lounge Sofa",
      confidence: 93,
      parts: [
        { id: "frame", label: "Frame", note: "Hardwood · 2200 mm" },
        { id: "seat", label: "Seat Cushions", note: "4 units" },
        { id: "legs", label: "Legs", note: "8 turned legs" },
      ],
    },
    materials: [
      { id: "m1", material: "Teak", assignedTo: "Frame", quantity: 38, unit: "sq.ft", price: 155800 },
      { id: "m2", material: "Leather", assignedTo: "Seat Cushions", quantity: 24, unit: "metre", price: 86400 },
    ],
    designSuggestion: "Luxury Wooden Lounge",
    roomVisualization: true,
    bill: {
      id: "INV-2026-0166",
      createdAt: "10 Jul 2026",
      dueDate: "24 Jul 2026",
      subtotal: 242200,
      workerFees: 54000,
      gst: 53316,
      additional: 12000,
      total: 361516,
      confirmed: true,
    },
    payment: { status: "Overdue", paid: 100000, paidOn: "15 Jul 2026", method: "Cheque", notes: "Balance past due date." },
    activity: [
      { id: "a1", date: "01 Aug 2026", title: "Quality check started", detail: "Finish inspection round 1" },
      { id: "a2", date: "24 Jul 2026", title: "Payment overdue", detail: "₹2,61,516 outstanding" },
      { id: "a3", date: "10 Jul 2026", title: "Bill confirmed", detail: "INV-2026-0166 locked" },
      { id: "a4", date: "25 Jun 2026", title: "Material assignments confirmed", detail: "2 materials assigned" },
      { id: "a5", date: "18 Jun 2026", title: "Project created", detail: "Blue Harbour Hotels" },
    ],
  },
  {
    id: "PRJ-2026-005",
    code: "PRJ-2026-005",
    name: "Atrium Reception Desk",
    client: {
      id: "c5",
      name: "Vertex Realty",
      company: "Vertex Realty Group",
      contact: "Karan Malhotra",
      phone: "+91 98110 77345",
      email: "ops@vertexrealty.in",
      address: "Cyber City, Gurugram, Haryana",
    },
    team: [worker("w2", "Arjun Singh", "Furniture Designer", "+91 98860 10022", "arjun@buildify.studio", false)],
    stage: "Cancelled",
    completion: 30,
    createdAt: "12 Jul 2026",
    updatedAt: "03 Aug 2026",
    date: "03 Aug 2026",
    dueDate: "05 Sep 2026",
    blueprint: {
      fileName: "atrium-reception.png",
      fileType: "image/png",
      uploadedAt: "13 Jul 2026",
      previewTone: "linear-gradient(150deg,#3b2b22,#8c5a3a)",
      analyzed: true,
      furniture: "Reception Desk",
      confidence: 86,
      parts: [
        { id: "body", label: "Desk Body", note: "3200 × 900 mm" },
        { id: "front", label: "Front Panel", note: "Curved ACP face" },
      ],
    },
    materials: [{ id: "m1", material: "Walnut", assignedTo: "Desk Body", quantity: 28, unit: "sq.ft", price: 89600 }],
    designSuggestion: null,
    roomVisualization: false,
    bill: null,
    payment: { status: "Unpaid", paid: 0, paidOn: null, method: null, notes: "Project cancelled before billing." },
    activity: [
      { id: "a1", date: "03 Aug 2026", title: "Project cancelled", detail: "Client paused the fit-out" },
      { id: "a2", date: "20 Jul 2026", title: "Material assignment started", detail: "1 material assigned" },
      { id: "a3", date: "13 Jul 2026", title: "Blueprint analyzed", detail: "86% confidence" },
      { id: "a4", date: "12 Jul 2026", title: "Project created", detail: "Vertex Realty" },
    ],
  },
  {
    id: "PRJ-2026-006",
    code: "PRJ-2026-006",
    name: "Nordic Dining Set",
    client: {
      id: "c6",
      name: "Elm Studio",
      company: "Elm Studio Design",
      contact: "Anika Bose",
      phone: "+91 90070 12456",
      email: "hello@elmstudio.design",
      address: "Salt Lake, Kolkata, West Bengal",
    },
    team: [worker("w1", "Rahul Kumar", "Senior Carpenter", "+91 98860 10021", "rahul@buildify.studio")],
    stage: "Delivered",
    completion: 100,
    createdAt: "28 Jun 2026",
    updatedAt: "05 Aug 2026",
    date: "05 Aug 2026",
    dueDate: "02 Aug 2026",
    blueprint: {
      fileName: "nordic-dining-table.jpg",
      fileType: "image/jpeg",
      uploadedAt: "29 Jun 2026",
      previewTone: "linear-gradient(150deg,#5a4436,#d3b58c)",
      analyzed: true,
      furniture: "Dining Set",
      confidence: 92,
      parts: [
        { id: "top", label: "Table Top", note: "1800 × 950 mm" },
        { id: "chairs", label: "Chairs", note: "6 units" },
      ],
    },
    materials: [
      { id: "m1", material: "Beech", assignedTo: "Table Top", quantity: 32, unit: "sq.ft", price: 51840 },
      { id: "m2", material: "Cotton", assignedTo: "Chair Seats", quantity: 12, unit: "metre", price: 7440 },
    ],
    designSuggestion: "Scandinavian Dining",
    roomVisualization: true,
    bill: {
      id: "INV-2026-0177",
      createdAt: "28 Jul 2026",
      dueDate: "11 Aug 2026",
      subtotal: 59280,
      workerFees: 18000,
      gst: 13910,
      additional: 4500,
      total: 95690,
      confirmed: true,
    },
    payment: { status: "Partially Paid", paid: 45000, paidOn: "30 Jul 2026", method: "UPI", notes: "50% milestone paid." },
    activity: [
      { id: "a1", date: "05 Aug 2026", title: "Delivered", detail: "Installed at client site" },
      { id: "a2", date: "30 Jul 2026", title: "Part payment received", detail: "₹45,000 via UPI" },
      { id: "a3", date: "28 Jul 2026", title: "Bill confirmed", detail: "INV-2026-0177 locked" },
      { id: "a4", date: "05 Jul 2026", title: "Material assignments confirmed", detail: "2 materials assigned" },
      { id: "a5", date: "28 Jun 2026", title: "Project created", detail: "Elm Studio" },
    ],
  },
];

export function getMonitorProject(id: string) {
  return monitorProjects.find((p) => p.id === id) ?? null;
}

/** Unique workers across all projects — used by the Assigned Worker filter. */
export function allAssignedWorkers() {
  const map = new Map<string, AssignedWorker>();
  monitorProjects.forEach((p) => p.team.forEach((w) => map.set(w.id, w)));
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export function projectDocuments(p: MonitorProject): ProjectDocument[] {
  return [
    { id: "blueprint", label: "Blueprint", detail: p.blueprint?.fileName ?? "", available: !!p.blueprint },
    {
      id: "analysis",
      label: "AI Analysis",
      detail: p.blueprint?.analyzed ? `${p.blueprint.furniture} · ${p.blueprint.confidence}%` : "",
      available: !!p.blueprint?.analyzed,
    },
    {
      id: "materials",
      label: "Material Preview",
      detail: `${p.materials.length} materials assigned`,
      available: p.materials.length > 0,
    },
    {
      id: "design",
      label: "Design Suggestion",
      detail: p.designSuggestion ?? "",
      available: !!p.designSuggestion,
    },
    { id: "room", label: "Room Visualization", detail: "3D room render", available: p.roomVisualization },
    { id: "bill", label: "Bill / Quotation", detail: p.bill?.id ?? "", available: !!p.bill },
  ];
}

export function formatINR(value: number) {
  return `₹${value.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}
