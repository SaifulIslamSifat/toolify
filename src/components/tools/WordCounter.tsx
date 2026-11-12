"use client";

import { useState } from "react";
import { FileSearch, Copy, Check, Trash2 } from "lucide-react";
import { copyToClipboard } from "@/lib/utils";

export default function WordCounter() {
  const [text, setText] = useState<string>(
    "Toolify is a premium online utilities platform designed to deliver genuine, client-side tools with zero fake progress. Try pasting your text here to see real-time statistics!"
  );
  const [copied, setCopied] = useState(false);

  // Compute metrics
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  const charsWithSpaces = text.length;
  const charsWithoutSpaces = text.replace(/\s+/g, "").length;
  const sentences = trimmed ? (text.match(/[^.!?]+[.!?]+(\s|$)/g) || []).length : 0;
  const paragraphs = trimmed ? text.split(/\n+/).filter((p) => p.trim().length > 0).length : 0;

  // Reading time (average 200 words per minute)
  const readingTimeMin = Math.ceil(words / 200);
  // Speaking time (average 130 words per minute)
  const speakingTimeMin = Math.ceil(words / 130);

  const handleCopy = async () => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-6 sm:p-10 space-y-6">
      {/* Top metrics bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400">Words</span>
          <div className="text-2xl font-black text-brand-600 dark:text-brand-400 mt-0.5">
            {words.toLocaleString()}
          </div>
        </div>
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400">Characters</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
            {charsWithSpaces.toLocaleString()}
          </div>
        </div>
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400">No Spaces</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
            {charsWithoutSpaces.toLocaleString()}
          </div>
        </div>
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400">Sentences</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
            {sentences.toLocaleString()}
          </div>
        </div>
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400">Paragraphs</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
            {paragraphs.toLocaleString()}
          </div>
        </div>
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400">Reading Time</span>
          <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            ~{readingTimeMin} min
          </div>
        </div>
      </div>

      {/* Editor Textarea */}
      <div className="relative">
        <textarea
          rows={10}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type your text here for instant analysis..."
          className="w-full p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm sm:text-base leading-relaxed focus:outline-none focus:border-brand-500 shadow-inner resize-y font-sans"
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
                <span>Copy Text</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
