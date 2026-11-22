import Link from "next/link";
import { Wrench, ShieldCheck, Zap, Lock } from "lucide-react";
import { CATEGORIES, getPopularTools } from "@/lib/tools-registry";

export default function Footer() {
  const popularTools = getPopularTools().slice(0, 6);

  return (
    <footer className="border-t border-slate-200 dark:border-white/10 bg-white dark:bg-black text-slate-600 dark:text-slate-400 text-sm">
      {/* Trust & Guarantee Banner */}
      <div className="border-b border-slate-200/60 dark:border-white/10 bg-slate-50/50 dark:bg-[#090d0f]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-[#151d21] border border-slate-200/60 dark:border-white/10 text-brand-600 dark:text-brand-400 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">100% Client-Side Privacy</h4>
                <p className="text-xs text-slate-500">Your files and data are processed locally in your browser.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent-50 dark:bg-[#151d21] border border-slate-200/60 dark:border-white/10 text-accent-600 dark:text-accent-400 flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Zero Fake Progress</h4>
                <p className="text-xs text-slate-500">Real processing, instant calculations, and genuine outputs.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-[#151d21] border border-slate-200/60 dark:border-white/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Free & Unrestricted</h4>
                <p className="text-xs text-slate-500">No account required, no forced subscriptions, no watermark.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-500 to-emerald-400 flex items-center justify-center text-black font-bold">
                <Wrench className="w-4 h-4 text-black" />
              </div>
              <span className="text-xl font-black text-slate-900 dark:text-white">
                Toolify<span className="text-brand-600 dark:text-brand-400">.</span>
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm leading-relaxed">
              Toolify is a modern, privacy-focused online utility suite providing fast, genuine tools for image
              editing, PDF conversion, calculations, text formatting, and developer workflows.
            </p>
            <div className="pt-2">
              <p className="text-xs text-slate-400">
                Crafted for creators, engineers, students, and professionals worldwide.
              </p>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Categories
            </h4>
            <ul className="space-y-2 text-xs">
              {CATEGORIES.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/tools" className="text-brand-600 dark:text-brand-400 font-semibold hover:underline">
                  View All Categories →
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Tools */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Popular Tools
            </h4>
            <ul className="space-y-2 text-xs">
              {popularTools.map((tool) => (
                <li key={tool.slug}>
                  <Link
                    href={`/tools/${tool.slug}`}
                    className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company & Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Company & Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Toolify. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with Next.js, TypeScript & Tailwind CSS. Designed with precision.
          </p>
        </div>
      </div>
    </footer>
  );
}
