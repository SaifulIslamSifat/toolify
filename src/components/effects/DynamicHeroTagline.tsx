"use client";

import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

const TAGLINES = [
  { prefix: "Crafted with Precision", text: "Engineered by Saiful Islam Sifat" },
  { prefix: "All-in-One Suite", text: "Image, PDF, Developer, Generator & Fiverr Utilities" },
];

export default function DynamicHeroTagline() {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % TAGLINES.length);
        setFade(true);
      }, 350);
    }, 4200);

    return () => clearInterval(interval);
  }, []);

  const current = TAGLINES[index];

  return (
    <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/80 dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 shadow-sm backdrop-blur-md transition-all">
      <span className="flex h-3 w-3 relative flex-shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-600 dark:bg-brand-400 shadow-sm shadow-brand-500/50"></span>
      </span>

      <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
        {current.prefix}
      </span>

      <span className="text-slate-300 dark:text-slate-700">&bull;</span>

      <div
        className={`text-xs font-semibold text-slate-700 dark:text-slate-300 transition-all duration-300 transform ${
          fade ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1.5"
        }`}
      >
        <span>{current.text}</span>
      </div>
    </div>
  );
}