"use client";

import { useState } from "react";
import { GitCompare, RotateCcw } from "lucide-react";
import * as Diff from "diff";

export default function TextDiffChecker() {
  const [original, setOriginal] = useState<string>(
    `function welcome(user) {\n  console.log("Hello " + user);\n  return true;\n}`
  );
  const [modified, setModified] = useState<string>(
    `function welcome(user: string): boolean {\n  console.log(\`Welcome to Toolify, \${user}!\`);\n  return true;\n}`
  );

  const diffResult = Diff.diffLines(original, modified);

  return (
    <div className="p-6 sm:p-10 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
          Side-By-Side Text & Code Comparison
        </h3>
        <button
          onClick={() => {
            setOriginal("");
            setModified("");
          }}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white font-medium"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear Both</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            Original Text (Before)
          </label>
          <textarea
            rows={8}
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            placeholder="Paste original text or code..."
            className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs sm:text-sm focus:outline-none focus:border-brand-500 resize-y"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            Modified Text (After)
          </label>
          <textarea
            rows={8}
            value={modified}
            onChange={(e) => setModified(e.target.value)}
            placeholder="Paste updated text or code..."
            className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs sm:text-sm focus:outline-none focus:border-brand-500 resize-y"
          />
        </div>
      </div>

      {/* Difference Output */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Comparison Results
          </span>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Added
            </span>
            <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Removed
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-100 font-mono text-xs sm:text-sm p-4 overflow-x-auto leading-relaxed max-h-96">
          {diffResult.map((part, index) => {
            const color = part.added
              ? "bg-emerald-950/80 text-emerald-300 border-l-4 border-emerald-500 px-2 py-0.5 block"
              : part.removed
              ? "bg-rose-950/80 text-rose-300 border-l-4 border-rose-500 px-2 py-0.5 block line-through opacity-80"
              : "text-slate-300 px-2 py-0.5 block";

            return (
              <span key={index} className={color}>
                {part.value}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
