import {
  LayoutDashboard,
  FolderKanban,
  ScanLine,
  Sparkles,
  Layers,
  Sofa,
  Factory,
  ReceiptText,
  BarChart3,
  Bell,
  User,
  Settings,
  LogOut,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  icon: LucideIcon;
  to: string;
}

/** Sidebar navigation. Routes that don't exist yet point at the dashboard. */
export const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
  { label: "Projects", icon: FolderKanban, to: "/projects" },
  { label: "Blueprint Analysis", icon: ScanLine, to: "/blueprints" },
  { label: "AI Room Generator", icon: Sparkles, to: "/dashboard" },
  { label: "Material Library", icon: Layers, to: "/dashboard" },
  { label: "Furniture Catalog", icon: Sofa, to: "/dashboard" },
  { label: "Manufacturing", icon: Factory, to: "/dashboard" },
  { label: "Bills & Quotations", icon: ReceiptText, to: "/dashboard" },
  { label: "Analytics", icon: BarChart3, to: "/analytics" },
  { label: "Notifications", icon: Bell, to: "/dashboard" },
  { label: "Profile", icon: User, to: "/settings" },
  { label: "Settings", icon: Settings, to: "/settings" },
];

export const logoutItem: NavItem = { label: "Logout", icon: LogOut, to: "/" };

export type ProjectStatus = "Completed" | "In Progress" | "Pending" | "Cancelled";

export interface Project {
  id: string;
  name: string;
  client: string;
  status: ProjectStatus;
  completion: number;
  date: string;
}

export const recentProjects: Project[] = [
  { id: "p1", name: "Skyline Loft Kitchen", client: "Meridian Interiors", status: "Completed", completion: 100, date: "12 Jul 2026" },
  { id: "p2", name: "Aurora Office Suite", client: "Northwind Corp", status: "In Progress", completion: 68, date: "21 Jul 2026" },
  { id: "p3", name: "Cedar Wardrobe Line", client: "Haus & Co.", status: "Pending", completion: 12, date: "28 Jul 2026" },
  { id: "p4", name: "Marina Lounge Seating", client: "Blue Harbour Hotels", status: "In Progress", completion: 45, date: "01 Aug 2026" },
  { id: "p5", name: "Atrium Reception Desk", client: "Vertex Realty", status: "Cancelled", completion: 30, date: "03 Aug 2026" },
  { id: "p6", name: "Nordic Dining Set", client: "Elm Studio", status: "Completed", completion: 100, date: "05 Aug 2026" },
];

export const statusStyles: Record<ProjectStatus, string> = {
  Completed: "bg-success/15 text-success border-success/30",
  "In Progress": "bg-accent/15 text-accent border-accent/30",
  Pending: "bg-warning/15 text-warning border-warning/30",
  Cancelled: "bg-destructive/15 text-destructive border-destructive/30",
};

export interface Material {
  id: string;
  name: string;
  rating: number;
  price: string;
  sustainability: number;
  tone: string;
}

export const materials: Material[] = [
  { id: "m1", name: "European Oak Veneer", rating: 4.8, price: "₹2,450 / sheet", sustainability: 92, tone: "linear-gradient(135deg,#8a5a34,#c98d5c)" },
  { id: "m2", name: "Matte Walnut Laminate", rating: 4.6, price: "₹1,780 / sheet", sustainability: 84, tone: "linear-gradient(135deg,#4a2f22,#8b5c3d)" },
  { id: "m3", name: "Brushed Brass Hardware", rating: 4.9, price: "₹640 / unit", sustainability: 71, tone: "linear-gradient(135deg,#a8813f,#f2c98a)" },
  { id: "m4", name: "Recycled MDF Core", rating: 4.4, price: "₹980 / sheet", sustainability: 96, tone: "linear-gradient(135deg,#5a4436,#9c8069)" },
];

export const manufacturingStages = [
  { label: "Design", detail: "Blueprint finalised", done: true },
  { label: "Approved", detail: "Client sign-off", done: true },
  { label: "Manufacturing", detail: "CNC in progress", done: true },
  { label: "Quality Check", detail: "Awaiting inspection", done: false },
  { label: "Ready", detail: "Packing pending", done: false },
  { label: "Delivered", detail: "Scheduled 18 Aug", done: false },
];

export const projectsPerMonth = [
  { month: "Feb", projects: 12 },
  { month: "Mar", projects: 18 },
  { month: "Apr", projects: 15 },
  { month: "May", projects: 24 },
  { month: "Jun", projects: 21 },
  { month: "Jul", projects: 31 },
];

export const revenueData = [
  { month: "Feb", revenue: 6.2 },
  { month: "Mar", revenue: 7.4 },
  { month: "Apr", revenue: 7.1 },
  { month: "May", revenue: 9.6 },
  { month: "Jun", revenue: 10.8 },
  { month: "Jul", revenue: 12.8 },
];

export const materialUsage = [
  { name: "Oak", value: 34 },
  { name: "Walnut", value: 26 },
  { name: "MDF", value: 22 },
  { name: "Metal", value: 18 },
];

export const manufacturingPerformance = [
  { stage: "Design", value: 96 },
  { stage: "Cutting", value: 88 },
  { stage: "Assembly", value: 79 },
  { stage: "QC", value: 91 },
  { stage: "Dispatch", value: 84 },
];

export interface ActivityItem {
  id: string;
  title: string;
  detail: string;
  time: string;
}

export const activityFeed: ActivityItem[] = [
  { id: "a1", title: "Blueprint uploaded", detail: "skyline-loft-v4.pdf", time: "2 min ago" },
  { id: "a2", title: "Project approved", detail: "Aurora Office Suite", time: "48 min ago" },
  { id: "a3", title: "Bill generated", detail: "INV-2026-0188 · ₹1.4L", time: "3 hrs ago" },
  { id: "a4", title: "Room rendered", detail: "Marina Lounge — variant B", time: "Yesterday" },
  { id: "a5", title: "Material selected", detail: "European Oak Veneer", time: "Yesterday" },
];

export interface NotificationItem {
  id: string;
  title: string;
  detail: string;
  time: string;
  unread: boolean;
}

export const notifications: NotificationItem[] = [
  { id: "n1", title: "Project Approved", detail: "Northwind Corp signed off Aurora Office Suite.", time: "10m", unread: true },
  { id: "n2", title: "AI Finished Analysis", detail: "18 furniture items detected with 94% confidence.", time: "1h", unread: true },
  { id: "n3", title: "New Bill Generated", detail: "INV-2026-0188 is ready to send.", time: "4h", unread: true },
  { id: "n4", title: "Manufacturing Completed", detail: "Nordic Dining Set moved to dispatch.", time: "1d", unread: false },
];
