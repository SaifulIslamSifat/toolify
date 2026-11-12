import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy - Toolify",
  description: "Learn how Toolify manages cookies and local storage.",
};

export default function CookiesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">Cookie Policy</h1>
        <p className="text-xs text-slate-400 mt-2">Effective: November 2026</p>
      </div>

      <div className="space-y-6 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Essential Local Storage</h2>
          <p>
            Toolify does not use tracking or profiling cookies. We utilize standard browser `localStorage` solely for:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Remembering your Light or Dark visual theme preference.</li>
            <li>Storing your starred &quot;Favorite Tools&quot; list locally on your device.</li>
            <li>Remembering your recently accessed tools for quick navigation.</li>
          </ul>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Managing Storage</h2>
          <p>
            You can clear your stored preferences at any time by clearing your browser cache or site data for Toolify.
          </p>
        </div>
      </div>
    </div>
  );
}
