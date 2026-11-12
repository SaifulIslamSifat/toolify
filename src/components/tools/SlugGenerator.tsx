"use client";

import { useState } from "react";
import { Link2, Copy, Check, RotateCcw } from "lucide-react";
import { copyToClipboard } from "@/lib/utils";

export default function SlugGenerator() {
  const [input, setInput] = useState<string>("Building an All-in-One Online Tools Platform in 2026!");
  const [separator, setSeparator] = useState<"-" | "_">("-");
  const [lowercase, setLowercase] = useState<boolean>(true);
  const [copied, setCopied] = useState(false);

  const generateSlug = (text: string) => {
    let result = text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // remove accents
      .replace(/[^\w\s-]/g, "") // remove special characters
      .trim()
      .replace(/[\s_-]+/g, separator) // replace spaces/underscores with chosen separator
      .replace(new RegExp(`^${separator}+|${separator}+$`, "g"), ""); // trim separator

    if (lowercase) {
      result = result.toLowerCase();
    }
    return result;
  };

  const slug = generateSlug(input);

  const handleCopy = async () => {
    const success = await copyToClipboard(slug);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-6 sm:p-10 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
          URL Slug Generator & Normalizer
        </h3>
        <button
          onClick={() => setInput("")}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white font-medium"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear</span>
        </button>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
          Title or Phrase
        </label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter title (e.g., How to Convert PDF to Word)..."
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold text-base focus:outline-none focus:border-brand-500"
        />
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Separator:</span>
          <button
            type="button"
            onClick={() => setSeparator("-")}
            className={`px-3 py-1 rounded-lg text-xs font-bold border ${
              separator === "-"
                ? "border-brand-600 bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400"
                : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
            }`}
          >
            Hyphen (-)
          </button>
          <button
            type="button"
            onClick={() => setSeparator("_")}
            className={`px-3 py-1 rounded-lg text-xs font-bold border ${
              separator === "_"
                ? "border-brand-600 bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400"
                : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
            }`}
          >
            Underscore (_)
          </button>
        </div>

        <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={lowercase}
            onChange={(e) => setLowercase(e.target.checked)}
            className="rounded text-brand-600 focus:ring-brand-500"
          />
          <span>Force Lowercase</span>
        </label>
      </div>

      {/* Result Display */}
      <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Generated URL Slug</span>
        <div className="flex items-center justify-between gap-4 mt-2">
          <span className="text-lg sm:text-xl font-mono font-bold text-brand-600 dark:text-brand-400 break-all">
            {slug || "your-slug-will-appear-here"}
          </span>
          <button
            onClick={handleCopy}
            disabled={!slug}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-xs shadow-sm flex-shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Slug</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
