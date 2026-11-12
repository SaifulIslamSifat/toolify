"use client";

import { useState } from "react";
import { CaseSensitive, Copy, Check, Trash2 } from "lucide-react";
import { copyToClipboard } from "@/lib/utils";

export default function CaseConverter() {
  const [text, setText] = useState<string>("Transform Your Text Into Any Format Instantly With Toolify.");
  const [copied, setCopied] = useState(false);

  const toUppercase = () => setText(text.toUpperCase());
  const toLowercase = () => setText(text.toLowerCase());

  const toTitleCase = () => {
    const minorWords = new Set(["a", "an", "the", "and", "but", "or", "for", "nor", "on", "at", "to", "by", "with", "in", "of"]);
    setText(
      text
        .toLowerCase()
        .split(" ")
        .map((word, index) => {
          if (index > 0 && minorWords.has(word)) return word;
          return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(" ")
    );
  };

  const toSentenceCase = () => {
    setText(
      text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase())
    );
  };

  const toCamelCase = () => {
    setText(
      text
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
        .replace(/^[A-Z]/, (c) => c.toLowerCase())
    );
  };

  const toKebabCase = () => {
    setText(
      text
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
    );
  };

  const toSnakeCase = () => {
    setText(
      text
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "")
    );
  };

  const toAlternatingCase = () => {
    setText(
      text
        .split("")
        .map((char, index) => (index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()))
        .join("")
    );
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-6 sm:p-10 space-y-6">
      {/* Transformation buttons grid */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={toUppercase}
          className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-brand-500 hover:text-brand-600 transition-all"
        >
          UPPERCASE
        </button>
        <button
          onClick={toLowercase}
          className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-brand-500 hover:text-brand-600 transition-all"
        >
          lowercase
        </button>
        <button
          onClick={toTitleCase}
          className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-brand-500 hover:text-brand-600 transition-all"
        >
          Title Case
        </button>
        <button
          onClick={toSentenceCase}
          className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-brand-500 hover:text-brand-600 transition-all"
        >
          Sentence case
        </button>
        <button
          onClick={toCamelCase}
          className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-brand-500 hover:text-brand-600 transition-all"
        >
          camelCase
        </button>
        <button
          onClick={toKebabCase}
          className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-brand-500 hover:text-brand-600 transition-all"
        >
          kebab-case
        </button>
        <button
          onClick={toSnakeCase}
          className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-brand-500 hover:text-brand-600 transition-all"
        >
          snake_case
        </button>
        <button
          onClick={toAlternatingCase}
          className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-brand-500 hover:text-brand-600 transition-all"
        >
          aLtErNaTiNg
        </button>
      </div>

      {/* Editor Textarea */}
      <div className="relative">
        <textarea
          rows={9}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here to change casing..."
          className="w-full p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-base leading-relaxed focus:outline-none focus:border-brand-500 shadow-inner resize-y"
        />

        {/* Floating actions */}
        <div className="absolute right-3 bottom-4 flex items-center gap-2">
          {text && (
            <button
              onClick={() => setText("")}
              title="Clear text"
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-rose-500 transition-colors shadow-sm"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold shadow-md hover:bg-brand-700 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
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
    </div>
  );
}
