"use client";

import { useState } from "react";
import { Fingerprint, Copy, Check, RefreshCw } from "lucide-react";
import { copyToClipboard } from "@/lib/utils";

export default function UuidGenerator() {
  const [count, setCount] = useState<number>(5);
  const [uppercase, setUppercase] = useState<boolean>(false);
  const [hyphens, setHyphens] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const generateSingleUuid = () => {
    let uuid = "";
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      uuid = crypto.randomUUID();
    } else {
      // RFC4122 v4 fallback
      uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    }

    if (!hyphens) {
      uuid = uuid.replace(/-/g, "");
    }
    if (uppercase) {
      uuid = uuid.toUpperCase();
    }
    return uuid;
  };

  const generateList = () => {
    const list: string[] = [];
    for (let i = 0; i < count; i++) {
      list.push(generateSingleUuid());
    }
    return list;
  };

  const [uuids, setUuids] = useState<string[]>(generateList());

  const handleRegenerate = () => {
    setUuids(generateList());
  };

  const handleCopyAll = async () => {
    const text = uuids.join("\n");
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-6 sm:p-10 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Quantity:</label>
            <input
              type="number"
              min="1"
              max="50"
              value={count}
              onChange={(e) => setCount(Math.min(50, Math.max(1, parseInt(e.target.value) || 1)))}
              className="w-16 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-center text-xs"
            />
          </div>

          <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="rounded text-brand-600 focus:ring-brand-500"
            />
            <span>UPPERCASE</span>
          </label>

          <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={hyphens}
              onChange={(e) => setHyphens(e.target.checked)}
              className="rounded text-brand-600 focus:ring-brand-500"
            />
            <span>Include Hyphens</span>
          </label>

          <button
            onClick={handleRegenerate}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Regenerate</span>
          </button>
        </div>

        <button
          onClick={handleCopyAll}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-bold text-xs hover:border-brand-500 shadow-sm transition-all"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span>Copied All</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy All ({uuids.length})</span>
            </>
          )}
        </button>
      </div>

      {/* UUID list */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {uuids.map((uuid, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 font-mono text-xs sm:text-sm text-slate-900 dark:text-slate-100 group hover:border-brand-300"
          >
            <span className="font-semibold">{uuid}</span>
            <button
              onClick={() => copyToClipboard(uuid)}
              title="Copy UUID"
              className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-slate-400 hover:text-brand-600 transition-opacity"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
