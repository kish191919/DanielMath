import {
  ArrowUpDown,
  ChartColumn,
  ChartPie,
  Circle,
  Clock,
  Coins,
  Dices,
  Divide,
  Hash,
  LayoutGrid,
  Minus,
  Percent,
  Plus,
  Ruler,
  Scale,
  Shuffle,
  Target,
  TrendingUp,
  Triangle,
  Variable,
  X,
  type LucideIcon,
} from "lucide-react";
import type { GradeNum } from "@/lib/worksheets/types";
import type { UnitColor, UnitIcon } from "@/lib/worksheets/units";

export const UNIT_ICONS: Record<UnitIcon, LucideIcon> = {
  hash: Hash,
  "arrow-up-down": ArrowUpDown,
  target: Target,
  plus: Plus,
  minus: Minus,
  "layout-grid": LayoutGrid,
  x: X,
  divide: Divide,
  shuffle: Shuffle,
  "pie-chart": ChartPie,
  scale: Scale,
  clock: Clock,
  coins: Coins,
  "trending-up": TrendingUp,
  ruler: Ruler,
  dices: Dices,
  percent: Percent,
  triangle: Triangle,
  "bar-chart": ChartColumn,
  circle: Circle,
  variable: Variable,
};

type Swatch = {
  /** Solid letter tile. */
  tile: string;
  /** Tinted background for chips and the open card header. */
  soft: string;
  /** Text on white or on `soft`. */
  text: string;
  /** Hover ring and border. */
  ring: string;
  /** Progress bar fill. */
  bar: string;
};

// Full class strings so Tailwind can see them.
export const UNIT_COLORS: Record<UnitColor, Swatch> = {
  sky: { tile: "bg-sky-500 text-white", soft: "bg-sky-50", text: "text-sky-700", ring: "ring-sky-200 hover:ring-sky-300", bar: "bg-sky-400" },
  violet: { tile: "bg-violet-500 text-white", soft: "bg-violet-50", text: "text-violet-700", ring: "ring-violet-200 hover:ring-violet-300", bar: "bg-violet-400" },
  amber: { tile: "bg-amber-500 text-white", soft: "bg-amber-50", text: "text-amber-700", ring: "ring-amber-200 hover:ring-amber-300", bar: "bg-amber-400" },
  emerald: { tile: "bg-emerald-500 text-white", soft: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-200 hover:ring-emerald-300", bar: "bg-emerald-400" },
  rose: { tile: "bg-rose-500 text-white", soft: "bg-rose-50", text: "text-rose-700", ring: "ring-rose-200 hover:ring-rose-300", bar: "bg-rose-400" },
  indigo: { tile: "bg-indigo-500 text-white", soft: "bg-indigo-50", text: "text-indigo-700", ring: "ring-indigo-200 hover:ring-indigo-300", bar: "bg-indigo-400" },
  orange: { tile: "bg-orange-500 text-white", soft: "bg-orange-50", text: "text-orange-700", ring: "ring-orange-200 hover:ring-orange-300", bar: "bg-orange-400" },
  cyan: { tile: "bg-cyan-500 text-white", soft: "bg-cyan-50", text: "text-cyan-700", ring: "ring-cyan-200 hover:ring-cyan-300", bar: "bg-cyan-400" },
  fuchsia: { tile: "bg-fuchsia-500 text-white", soft: "bg-fuchsia-50", text: "text-fuchsia-700", ring: "ring-fuchsia-200 hover:ring-fuchsia-300", bar: "bg-fuchsia-400" },
  pink: { tile: "bg-pink-500 text-white", soft: "bg-pink-50", text: "text-pink-700", ring: "ring-pink-200 hover:ring-pink-300", bar: "bg-pink-400" },
  purple: { tile: "bg-purple-500 text-white", soft: "bg-purple-50", text: "text-purple-700", ring: "ring-purple-200 hover:ring-purple-300", bar: "bg-purple-400" },
  blue: { tile: "bg-blue-500 text-white", soft: "bg-blue-50", text: "text-blue-700", ring: "ring-blue-200 hover:ring-blue-300", bar: "bg-blue-400" },
  lime: { tile: "bg-lime-500 text-white", soft: "bg-lime-50", text: "text-lime-700", ring: "ring-lime-200 hover:ring-lime-300", bar: "bg-lime-400" },
  teal: { tile: "bg-teal-500 text-white", soft: "bg-teal-50", text: "text-teal-700", ring: "ring-teal-200 hover:ring-teal-300", bar: "bg-teal-400" },
};

/** Each grade gets its own color on the hub and in page headers. */
export const GRADE_COLORS: Record<GradeNum, UnitColor> = { 3: "sky", 4: "emerald", 5: "violet", 6: "orange" };
