import Link from "next/link";
import { Wrench, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto mb-6 shadow-sm">
          <Wrench className="w-8 h-8" />
        </div>
        <span className="text-sm font-bold uppercase tracking-wider text-brand-600">Error 404</span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-1 mb-3">
          Tool Not Found
        </h1>
        <p className="text-sm text-slate-500 mb-8 leading-relaxed">
          The tool or page you are looking for doesn&apos;t exist, has been renamed, or has moved to another category.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <Link
            href="/tools"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold text-xs hover:border-brand-400 transition-all"
          >
            <Search className="w-4 h-4" />
            Browse All Tools
          </Link>
        </div>
      </div>
    </div>
  );
}
