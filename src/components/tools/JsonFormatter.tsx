"use client";

import { useState } from "react";
import { Code, Copy, Check, Trash2, AlertCircle } from "lucide-react";
import { copyToClipboard } from "@/lib/utils";

export default function JsonFormatter() {
  const [input, setInput] = useState<string>(
    '{"project":"Toolify","version":1.0,"features":["100% Client-Side","Zero Fake Progress","Fast & Privacy Focused"],"metadata":{"author":"Google Antigravity","year":2026}}'
  );
  const [indent, setIndent] = useState<number>(2);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const formatJson = () => {
    try {
      setError(null);
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed, null, indent));
    } catch (err: any) {
      setError(err.message || "Invalid JSON syntax");
    }
  };

  const minifyJson = () => {
    try {
      setError(null);
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed));
    } catch (err: any) {
      setError(err.message || "Invalid JSON syntax");
    }
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(input);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-6 sm:p-10 space-y-6">
      {/* Action header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={formatJson}
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm transition-all"
          >
            Format / Beautify
          </button>
          <button
            onClick={minifyJson}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:border-brand-500 font-bold text-xs shadow-sm transition-all"
          >
            Minify (Compact)
          </button>

          <div className="flex items-center gap-1.5 ml-2 text-xs font-semibold text-slate-500">
            <span>Spacing:</span>
            <select
              value={indent}
              onChange={(e) => setIndent(Number(e.target.value))}
              className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold"
            >
              <option value={2}>2 Spaces</option>
              <option value={4}>4 Spaces</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setInput("");
              setError(null);
            }}
            title="Clear editor"
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-500"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-xs font-bold hover:border-brand-500 shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="flex items-center gap-2.5 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-medium">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>Error parsing JSON: {error}</span>
        </div>
      )}

      {/* Editor */}
      <div className="relative">
        <textarea
          rows={14}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (error) setError(null);
          }}
          placeholder="Paste or write raw JSON here..."
          className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 text-emerald-400 font-mono text-xs sm:text-sm leading-relaxed focus:outline-none focus:border-brand-500 resize-y"
          spellCheck={false}
        />
      </div>
    </div>
  );
}
