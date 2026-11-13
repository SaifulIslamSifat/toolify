export interface CategoryStyle {
  bg: string;
  text: string;
  border: string;
  hoverBg: string;
  hoverText?: string;
}

export const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  image: {
    bg: "bg-purple-100 dark:bg-purple-950/70",
    text: "text-purple-600 dark:text-purple-400",
    border: "border-purple-200 dark:border-purple-800/70",
    hoverBg: "group-hover:bg-purple-200 dark:group-hover:bg-purple-900/60",
    hoverText: "group-hover:text-purple-700 dark:group-hover:text-purple-300",
  },
  pdf: {
    bg: "bg-rose-100 dark:bg-rose-950/70",
    text: "text-rose-600 dark:text-rose-400",
    border: "border-rose-200 dark:border-rose-800/70",
    hoverBg: "group-hover:bg-rose-200 dark:group-hover:bg-rose-900/60",
    hoverText: "group-hover:text-rose-700 dark:group-hover:text-rose-300",
  },
  calculators: {
    bg: "bg-amber-100 dark:bg-amber-950/70",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-800/70",
    hoverBg: "group-hover:bg-amber-200 dark:group-hover:bg-amber-900/60",
    hoverText: "group-hover:text-amber-700 dark:group-hover:text-amber-300",
  },
  "unit-converters": {
    bg: "bg-emerald-100 dark:bg-emerald-950/70",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-800/70",
    hoverBg: "group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/60",
    hoverText: "group-hover:text-emerald-700 dark:group-hover:text-emerald-300",
  },
  text: {
    bg: "bg-blue-100 dark:bg-blue-950/70",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800/70",
    hoverBg: "group-hover:bg-blue-200 dark:group-hover:bg-blue-900/60",
    hoverText: "group-hover:text-blue-700 dark:group-hover:text-blue-300",
  },
  developer: {
    bg: "bg-violet-100 dark:bg-violet-950/70",
    text: "text-violet-600 dark:text-violet-400",
    border: "border-violet-200 dark:border-violet-800/70",
    hoverBg: "group-hover:bg-violet-200 dark:group-hover:bg-violet-900/60",
    hoverText: "group-hover:text-violet-700 dark:group-hover:text-violet-300",
  },
  generators: {
    bg: "bg-pink-100 dark:bg-pink-950/70",
    text: "text-pink-600 dark:text-pink-400",
    border: "border-pink-200 dark:border-pink-800/70",
    hoverBg: "group-hover:bg-pink-200 dark:group-hover:bg-pink-900/60",
    hoverText: "group-hover:text-pink-700 dark:group-hover:text-pink-300",
  },
  seo: {
    bg: "bg-indigo-100 dark:bg-indigo-950/70",
    text: "text-indigo-600 dark:text-indigo-400",
    border: "border-indigo-200 dark:border-indigo-800/70",
    hoverBg: "group-hover:bg-indigo-200 dark:group-hover:bg-indigo-900/60",
    hoverText: "group-hover:text-indigo-700 dark:group-hover:text-indigo-300",
  },
  internet: {
    bg: "bg-cyan-100 dark:bg-cyan-950/70",
    text: "text-cyan-600 dark:text-cyan-400",
    border: "border-cyan-200 dark:border-cyan-800/70",
    hoverBg: "group-hover:bg-cyan-200 dark:group-hover:bg-cyan-900/60",
    hoverText: "group-hover:text-cyan-700 dark:group-hover:text-cyan-300",
  },
  fiverr: {
    bg: "bg-emerald-100 dark:bg-emerald-950/70",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-800/70",
    hoverBg: "group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/60",
    hoverText: "group-hover:text-emerald-700 dark:group-hover:text-emerald-300",
  },
};
