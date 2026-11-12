"use client";

import { useState } from "react";
import { AlignLeft, Copy, Check, RotateCcw } from "lucide-react";
import { copyToClipboard } from "@/lib/utils";

const LOREM_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "ut", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "ut", "aliquip", "ex", "ea",
  "commodo", "consequat", "duis", "aute", "irure", "in", "reprehenderit",
  "voluptate", "velit", "esse", "cillum", "dolore", "eu", "fugiat", "nulla",
  "pariatur", "excepteur", "sint", "occaecat", "cupidatat", "non", "proident",
  "sunt", "in", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id",
  "est", "laborum"
];

export default function LoremIpsumGenerator() {
  const [count, setCount] = useState<number>(3);
  const [type, setType] = useState<"paragraphs" | "sentences" | "words">("paragraphs");
  const [copied, setCopied] = useState(false);

  const generateWord = () => LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];

  const generateSentence = () => {
    const len = Math.floor(Math.random() * 8) + 6;
    const words: string[] = [];
    for (let i = 0; i < len; i++) {
      words.push(generateWord());
    }
    const s = words.join(" ");
    return s.charAt(0).toUpperCase() + s.slice(1) + ".";
  };

  const generateParagraph = () => {
    const numSentences = Math.floor(Math.random() * 4) + 4;
    const sentences: string[] = [];
    for (let i = 0; i < numSentences; i++) {
      sentences.push(generateSentence());
    }
    return sentences.join(" ");
  };

  const generateContent = () => {
    if (type === "words") {
      const words: string[] = ["Lorem", "ipsum"];
      for (let i = 2; i < count; i++) {
        words.push(generateWord());
      }
      return words.slice(0, count).join(" ");
    } else if (type === "sentences") {
      const sentences: string[] = [];
      for (let i = 0; i < count; i++) {
        sentences.push(generateSentence());
      }
      return sentences.join(" ");
    } else {
      const paras: string[] = [];
      for (let i = 0; i < count; i++) {
        paras.push(generateParagraph());
      }
      return paras.join("\n\n");
    }
  };

  const [text, setText] = useState<string>(generateContent());

  const handleRegenerate = () => {
    setText(generateContent());
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
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
            <button
              onClick={() => {
                setType("paragraphs");
                setCount(3);
              }}
              className={`px-3 py-1.5 rounded-lg ${
                type === "paragraphs"
                  ? "bg-white dark:bg-slate-900 text-brand-600 shadow-sm"
                  : "text-slate-500"
              }`}
            >
              Paragraphs
            </button>
            <button
              onClick={() => {
                setType("sentences");
                setCount(5);
              }}
              className={`px-3 py-1.5 rounded-lg ${
                type === "sentences"
                  ? "bg-white dark:bg-slate-900 text-brand-600 shadow-sm"
                  : "text-slate-500"
              }`}
            >
              Sentences
            </button>
            <button
              onClick={() => {
                setType("words");
                setCount(50);
              }}
              className={`px-3 py-1.5 rounded-lg ${
                type === "words"
                  ? "bg-white dark:bg-slate-900 text-brand-600 shadow-sm"
                  : "text-slate-500"
              }`}
            >
              Words
            </button>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-500">Count:</label>
            <input
              type="number"
              min="1"
              max="100"
              value={count}
              onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-16 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-center font-bold text-xs"
            />
          </div>

          <button
            onClick={handleRegenerate}
            className="px-3.5 py-1.5 rounded-xl bg-brand-600 text-white font-bold text-xs shadow-sm hover:bg-brand-700 transition-colors"
          >
            Regenerate
          </button>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-xs font-bold hover:border-brand-500"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy All</span>
            </>
          )}
        </button>
      </div>

      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-serif text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap shadow-inner max-h-96 overflow-y-auto">
        {text}
      </div>
    </div>
  );
}
