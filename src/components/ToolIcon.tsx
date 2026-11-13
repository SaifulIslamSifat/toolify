"use client";

import {
  Image as ImageIcon,
  FileText,
  Calculator,
  ArrowRightLeft,
  Type,
  Code2,
  Sparkles,
  Search,
  Globe,
  ShieldAlert,
  ShieldCheck,
  Minimize2,
  Scissors,
  RotateCw,
  Repeat,
  Pipette,
  Eraser,
  Files,
  FileSearch,
  Activity,
  Calendar,
  Percent,
  DollarSign,
  Tag,
  Thermometer,
  Ruler,
  Scale,
  HardDrive,
  AlignLeft,
  CaseUpper,
  GitCompare,
  Link2,
  FileCode,
  Braces,
  Key,
  QrCode,
  Fingerprint,
  Binary,
  Hash,
  Clock,
  Terminal,
  Bot,
  Tags,
  Network,
  Wifi,
  ListOrdered,
  Layers,
  Crop,
  FilePlus,
  LucideProps,
} from "lucide-react";
import { ToolCategory } from "@/lib/types";

// Dynamic Lucide icon lookup mapping
const ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  Image: ImageIcon,
  FileText: FileText,
  Calculator: Calculator,
  ArrowRightLeft: ArrowRightLeft,
  Type: Type,
  Code2: Code2,
  Sparkles: Sparkles,
  Search: Search,
  Globe: Globe,
  ShieldAlert: ShieldAlert,
  ShieldCheck: ShieldCheck,
  Minimize2: Minimize2,
  Scissors: Scissors,
  RotateCw: RotateCw,
  Repeat: Repeat,
  Pipette: Pipette,
  Eraser: Eraser,
  Files: Files,
  FileSearch: FileSearch,
  Activity: Activity,
  Calendar: Calendar,
  Percent: Percent,
  DollarSign: DollarSign,
  Tag: Tag,
  Thermometer: Thermometer,
  Ruler: Ruler,
  Scale: Scale,
  HardDrive: HardDrive,
  AlignLeft: AlignLeft,
  CaseUpper: CaseUpper,
  GitCompare: GitCompare,
  Link2: Link2,
  FileCode: FileCode,
  Braces: Braces,
  Key: Key,
  QrCode: QrCode,
  Fingerprint: Fingerprint,
  Binary: Binary,
  Hash: Hash,
  Clock: Clock,
  Terminal: Terminal,
  Bot: Bot,
  Tags: Tags,
  Network: Network,
  Wifi: Wifi,
  ListOrdered: ListOrdered,
  Crop: Crop,
  FilePlus: FilePlus,
  Layers: Layers,
};

// Category-based modern color styling (guarantees clear contrast in both light and dark mode)
export const CATEGORY_ICON_THEMES: Record<
  ToolCategory | string,
  {
    bg: string;
    text: string;
    border: string;
    hoverBg: string;
    hoverText: string;
  }
> = {
  image: {
    bg: "bg-purple-50 dark:bg-purple-950/60",
    text: "text-purple-600 dark:text-purple-400",
    border: "border-purple-200 dark:border-purple-800/60",
    hoverBg: "group-hover:bg-purple-600",
    hoverText: "group-hover:text-white",
  },
  pdf: {
    bg: "bg-rose-50 dark:bg-rose-950/60",
    text: "text-rose-600 dark:text-rose-400",
    border: "border-rose-200 dark:border-rose-800/60",
    hoverBg: "group-hover:bg-rose-600",
    hoverText: "group-hover:text-white",
  },
  calculators: {
    bg: "bg-amber-50 dark:bg-amber-950/60",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-800/60",
    hoverBg: "group-hover:bg-amber-600",
    hoverText: "group-hover:text-white",
  },
  "unit-converters": {
    bg: "bg-emerald-50 dark:bg-emerald-950/60",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-800/60",
    hoverBg: "group-hover:bg-emerald-600",
    hoverText: "group-hover:text-white",
  },
  text: {
    bg: "bg-blue-50 dark:bg-blue-950/60",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800/60",
    hoverBg: "group-hover:bg-blue-600",
    hoverText: "group-hover:text-white",
  },
  developer: {
    bg: "bg-violet-50 dark:bg-violet-950/60",
    text: "text-violet-600 dark:text-violet-400",
    border: "border-violet-200 dark:border-violet-800/60",
    hoverBg: "group-hover:bg-violet-600",
    hoverText: "group-hover:text-white",
  },
  generators: {
    bg: "bg-pink-50 dark:bg-pink-950/60",
    text: "text-pink-600 dark:text-pink-400",
    border: "border-pink-200 dark:border-pink-800/60",
    hoverBg: "group-hover:bg-pink-600",
    hoverText: "group-hover:text-white",
  },
  seo: {
    bg: "bg-indigo-50 dark:bg-indigo-950/60",
    text: "text-indigo-600 dark:text-indigo-400",
    border: "border-indigo-200 dark:border-indigo-800/60",
    hoverBg: "group-hover:bg-indigo-600",
    hoverText: "group-hover:text-white",
  },
  internet: {
    bg: "bg-cyan-50 dark:bg-cyan-950/60",
    text: "text-cyan-600 dark:text-cyan-400",
    border: "border-cyan-200 dark:border-cyan-800/60",
    hoverBg: "group-hover:bg-cyan-600",
    hoverText: "group-hover:text-white",
  },
  fiverr: {
    bg: "bg-emerald-50 dark:bg-emerald-950/60",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-800/60",
    hoverBg: "group-hover:bg-emerald-600",
    hoverText: "group-hover:text-white",
  },
};

interface ToolIconProps {
  icon?: string;
  category?: ToolCategory | string;
  className?: string;
}

export default function ToolIcon({
  icon = "Layers",
  category = "developer",
  className = "w-5 h-5",
}: ToolIconProps) {
  const IconComponent = ICON_MAP[icon] || Layers;
  return <IconComponent className={className} />;
}
