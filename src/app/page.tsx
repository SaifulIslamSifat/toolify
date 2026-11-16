"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Sparkles,
  Zap,
  ShieldCheck,
  Laptop,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  ChevronDown,
  Layers,
} from "lucide-react";
import { CATEGORIES, getPopularTools, getFeaturedTools, TOOLS } from "@/lib/tools-registry";
import ToolCard from "@/components/ToolCard";
import ToolIcon from "@/components/ToolIcon";
import SearchModal from "@/components/SearchModal";
import { CATEGORY_STYLES } from "@/lib/category-styles";
import Interactive3DSphere from "@/components/effects/Interactive3DSphere";
import DynamicHeroTagline from "@/components/effects/DynamicHeroTagline";
import ScrollReveal from "@/components/effects/ScrollReveal";

export default function HomePage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const popularTools = getPopularTools();
  const featuredTools = getFeaturedTools();

  const faqs = [
    {
      question: "Is Toolify really 100% free?",
      answer: "Yes, all tools on Toolify are free to use with no hidden charges, mandatory account registration, or subscriptions.",
    },
    {
      question: "Are my uploaded files and private data safe?",
      answer: "Absolutely. Most file manipulations (image compression, PDF merging, conversions) and calculations happen purely inside your browser using client-side WebAssembly, Canvas, and JavaScript. Your files are not stored on our servers.",
    },
    {
      question: "Do you fake progress bars or file processing?",
      answer: "Never. Toolify is built on genuine functionality. Every progress indicator reflects actual computational progress, and all output files are real results created from your inputs.",
    },
    {
      question: "Can I use Toolify on mobile phones and tablets?",
      answer: "Yes! Toolify is fully responsive and optimized for mobile devices, tablets, and desktop workstations.",
    },
    {
      question: "What are the file size limits?",
      answer: "Because processing happens locally on your device, file size limits are generous (typically 25MB - 50MB) to ensure smooth browser responsiveness.",
    },
  ];

  return (
    <div className="flex flex-col gap-16 sm:gap-24 pb-20">
      {/* 1. Hero Section */}
      <section className="relative pt-10 sm:pt-16 pb-12 overflow-hidden bg-gradient-to-b from-brand-50/60 via-transparent to-transparent dark:from-brand-950/20">
        {/* Ambient Gradient Lighting */}
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[340px] bg-gradient-to-tr from-brand-500/15 via-indigo-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />
        <div className="absolute top-1/3 right-1/4 w-[450px] h-[300px] bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14 text-center lg:text-left">
            {/* Left Content Column */}
            <div className="flex-1 max-w-2xl">
              {/* Dynamic Tagline */}
              <div className="mb-6 flex justify-center lg:justify-start">
                <DynamicHeroTagline />
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.08] mb-6">
                Everything You Need,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-indigo-500 to-purple-600">
                  All in One Place.
                </span>
              </h1>

              {/* Subtext */}
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                Powerful, simple and free online utilities crafted with genuine functionality. Process images, PDFs, text, and calculations securely inside your browser.
              </p>

              {/* Search Bar */}
              <div className="max-w-xl mx-auto lg:mx-0 mb-6">
                <div
                  onClick={() => setIsSearchOpen(true)}
                  className="flex items-center gap-3 w-full px-5 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-elevated hover:border-brand-500 dark:hover:border-brand-500 cursor-pointer transition-all group"
                >
                  <Search className="w-5 h-5 text-slate-400 group-hover:text-brand-600 transition-colors" />
                  <span className="text-sm sm:text-base text-slate-400 dark:text-slate-500 flex-1 text-left">
                    Search any tool (e.g., &quot;compress image&quot;, &quot;merge pdf&quot;, &quot;qr code&quot;)...
                  </span>
                  <kbd className="hidden sm:inline-flex px-2 py-1 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-lg">
                    Ctrl K
                  </kbd>
                </div>
              </div>

              {/* Popular Search Shortcuts */}
              <div className="flex items-center justify-center lg:justify-start gap-2 flex-wrap text-xs text-slate-500 dark:text-slate-400">
                <span className="font-medium text-slate-400">Quick shortcuts:</span>
                <Link
                  href="/tools/image-compressor"
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors shadow-sm"
                >
                  Image Compressor
                </Link>
                <Link
                  href="/tools/barcode-generator"
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors shadow-sm"
                >
                  Barcode Maker
                </Link>
                <Link
                  href="/tools/merge-pdf"
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors shadow-sm"
                >
                  Merge PDF
                </Link>
                <Link
                  href="/tools/password-generator"
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors shadow-sm"
                >
                  Password Gen
                </Link>
                <Link
                  href="/tools/word-counter"
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors shadow-sm"
                >
                  Word Counter
                </Link>
              </div>
            </div>

            {/* Right Interactive 3D Sphere Showcase Card */}
            <div className="flex-shrink-0 flex flex-col items-center justify-center relative w-full lg:w-auto">
              <div className="relative p-5 sm:p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/70 shadow-elevated backdrop-blur-xl flex flex-col items-center justify-center overflow-hidden transition-all duration-300 hover:shadow-glow group">
                {/* Soft ambient corner glows inside the card */}
                <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-brand-500/10 dark:bg-brand-500/20 blur-2xl pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-28 h-28 rounded-full bg-indigo-500/10 dark:bg-cyan-500/20 blur-2xl pointer-events-none" />

                <Interactive3DSphere />

                <div className="mt-3 inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 text-[11px] font-mono text-slate-600 dark:text-slate-400 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Interactive 3D • Reacts to Cursor</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Popular Tools Grid */}
      <ScrollReveal>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Popular Tools
              </h2>
              <p className="text-sm text-slate-500 mt-1">Our most used daily productivity utilities</p>
            </div>
            <Link
              href="/tools"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 dark:text-brand-400 hover:underline"
            >
              Browse all ({TOOLS.length}) tools <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularTools.slice(0, 6).map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* 3. Browse by Category */}
      <ScrollReveal>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Browse by Category
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Organized directories covering every aspect of digital workflows
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CATEGORIES.map((cat) => {
              const count = TOOLS.filter((t) => t.category === cat.id && t.status === "active").length;
              const style = CATEGORY_STYLES[cat.id] || {
                bg: "bg-brand-100 dark:bg-brand-950/70",
                text: "text-brand-600 dark:text-brand-400",
                border: "border-brand-200 dark:border-brand-800/70",
                hoverBg: "group-hover:bg-brand-200 dark:group-hover:bg-brand-900/60",
              };
              return (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="group flex flex-col p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-card hover:border-brand-400 dark:hover:border-brand-700 transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-2xl ${style.bg} ${style.text} ${style.border} border ${style.hoverBg} flex items-center justify-center shadow-sm group-hover:scale-110 transition-all duration-200`}
                    >
                      <ToolIcon icon={cat.icon} className={`w-6 h-6 ${style.text}`} />
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {count} tools
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed flex-1">
                    {cat.description}
                  </p>
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center text-xs font-semibold text-brand-600 dark:text-brand-400 group-hover:translate-x-1 transition-transform">
                    Explore category <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </ScrollReveal>

      {/* 4. Featured Tools Section */}
      <ScrollReveal>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="rounded-3xl border border-brand-200 dark:border-brand-900/60 bg-gradient-to-br from-brand-50/50 via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-900/90 dark:to-brand-950/30 p-8 sm:p-12 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                  Staff Picks
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                  Featured Utilities
                </h2>
                <p className="text-sm text-slate-500 mt-1">High-performance tools with advanced client-side processing</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredTools.slice(0, 3).map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* 5. Why Choose Toolify */}
      <ScrollReveal>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Why Choose Toolify
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Engineered for privacy, speed, and real functionality with zero fluff
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm text-center">
              <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Browser Privacy</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Files are converted locally using Canvas and WebAssembly. Confidential documents never leave your PC.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm text-center">
              <div className="w-12 h-12 rounded-xl bg-accent-50 dark:bg-accent-950/60 text-accent-600 dark:text-accent-400 flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Instant Speed</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                No server queuing or waiting in lines. Processing starts immediately when you drop files or type text.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm text-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4">
                <Laptop className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">No Software Installs</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Works directly in your modern web browser on Mac, Windows, Linux, iOS, and Android without plugins.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm text-center">
              <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Genuinely Functional</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                No fake simulations, mock downloads, or bloated ads. Every action delivers a real, usable result.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* 6. How It Works */}
      <ScrollReveal>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 sm:p-12 shadow-sm">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                Simple 3-Step Process
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                How Toolify Works
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white font-black text-lg flex items-center justify-center mb-4 shadow-md shadow-brand-500/20">
                  1
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Select a Tool</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Choose the utility you need from our categorized directory or use Ctrl+K to jump straight to it.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white font-black text-lg flex items-center justify-center mb-4 shadow-md shadow-brand-500/20">
                  2
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Input or Upload</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Paste your text, type your values, or drag and drop your photos and documents into the workspace.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white font-black text-lg flex items-center justify-center mb-4 shadow-md shadow-brand-500/20">
                  3
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Download or Copy</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Process in milliseconds and copy your formatted result or download your optimized files immediately.
                </p>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* 7. Homepage FAQs */}
      <ScrollReveal>
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 text-brand-600 dark:text-brand-400 mb-2">
              <HelpCircle className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">FAQ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-500 mt-1">Clear answers about how Toolify works</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left font-semibold text-sm sm:text-base text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${
                        isOpen ? "rotate-180 text-brand-600" : ""
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
        </section>
      </ScrollReveal>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}
