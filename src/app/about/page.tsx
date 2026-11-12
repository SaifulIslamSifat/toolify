import { ShieldCheck, Zap, Heart, Sparkles, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - Toolify",
  description: "Learn about Toolify's mission to provide fast, free, privacy-first online utilities.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
          Our Philosophy
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white mt-2">
          Tools That Actually Work
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 mt-4 leading-relaxed max-w-2xl mx-auto">
          We built Toolify because the internet was tired of fake download buttons, slow server queues, intrusive ads,
          and hidden paywalls for simple everyday tasks.
        </p>
      </div>

      <div className="space-y-12">
        {/* Core Principles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Client-Side Privacy</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your files and photos are computed on your computer via HTML5 Canvas and WebAssembly. We never harvest or
              store your files.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-accent-50 dark:bg-accent-950/60 text-accent-600 dark:text-accent-400 flex items-center justify-center mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Zero Fake Progress</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We never fabricate simulated progress bars or generate dummy downloads. Every button and tool performs real
              computation.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-pink-50 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 flex items-center justify-center mb-4">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Free For Everyone</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              No account creation required, no email capture, and no watermarks placed on your exported photos or PDFs.
            </p>
          </div>
        </div>

        {/* Narrative */}
        <div className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Built for Creators & Engineers</h2>
          <p>
            Whether you need to quickly compress an image for a client email, merge two signed PDF agreements, calculate a
            loan payment, or format a messy JSON API response, Toolify gives you reliable utilities in one clean,
            consistent interface.
          </p>
          <p>
            Unlike traditional utility websites that upload your personal documents to unknown remote servers and take
            minutes to return results, Toolify leverages the full processing power of your modern browser to deliver
            instant results while keeping your data strictly confidential.
          </p>
        </div>

        <div className="text-center pt-4">
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-500/20 transition-all hover:scale-105"
          >
            Explore All Tools
          </Link>
        </div>
      </div>
    </div>
  );
}
