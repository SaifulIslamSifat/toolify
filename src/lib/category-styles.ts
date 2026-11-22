export interface CategoryStyle {
  bg: string;
  text: string;
  border: string;
  hoverBg: string;
  hoverText?: string;
}

export const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  image: {
    bg: "bg-emerald-500/10 dark:bg-emerald-950/40",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-500/20 dark:border-emerald-800/50",
    hoverBg: "group-hover:bg-emerald-500/20 dark:group-hover:bg-emerald-900/50",
    hoverText: "group-hover:text-emerald-700 dark:group-hover:text-emerald-300",
  },
  pdf: {
    bg: "bg-rose-500/10 dark:bg-rose-950/40",
    text: "text-rose-600 dark:text-rose-400",
    border: "border-rose-500/20 dark:border-rose-800/50",
    hoverBg: "group-hover:bg-rose-500/20 dark:group-hover:bg-rose-900/50",
    hoverText: "group-hover:text-rose-700 dark:group-hover:text-rose-300",
  },
  calculators: {
    bg: "bg-amber-500/10 dark:bg-amber-950/40",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-500/20 dark:border-amber-800/50",
    hoverBg: "group-hover:bg-amber-500/20 dark:group-hover:bg-amber-900/50",
    hoverText: "group-hover:text-amber-700 dark:group-hover:text-amber-300",
  },
  "unit-converters": {
    bg: "bg-teal-500/10 dark:bg-teal-950/40",
    text: "text-teal-600 dark:text-teal-400",
    border: "border-teal-500/20 dark:border-teal-800/50",
    hoverBg: "group-hover:bg-teal-500/20 dark:group-hover:bg-teal-900/50",
    hoverText: "group-hover:text-teal-700 dark:group-hover:text-teal-300",
  },
  text: {
    bg: "bg-cyan-500/10 dark:bg-cyan-950/40",
    text: "text-cyan-600 dark:text-cyan-400",
    border: "border-cyan-500/20 dark:border-cyan-800/50",
    hoverBg: "group-hover:bg-cyan-500/20 dark:group-hover:bg-cyan-900/50",
    hoverText: "group-hover:text-cyan-700 dark:group-hover:text-cyan-300",
  },
  developer: {
    bg: "bg-orange-500/10 dark:bg-orange-950/40",
    text: "text-orange-600 dark:text-orange-400",
    border: "border-orange-500/20 dark:border-orange-800/50",
    hoverBg: "group-hover:bg-orange-500/20 dark:group-hover:bg-orange-900/50",
    hoverText: "group-hover:text-orange-700 dark:group-hover:text-orange-300",
  },
  generators: {
    bg: "bg-brand-400/10 dark:bg-brand-400/15",
    text: "text-brand-600 dark:text-brand-400",
    border: "border-brand-400/20 dark:border-brand-400/30",
    hoverBg: "group-hover:bg-brand-400/20 dark:group-hover:bg-brand-400/25",
    hoverText: "group-hover:text-brand-700 dark:group-hover:text-brand-300",
  },
  seo: {
    bg: "bg-emerald-500/10 dark:bg-emerald-950/40",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-500/20 dark:border-emerald-800/50",
    hoverBg: "group-hover:bg-emerald-500/20 dark:group-hover:bg-emerald-900/50",
    hoverText: "group-hover:text-emerald-700 dark:group-hover:text-emerald-300",
  },
  internet: {
    bg: "bg-cyan-500/10 dark:bg-cyan-950/40",
    text: "text-cyan-600 dark:text-cyan-400",
    border: "border-cyan-500/20 dark:border-cyan-800/50",
    hoverBg: "group-hover:bg-cyan-500/20 dark:group-hover:bg-cyan-900/50",
    hoverText: "group-hover:text-cyan-700 dark:group-hover:text-cyan-300",
  },
  fiverr: {
    bg: "bg-brand-400/10 dark:bg-brand-400/15",
    text: "text-brand-600 dark:text-brand-400",
    border: "border-brand-400/20 dark:border-brand-400/30",
    hoverBg: "group-hover:bg-brand-400/20 dark:group-hover:bg-brand-400/25",
    hoverText: "group-hover:text-brand-700 dark:group-hover:text-brand-300",
  },
};
