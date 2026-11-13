"use client";

import { useState, useMemo } from "react";
import {
  ListOrdered,
  Copy,
  Check,
  Trash2,
  RotateCcw,
  Sparkles,
  FileText,
  Settings2,
} from "lucide-react";
import { copyToClipboard } from "@/lib/utils";

// Comprehensive Roman numeral converter supporting 1 to 3999 with standard subtractive notation
export function toRomanNumeral(num: number): string {
  if (num < 1 || num > 3999) return num.toString();

  const romanMap: [number, string][] = [
    [1000, "M"],
    [900, "CM"],
    [500, "D"],
    [400, "CD"],
    [100, "C"],
    [90, "XC"],
    [50, "L"],
    [40, "XL"],
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];

  let result = "";
  let remaining = num;
  for (const [val, letter] of romanMap) {
    while (remaining >= val) {
      result += letter;
      remaining -= val;
    }
  }
  return result;
}

type FormatStyle = "hyphen" | "roman" | "number" | "bullet";

const DEFAULT_EXAMPLE = `Homepage design
About us page
Contact page
Product page design
Mobile responsive design
Basic SEO setup
30 days support`;

export default function FiverrDeliverableFormatter() {
  const [inputText, setInputText] = useState<string>(DEFAULT_EXAMPLE);
  const [style, setStyle] = useState<FormatStyle>("roman");
  const [removeEmptyLines, setRemoveEmptyLines] = useState<boolean>(true);
  const [stripExistingPrefixes, setStripExistingPrefixes] = useState<boolean>(true);
  const [capitalizeFirst, setCapitalizeFirst] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  // Formatting logic
  const formattedOutput = useMemo(() => {
    if (!inputText) return "";

    const rawLines = inputText.split("\n");

    const cleanedLines: string[] = [];

    for (let rawLine of rawLines) {
      let line = rawLine.trim();

      if (removeEmptyLines && !line) {
        continue;
      }

      if (stripExistingPrefixes && line) {
        // Strip existing prefixes like:
        // - "1. ", "1) ", "1- "
        // - "- ", "• ", "* ", "> "
        // - "I. ", "II. ", "IV. ", etc.
        line = line
          .replace(/^([0-9]+[\.\)\-]\s*)/, "")
          .replace(/^([IVXLCDMivxlcdm]+[\.\)\-]\s*)/, "")
          .replace(/^([\-\•\*\>\+]\s*)/, "")
          .trim();
      }

      if (capitalizeFirst && line) {
        line = line.charAt(0).toUpperCase() + line.slice(1);
      }

      cleanedLines.push(line);
    }

    let itemIndex = 1;
    const formattedLines = cleanedLines.map((line) => {
      if (!line) return "";

      switch (style) {
        case "hyphen":
          return `- ${line}`;
        case "roman":
          return `${toRomanNumeral(itemIndex++)}. ${line}`;
        case "number":
          return `${itemIndex++}. ${line}`;
        case "bullet":
          return `• ${line}`;
        default:
          return line;
      }
    });

    return formattedLines.join("\n");
  }, [inputText, style, removeEmptyLines, stripExistingPrefixes, capitalizeFirst]);

  // Statistics
  const lineCount = formattedOutput
    ? formattedOutput.split("\n").filter((l) => l.trim().length > 0).length
    : 0;
  const wordCount = formattedOutput.trim() ? formattedOutput.trim().split(/\s+/).length : 0;
  const charCount = formattedOutput.length;

  const handleCopy = async () => {
    const success = await copyToClipboard(formattedOutput);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClear = () => {
    setInputText("");
  };

  const handleResetExample = () => {
    setInputText(DEFAULT_EXAMPLE);
    setStyle("roman");
    setRemoveEmptyLines(true);
    setStripExistingPrefixes(true);
    setCapitalizeFirst(true);
  };

  return (
    <div className="p-6 sm:p-10 space-y-8">
      {/* Header Controls: Style Selector */}
      <div className="p-6 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-3">
            Choose Deliverable List Style
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Option A: Hyphen */}
            <button
              type="button"
              onClick={() => setStyle("hyphen")}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                style === "hyphen"
                  ? "border-brand-600 bg-white dark:bg-slate-900 shadow-md ring-2 ring-brand-500/20"
                  : "border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/60 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-extrabold text-slate-900 dark:text-white">Option A</span>
                <span className="font-mono text-xs font-black text-brand-600 dark:text-brand-400">- Item</span>
              </div>
              <p className="text-[11px] text-slate-500">Hyphen Prefix</p>
            </button>

            {/* Option B: Roman Numerals */}
            <button
              type="button"
              onClick={() => setStyle("roman")}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                style === "roman"
                  ? "border-brand-600 bg-white dark:bg-slate-900 shadow-md ring-2 ring-brand-500/20"
                  : "border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/60 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-extrabold text-slate-900 dark:text-white">Option B</span>
                <span className="font-mono text-xs font-black text-brand-600 dark:text-brand-400">I. Item</span>
              </div>
              <p className="text-[11px] text-slate-500">Roman Numerals (I-3999)</p>
            </button>

            {/* Option C: Standard Numbering */}
            <button
              type="button"
              onClick={() => setStyle("number")}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                style === "number"
                  ? "border-brand-600 bg-white dark:bg-slate-900 shadow-md ring-2 ring-brand-500/20"
                  : "border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/60 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-extrabold text-slate-900 dark:text-white">Option C</span>
                <span className="font-mono text-xs font-black text-brand-600 dark:text-brand-400">1. Item</span>
              </div>
              <p className="text-[11px] text-slate-500">Standard Numbers</p>
            </button>

            {/* Option D: Bullet Points */}
            <button
              type="button"
              onClick={() => setStyle("bullet")}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                style === "bullet"
                  ? "border-brand-600 bg-white dark:bg-slate-900 shadow-md ring-2 ring-brand-500/20"
                  : "border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/60 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-extrabold text-slate-900 dark:text-white">Option D</span>
                <span className="font-mono text-xs font-black text-brand-600 dark:text-brand-400">• Item</span>
              </div>
              <p className="text-[11px] text-slate-500">Bullet Points</p>
            </button>
          </div>
        </div>

        {/* Toggles */}
        <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
          <label className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={removeEmptyLines}
              onChange={(e) => setRemoveEmptyLines(e.target.checked)}
              className="rounded text-brand-600 focus:ring-brand-500"
            />
            <span>Remove empty lines</span>
          </label>

          <label className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={stripExistingPrefixes}
              onChange={(e) => setStripExistingPrefixes(e.target.checked)}
              className="rounded text-brand-600 focus:ring-brand-500"
            />
            <span>Strip existing numbering & dashes</span>
          </label>

          <label className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={capitalizeFirst}
              onChange={(e) => setCapitalizeFirst(e.target.checked)}
              className="rounded text-brand-600 focus:ring-brand-500"
            />
            <span>Capitalize first letter</span>
          </label>

          <button
            type="button"
            onClick={handleResetExample}
            className="ml-auto flex items-center gap-1 text-slate-400 hover:text-brand-600 font-semibold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Load Sample Deliverables</span>
          </button>
        </div>
      </div>

      {/* Side-by-Side Editor & Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Raw Input Area */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Raw Deliverables (One per line)
            </label>
            <button
              onClick={handleClear}
              disabled={!inputText}
              className="text-xs text-slate-400 hover:text-rose-500 disabled:opacity-30 transition-colors"
            >
              Clear input
            </button>
          </div>

          <textarea
            rows={12}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste raw deliverable tasks here, one per line..."
            className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs sm:text-sm text-slate-900 dark:text-white leading-relaxed focus:outline-none focus:border-brand-500 resize-y shadow-inner"
          />
        </div>

        {/* Formatted Output & Live Preview */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                Formatted Custom Offer Scope
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                {lineCount} items
              </span>
            </div>

            <div className="text-xs text-slate-400 font-mono">
              {wordCount} words • {charCount} chars
            </div>
          </div>

          <div className="relative">
            <textarea
              readOnly
              rows={12}
              value={formattedOutput}
              placeholder="Your formatted deliverables will appear here..."
              className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 font-mono text-xs sm:text-sm text-slate-900 dark:text-white leading-relaxed focus:outline-none resize-y"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleCopy}
              disabled={!formattedOutput}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-40 text-white font-bold text-xs shadow-md transition-all hover:scale-[1.02]"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Copied Formatted List!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Formatted Deliverables</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
