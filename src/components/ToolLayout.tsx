"use client";

import { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Star,
  Share2,
  HelpCircle,
  BookOpen,
  Sparkles,
  ChevronDown,
  Check,
} from "lucide-react";
import { ToolDefinition } from "@/lib/types";
import { getRelatedTools } from "@/lib/tools-registry";
import ToolCard from "./ToolCard";
import ToolIcon from "./ToolIcon";
import { CATEGORY_STYLES } from "@/lib/category-styles";
import AdPlaceholder from "./AdPlaceholder";
import { copyToClipboard } from "@/lib/utils";

interface ToolLayoutProps {
  tool: ToolDefinition;
  children: ReactNode;
}

export default function ToolLayout({ tool, children }: ToolLayoutProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const relatedTools = getRelatedTools(tool.slug, 3);
  const theme = CATEGORY_STYLES[tool.category] || CATEGORY_STYLES.developer;

  useEffect(() => {
    try {
      const stored = localStorage.getItem("toolify_favorites");
      if (stored) {
        const favs: string[] = JSON.parse(stored);
        setIsFavorite(favs.includes(tool.slug));
      }

      // Add to recently used
      const storedRecent = localStorage.getItem("toolify_recent");
      let recent: string[] = storedRecent ? JSON.parse(storedRecent) : [];
      recent = [tool.slug, ...recent.filter((s) => s !== tool.slug)].slice(0, 10);
      localStorage.setItem("toolify_recent", JSON.stringify(recent));
    } catch {
      // Ignore localStorage errors
    }
  }, [tool.slug]);

  const toggleFavorite = () => {
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

  const handleShare = async () => {
    const success = await copyToClipboard(window.location.href);
    if (success) {
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* 1. Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 flex-wrap">
        <Link href="/" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <Link href="/tools" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
          Tools
        </Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <Link
          href={`/category/${tool.category}`}
          className="hover:text-brand-600 dark:hover:text-brand-400 capitalize transition-colors"
        >
          {tool.category.replace("-", " ")}
        </Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="text-slate-800 dark:text-slate-200 font-medium truncate">{tool.name}</span>
      </nav>

      {/* 2. Tool Title, Description, Icon, and Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-start gap-4">
          <div
            className={`w-14 h-14 rounded-2xl ${theme.bg} ${theme.text} border ${theme.border} flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5`}
          >
            <ToolIcon icon={tool.icon} category={tool.category} className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {tool.name}
              </h1>
              {tool.badge && (
                <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-brand-100 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                  {tool.badge}
                </span>
              )}
            </div>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
              {tool.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto flex-shrink-0">
          <button
            onClick={toggleFavorite}
            aria-label="Favorite tool"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
              isFavorite
                ? "border-amber-300 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300"
                : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700"
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${isFavorite ? "fill-amber-400 text-amber-500" : ""}`} />
            <span>{isFavorite ? "Favorited" : "Favorite"}</span>
          </button>

          <button
            onClick={handleShare}
            aria-label="Share tool link"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 text-xs font-semibold transition-all"
          >
            {copiedShare ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">Copied Link</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3. Main Tool Workspace (The Interactive Core) */}
      <div className="mb-12 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-elevated overflow-hidden">
        {children}
      </div>

      {/* Non-intrusive Ad space */}
      <AdPlaceholder />

      {/* 4. Step-by-Step Instructions */}
      {tool.howToSteps && tool.howToSteps.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              How to use {tool.name}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tool.howToSteps.map((step, idx) => (
              <div
                key={idx}
                className="relative flex flex-col p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
              >
                <div className={`w-8 h-8 rounded-xl ${theme.bg} ${theme.text} border ${theme.border} font-bold text-sm flex items-center justify-center mb-3`}>
                  {idx + 1}
                </div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1.5">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Tool FAQs */}
      {tool.faqs && tool.faqs.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-3">
            {tool.faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-semibold text-sm sm:text-base text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${
                        isOpen ? "rotate-180 text-brand-600 dark:text-brand-400" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. Related Tools */}
      {relatedTools.length > 0 && (
        <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Related {tool.category.replace("-", " ")} Tools
              </h2>
            </div>
            <Link
              href={`/category/${tool.category}`}
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
            >
              View all in category →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {relatedTools.map((rel) => (
              <ToolCard key={rel.slug} tool={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
