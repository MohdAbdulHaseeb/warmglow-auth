/**
 * Static catalog data (materials, workers, additional cost presets).
 * Kept out of UI components so it can be swapped for a Supabase-backed
 * service later without touching presentation code.
 */

export type MaterialCategory = "Wood" | "Metal" | "Fabric" | "Glass" | "Other";

export interface CatalogMaterial {
  id: string;
  name: string;
  category: MaterialCategory;
  type: string;
  /** Price per unit, in INR. */
  price: number;
  unit: string;
  quality: "Standard" | "Premium" | "Luxury";
  description: string;
  /** CSS gradient used as the material swatch/texture placeholder. */
  swatch: string;
}

export const materialCatalog: CatalogMaterial[] = [
  { id: "oak", name: "Oak", category: "Wood", type: "Hardwood", price: 2450, unit: "sq.ft", quality: "Premium", description: "Dense, durable grain with a warm honey tone. Excellent for load-bearing parts.", swatch: "linear-gradient(135deg,#b4813f,#e0b378 55%,#c69354)" },
  { id: "walnut", name: "Walnut", category: "Wood", type: "Hardwood", price: 3200, unit: "sq.ft", quality: "Luxury", description: "Deep chocolate tones with rich figuring. A premium furniture surface.", swatch: "linear-gradient(135deg,#4a2f22,#8b5c3d 60%,#5c3a29)" },
  { id: "teak", name: "Teak", category: "Wood", type: "Hardwood", price: 4100, unit: "sq.ft", quality: "Luxury", description: "Naturally oily and weather resistant, ideal for long-life pieces.", swatch: "linear-gradient(135deg,#8a5a2b,#c99755 60%,#9c6c34)" },
  { id: "mahogany", name: "Mahogany", category: "Wood", type: "Hardwood", price: 3650, unit: "sq.ft", quality: "Luxury", description: "Reddish-brown classic with a fine, straight grain and deep polish.", swatch: "linear-gradient(135deg,#6b2d1d,#a4513a 60%,#7c3626)" },
  { id: "pine", name: "Pine", category: "Wood", type: "Softwood", price: 980, unit: "sq.ft", quality: "Standard", description: "Light, economical softwood suited to frames and hidden structure.", swatch: "linear-gradient(135deg,#c8a473,#eddcbb 60%,#d5b98c)" },
  { id: "ash", name: "Ash", category: "Wood", type: "Hardwood", price: 1850, unit: "sq.ft", quality: "Premium", description: "Pale, shock-resistant timber with a pronounced open grain.", swatch: "linear-gradient(135deg,#d6c19a,#f0e4cb 60%,#dccbaa)" },
  { id: "beech", name: "Beech", category: "Wood", type: "Hardwood", price: 1620, unit: "sq.ft", quality: "Standard", description: "Fine even texture, steam-bends well for curved backrests.", swatch: "linear-gradient(135deg,#c9a37a,#e8d2b4 60%,#d3af88)" },

  { id: "stainless", name: "Stainless Steel", category: "Metal", type: "Alloy", price: 2900, unit: "kg", quality: "Premium", description: "Corrosion-resistant satin finish for frames and connectors.", swatch: "linear-gradient(135deg,#8f979c,#dfe5e8 55%,#9aa2a7)" },
  { id: "aluminium", name: "Aluminium", category: "Metal", type: "Alloy", price: 1750, unit: "kg", quality: "Standard", description: "Lightweight and easy to extrude, great for slim structural legs.", swatch: "linear-gradient(135deg,#9aa0a4,#e7ebee 55%,#a7adb1)" },
  { id: "brass", name: "Brass", category: "Metal", type: "Alloy", price: 3400, unit: "kg", quality: "Luxury", description: "Warm golden accents for hardware, caps and detailing.", swatch: "linear-gradient(135deg,#a8813f,#f2c98a 55%,#b08c48)" },
  { id: "iron", name: "Iron", category: "Metal", type: "Ferrous", price: 1100, unit: "kg", quality: "Standard", description: "Heavy, rigid and cost effective for industrial style bases.", swatch: "linear-gradient(135deg,#3b3a39,#6d6b69 55%,#454342)" },

  { id: "cotton", name: "Cotton", category: "Fabric", type: "Natural weave", price: 620, unit: "metre", quality: "Standard", description: "Breathable everyday upholstery in a soft matte weave.", swatch: "linear-gradient(135deg,#cfc4b4,#efe7dc 55%,#d6ccbd)" },
  { id: "linen", name: "Linen", category: "Fabric", type: "Natural weave", price: 940, unit: "metre", quality: "Premium", description: "Textured natural fibre with an elegant relaxed drape.", swatch: "linear-gradient(135deg,#c4b8a4,#e6ddcc 55%,#cabda9)" },
  { id: "velvet", name: "Velvet", category: "Fabric", type: "Pile weave", price: 1480, unit: "metre", quality: "Luxury", description: "Dense soft pile with a deep light-catching sheen.", swatch: "linear-gradient(135deg,#5b2436,#9a4257 55%,#6c2c40)" },
  { id: "leather", name: "Leather", category: "Fabric", type: "Full grain hide", price: 3900, unit: "sq.ft", quality: "Luxury", description: "Full-grain hide that patinas beautifully with use.", swatch: "linear-gradient(135deg,#4b2c1c,#8a5330 55%,#5c361f)" },

  { id: "clear-glass", name: "Clear Glass", category: "Glass", type: "Float glass", price: 850, unit: "sq.ft", quality: "Standard", description: "Transparent float glass for tops and display panels.", swatch: "linear-gradient(135deg,rgba(180,220,230,.8),rgba(240,250,252,.95) 55%,rgba(190,225,235,.85))" },
  { id: "frosted-glass", name: "Frosted Glass", category: "Glass", type: "Etched", price: 1050, unit: "sq.ft", quality: "Premium", description: "Acid-etched diffusion for privacy with soft light transfer.", swatch: "linear-gradient(135deg,rgba(205,220,225,.9),rgba(238,244,246,.95) 55%,rgba(210,224,229,.9))" },
  { id: "tempered-glass", name: "Tempered Glass", category: "Glass", type: "Toughened", price: 1650, unit: "sq.ft", quality: "Premium", description: "Heat-treated safety glass, 4x stronger than standard float.", swatch: "linear-gradient(135deg,rgba(170,205,215,.85),rgba(232,244,247,.95) 55%,rgba(182,214,223,.9))" },

  { id: "rattan", name: "Rattan Weave", category: "Other", type: "Natural cane", price: 1250, unit: "sq.ft", quality: "Premium", description: "Hand-woven cane panels for breathable, textural surfaces.", swatch: "linear-gradient(135deg,#b98f4f,#e3c58d 55%,#c49a5b)" },
  { id: "foam", name: "High-Density Foam", category: "Other", type: "Cushion core", price: 540, unit: "sheet", quality: "Standard", description: "Resilient 40-density core for seats and backrest padding.", swatch: "linear-gradient(135deg,#d8cfc4,#f2ece4 55%,#ded5cb)" },
];

