"use client";

import { useState, useEffect, useRef } from "react";

const TAGLINES = [
  { prefix: "Crafted with Precision", text: "Engineered by Saiful Islam Sifat" },
  { prefix: "All-in-One Suite", text: "Image, PDF, Developer, Generator & Fiverr Utilities" },
];

export default function DynamicHeroTagline() {
  const badgeRef = useRef<HTMLDivElement>(null);
  // Fixed initial dimensions matching both taglines so border size never jumps or resizes
  const [dims, setDims] = useState<{ width: number; height: number }>({ width: 485, height: 40 });
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  // Measure exact badge dimensions on mount and window resize
  useEffect(() => {
    const updateDims = () => {
      if (badgeRef.current) {
        const rect = badgeRef.current.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          setDims({ width: Math.round(rect.width), height: Math.round(rect.height) });
        }
      }
    };

    updateDims();

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && badgeRef.current) {
      ro = new ResizeObserver(updateDims);
      ro.observe(badgeRef.current);
    }

    window.addEventListener("resize", updateDims);
    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener("resize", updateDims);
    };
  }, []);

  // Tagline rotation
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

  // Mathematical pill border centerline path: stable and constant for both taglines
  const w = dims.width || 485;
  const h = dims.height || 40;
  const r = h / 2;
  const pathD = `M ${r} 0.5 L ${w - r} 0.5 A ${r - 0.5} ${r - 0.5} 0 0 1 ${w - r} ${h - 0.5} L ${r} ${h - 0.5} A ${r - 0.5} ${r - 0.5} 0 0 1 ${r} 0.5 Z`;

  return (
    <div
      ref={badgeRef}
      // Fixed border dimensions for both taglines so the dot continuously follows the border without resetting or glitching
      className="relative inline-flex items-center w-full sm:w-[485px] max-w-[485px] h-[40px] rounded-full bg-white/80 dark:bg-[#090d0f]/90 border border-slate-200/90 dark:border-white/10 shadow-sm backdrop-blur-md"
    >
      {/* Animated circular glowing dot traveling continuously along the exact border */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        aria-hidden="true"
      >
        <defs>
          <filter id="badge-dot-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Glowing Aura Halo */}
        <circle r="5" className="fill-brand-500/40 dark:fill-brand-400/50" filter="url(#badge-dot-glow)">
          <animateMotion dur="5.5s" repeatCount="indefinite" path={pathD} />
        </circle>

        {/* Outer Brand Circular Dot */}
        <circle r="3" className="fill-brand-600 dark:fill-brand-400">
          <animateMotion dur="5.5s" repeatCount="indefinite" path={pathD} />
        </circle>

        {/* Bright Center Pinpoint Core */}
        <circle r="1.5" fill="#ffffff">
          <animateMotion dur="5.5s" repeatCount="indefinite" path={pathD} />
        </circle>
      </svg>

      {/* Badge Content Container: vertically centered & perfectly balanced */}
      <div className="flex items-center gap-2 sm:gap-2.5 px-4 h-full w-full select-none">
        <span className="flex h-3 w-3 relative flex-shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-600 dark:bg-brand-400 shadow-sm shadow-brand-500/50"></span>
        </span>

        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 flex-shrink-0">
          {current.prefix}
        </span>

        <span className="text-slate-300 dark:text-slate-700 flex-shrink-0">&bull;</span>

        <div
          className={`text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 transition-all duration-300 transform truncate flex-1 ${
            fade ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1.5"
          }`}
        >
          <span className="truncate">{current.text}</span>
        </div>
      </div>
    </div>
  );
}
