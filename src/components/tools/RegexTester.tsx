"use client";

import { useState } from "react";
import { Terminal, AlertCircle, CheckCircle2 } from "lucide-react";

export default function RegexTester() {
  const [pattern, setPattern] = useState<string>("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}");
  const [flags, setFlags] = useState<{ g: boolean; i: boolean; m: boolean; s: boolean }>({
    g: true,
    i: true,
    m: false,
    s: false,
  });
  const [testText, setTestText] = useState<string>(
    "Contact support at team@toolify.local or security-alert@example.org for technical inquiries. Invalid emails like user@.com won't match."
  );

  const getActiveFlags = () => {
    let f = "";
    if (flags.g) f += "g";
    if (flags.i) f += "i";
    if (flags.m) f += "m";
    if (flags.s) f += "s";
    return f;
  };

  let regex: RegExp | null = null;
  let regexError: string | null = null;
  let matches: RegExpMatchArray[] = [];

  try {
    if (pattern) {
      regex = new RegExp(pattern, getActiveFlags());
      if (flags.g) {
        matches = Array.from(testText.matchAll(regex));
      } else {
        const m = testText.match(regex);
        if (m) matches = [m];
      }
    }
  } catch (err: any) {
    regexError = err.message;
  }

  // Render highlighted text
  const renderHighlightedText = () => {
    if (!regex || regexError || !pattern || matches.length === 0) {
      return <span>{testText}</span>;
    }

    const segments: React.ReactNode[] = [];
    let lastIndex = 0;

    matches.forEach((match, idx) => {
      const matchStart = match.index ?? 0;
      const matchEnd = matchStart + match[0].length;

      // Text before match
      if (matchStart > lastIndex) {
        segments.push(<span key={`text-${idx}`}>{testText.slice(lastIndex, matchStart)}</span>);
      }

      // Highlighted match
      segments.push(
        <mark
          key={`match-${idx}`}
          className="bg-brand-500/30 text-brand-700 dark:text-brand-300 px-1 py-0.5 rounded font-bold border border-brand-400"
        >
          {match[0]}
        </mark>
      );

      lastIndex = matchEnd;
    });

    if (lastIndex < testText.length) {
      segments.push(<span key="text-end">{testText.slice(lastIndex)}</span>);
    }

    return segments;
  };

  return (
    <div className="p-6 sm:p-10 space-y-6">
      {/* Pattern and flags */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
          Regular Expression (Pattern & Flags)
        </label>
        <div className="flex items-center gap-2">
          <span className="font-mono text-lg font-bold text-slate-400">/</span>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="Type regex pattern..."
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
          />
          <span className="font-mono text-lg font-bold text-slate-400">/</span>
          <span className="font-mono text-sm font-bold text-brand-600 dark:text-brand-400 min-w-[30px]">
            {getActiveFlags()}
          </span>
        </div>

        {/* Flag toggles */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <span className="text-xs font-bold text-slate-400">Flags:</span>
          {(["g", "i", "m", "s"] as const).map((flag) => (
            <label
              key={flag}
              className={`px-3 py-1 rounded-lg text-xs font-bold border cursor-pointer transition-all ${
                flags[flag]
                  ? "border-brand-600 bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400"
                  : "border-slate-200 dark:border-slate-700 text-slate-500"
              }`}
            >
              <input
                type="checkbox"
                checked={flags[flag]}
                onChange={(e) => setFlags({ ...flags, [flag]: e.target.checked })}
                className="hidden"
              />
              {flag === "g" ? "Global (g)" : flag === "i" ? "Case Insensitive (i)" : flag === "m" ? "Multiline (m)" : "Dot All (s)"}
            </label>
          ))}
        </div>
      </div>

      {regexError && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 dark:text-rose-300 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>Regex Error: {regexError}</span>
        </div>
      )}

      {/* Test string editor */}
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
          Sample Text to Test Against
        </label>
        <textarea
          rows={4}
          value={testText}
          onChange={(e) => setTestText(e.target.value)}
          placeholder="Paste or type test text..."
          className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs sm:text-sm focus:outline-none focus:border-brand-500 resize-y"
        />
      </div>

      {/* Visual match display */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Highlighted Matches
          </span>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-brand-100 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300">
            {matches.length} {matches.length === 1 ? "match" : "matches"} found
          </span>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 font-mono text-xs sm:text-sm leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
          {renderHighlightedText()}
        </div>
      </div>
    </div>
  );
}