export const materialCategories: MaterialCategory[] = ["Wood", "Metal", "Fabric", "Glass", "Other"];

export function getMaterial(id: string) {
  return materialCatalog.find((m) => m.id === id);
}

export interface Worker {
  id: string;
  name: string;
  role: string;
  profile: string;
  fee: number;
  feeType: "hour" | "project";
}

export const workers: Worker[] = [
  { id: "w1", name: "Rakesh Menon", role: "Master Carpenter", profile: "14 years in solid-wood joinery and CNC-assisted assembly.", fee: 850, feeType: "hour" },
  { id: "w2", name: "Ananya Rao", role: "Furniture Designer", profile: "Specialises in ergonomic seating and material pairing.", fee: 24000, feeType: "project" },
  { id: "w3", name: "Imran Shaikh", role: "Finishing Worker", profile: "Polishing, lacquering and premium surface finishing.", fee: 520, feeType: "hour" },
  { id: "w4", name: "Sunita Desai", role: "Upholstery Specialist", profile: "Leather and velvet upholstery with hand-stitched detailing.", fee: 640, feeType: "hour" },
  { id: "w5", name: "Vikram Iyer", role: "Installer", profile: "On-site assembly, levelling and client handover.", fee: 18000, feeType: "project" },
];

export const additionalCostPresets = [
  { label: "Transportation", amount: 6500 },
  { label: "Installation", amount: 12000 },
  { label: "Design Fee", amount: 15000 },
  { label: "Other Expenses", amount: 5000 },
];
