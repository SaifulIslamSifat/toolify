"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wrench, Search, ChevronDown, Menu, X, Sparkles } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import SearchModal from "./SearchModal";
import { CATEGORIES } from "@/lib/tools-registry";

export default function Header() {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
                Toolify<span className="text-brand-600 dark:text-brand-400">.</span>
              </span>
              <span className="text-[10px] -mt-1 font-medium text-slate-400 dark:text-slate-500 tracking-wider uppercase">
                Free Online Utilities
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === "/"
                  ? "text-brand-600 dark:text-brand-400 bg-brand-50/60 dark:bg-brand-950/40"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50"
              }`}
            >
              Home
            </Link>
            <Link
              href="/tools"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === "/tools"
                  ? "text-brand-600 dark:text-brand-400 bg-brand-50/60 dark:bg-brand-950/40"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50"
              }`}
            >
              All Tools
            </Link>

            {/* Categories Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsCategoryOpen(true)}
              onMouseLeave={() => setIsCategoryOpen(false)}
            >
              <button
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              >
                Categories
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isCategoryOpen ? "rotate-180" : ""}`} />
              </button>

              {isCategoryOpen && (
                <div className="absolute top-full left-0 w-72 pt-2 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-2 space-y-0.5">
                    {CATEGORIES.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/category/${cat.slug}`}
                        onClick={() => setIsCategoryOpen(false)}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200 text-sm font-medium group transition-colors"
                      >
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${cat.gradient}`} />
                        <span>{cat.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/about"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === "/about"
                  ? "text-brand-600 dark:text-brand-400 bg-brand-50/60 dark:bg-brand-950/40"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50"
              }`}
            >
              About
            </Link>
          </nav>

          {/* Search Trigger and Theme Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 text-xs hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shadow-sm"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Search tools...</span>
              <kbd className="hidden sm:inline-flex px-1.5 py-0.5 text-[10px] font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-slate-400">
                Ctrl K
              </kbd>
            </button>

            <ThemeToggle />

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-2">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Home
            </Link>
            <Link
              href="/tools"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              All Tools Directory
            </Link>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Categories</span>
              <div className="grid grid-cols-2 gap-1 mt-2">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-3 py-1.5 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <Link
                href="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                About Toolify
              </Link>
            </div>
          </div>
        )}
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
