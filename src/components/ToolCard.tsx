"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";
import { ToolDefinition } from "@/lib/types";
import ToolIcon from "./ToolIcon";
import { CATEGORY_STYLES } from "@/lib/category-styles";

interface ToolCardProps {
  tool: ToolDefinition;
}

export default function ToolCard({ tool }: ToolCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const theme = CATEGORY_STYLES[tool.category] || CATEGORY_STYLES.developer;

  useEffect(() => {
    try {
      const stored = localStorage.getItem("toolify_favorites");
      if (stored) {
        const favs = JSON.parse(stored);
        setIsFavorite(favs.includes(tool.slug));
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [tool.slug]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const stored = localStorage.getItem("toolify_favorites");
      let favs: string[] = stored ? JSON.parse(stored) : [];
      if (favs.includes(tool.slug)) {
        favs = favs.filter((s) => s !== tool.slug);
        setIsFavorite(false);
      } else {
        favs.push(tool.slug);
        setIsFavorite(true);
      }
      localStorage.setItem("toolify_favorites", JSON.stringify(favs));
    } catch {
      // Ignore
    }
  };

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#090d0f] p-5 shadow-sm hover:shadow-card hover:border-brand-400/50 dark:hover:border-brand-400/50 transition-all duration-200">
      <div>
        {/* Header row: Icon & Badge + Favorite */}
        <div className="flex items-center justify-between mb-3.5">
          <div
            className={`w-11 h-11 rounded-xl ${theme.bg} ${theme.text} border ${theme.border} flex items-center justify-center transition-all duration-200 group-hover:scale-105 ${theme.hoverBg} ${theme.hoverText || ""} shadow-sm`}
          >
            <ToolIcon icon={tool.icon} category={tool.category} className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-1.5">
            {tool.badge && (
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-brand-50 dark:bg-brand-400/10 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-400/30">
                {tool.badge}
              </span>
            )}
            <button
              onClick={toggleFavorite}
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
              className="p-1 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <Star
                className={`w-4 h-4 ${
                  isFavorite ? "fill-amber-400 text-amber-500" : "text-slate-300 dark:text-slate-600"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Title */}
        <Link href={`/tools/${tool.slug}`} className="focus:outline-none">
          <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
            {tool.name}
          </h3>
        </Link>

        {/* Description */}
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
          {tool.shortDescription}
        </p>
      </div>

      {/* Footer link */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
        <span className="text-[11px] font-medium text-slate-400 capitalize">
          {tool.category.replace("-", " ")}
        </span>
        <Link
          href={`/tools/${tool.slug}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 dark:text-brand-400 group-hover:translate-x-0.5 transition-transform"
        >
          Use tool <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
