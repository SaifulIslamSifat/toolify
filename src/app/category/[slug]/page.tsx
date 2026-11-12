import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Layers } from "lucide-react";
import { CATEGORIES, getToolsByCategory } from "@/lib/tools-registry";
import { ToolCategory } from "@/lib/types";
import ToolCard from "@/components/ToolCard";
import type { Metadata } from "next";

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return CATEGORIES.map((cat) => ({
    slug: cat.slug,
  }));
}

export function generateMetadata({ params }: CategoryPageProps): Metadata {
  const category = CATEGORIES.find((c) => c.slug === params.slug);
  if (!category) {
    return { title: "Category Not Found - Toolify" };
  }
  return {
    title: `${category.name} - Free Online Utilities | Toolify`,
    description: category.description,
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = CATEGORIES.find((c) => c.slug === params.slug);

  if (!category) {
    notFound();
  }

  const tools = getToolsByCategory(category.id as ToolCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-brand-600 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <Link href="/tools" className="hover:text-brand-600 transition-colors">
          Tools
        </Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="text-slate-800 dark:text-slate-200 font-medium">{category.name}</span>
      </nav>

      {/* Category Header */}
      <div className="mb-10 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${category.gradient} flex items-center justify-center text-white shadow-md flex-shrink-0`}>
            <Layers className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {category.name}
              </h1>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {tools.length} tools
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
              {category.description}
            </p>
          </div>
        </div>

        <Link
          href="/tools"
          className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline self-start md:self-auto"
        >
          ← Browse all categories
        </Link>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </div>
  );
}
