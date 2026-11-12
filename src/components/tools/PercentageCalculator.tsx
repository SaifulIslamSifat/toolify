"use client";

import { useState } from "react";
import { Percent, RotateCcw } from "lucide-react";

export default function PercentageCalculator() {
  const [val1A, setVal1A] = useState<string>("15");
  const [val1B, setVal1B] = useState<string>("200");

  const [val2A, setVal2A] = useState<string>("30");
  const [val2B, setVal2B] = useState<string>("150");

  const [val3A, setVal3A] = useState<string>("50");
  const [val3B, setVal3B] = useState<string>("75");

  // Mode 1: What is A% of B?
  const res1 =
    val1A && val1B && !isNaN(Number(val1A)) && !isNaN(Number(val1B))
      ? (Number(val1A) / 100) * Number(val1B)
      : null;

  // Mode 2: A is what percent of B?
  const res2 =
    val2A && val2B && !isNaN(Number(val2A)) && !isNaN(Number(val2B)) && Number(val2B) !== 0
      ? (Number(val2A) / Number(val2B)) * 100
      : null;

  // Mode 3: Percentage increase / decrease from A to B
  const res3 =
    val3A && val3B && !isNaN(Number(val3A)) && !isNaN(Number(val3B)) && Number(val3A) !== 0
      ? ((Number(val3B) - Number(val3A)) / Number(val3A)) * 100
      : null;

  const resetAll = () => {
    setVal1A("15");
    setVal1B("200");
    setVal2A("30");
    setVal2B("150");
    setVal3A("50");
    setVal3B("75");
  };

  return (
    <div className="p-6 sm:p-10 space-y-8">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
          All-In-One Percentage Calculations
        </h3>
        <button
          onClick={resetAll}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white font-medium"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      <div className="space-y-6">
        {/* Mode 1 */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
          <h4 className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 mb-3">
            1. Percentage of a Number
          </h4>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">What is</span>
            <input
              type="number"
              value={val1A}
              onChange={(e) => setVal1A(e.target.value)}
              className="w-24 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-center text-sm focus:outline-none focus:border-brand-500"
            />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">% of</span>
            <input
              type="number"
              value={val1B}
              onChange={(e) => setVal1B(e.target.value)}
              className="w-32 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-center text-sm focus:outline-none focus:border-brand-500"
            />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">?</span>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-slate-400">Result:</span>
              <span className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-black text-brand-600 dark:text-brand-400 text-lg">
                {res1 !== null ? res1.toLocaleString(undefined, { maximumFractionDigits: 4 }) : "--"}
              </span>
            </div>
          </div>
        </div>

        {/* Mode 2 */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
          <h4 className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 mb-3">
            2. Proportion & Ratio Percentage
          </h4>
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="number"
              value={val2A}
              onChange={(e) => setVal2A(e.target.value)}
              className="w-28 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-center text-sm focus:outline-none focus:border-brand-500"
            />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">is what percent of</span>
            <input
              type="number"
              value={val2B}
              onChange={(e) => setVal2B(e.target.value)}
              className="w-32 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-center text-sm focus:outline-none focus:border-brand-500"
            />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">?</span>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-slate-400">Result:</span>
              <span className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-black text-emerald-600 dark:text-emerald-400 text-lg">
                {res2 !== null ? `${res2.toFixed(2)}%` : "--"}
              </span>
            </div>
          </div>
        </div>

        {/* Mode 3 */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
          <h4 className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 mb-3">
            3. Percentage Increase / Decrease
          </h4>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">From</span>
            <input
              type="number"
              value={val3A}
              onChange={(e) => setVal3A(e.target.value)}
              className="w-28 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-center text-sm focus:outline-none focus:border-brand-500"
            />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">to</span>
            <input
              type="number"
              value={val3B}
              onChange={(e) => setVal3B(e.target.value)}
              className="w-28 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-center text-sm focus:outline-none focus:border-brand-500"
            />
            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-slate-400">Change:</span>
              <span
                className={`px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-black text-lg ${
                  res3 !== null && res3 >= 0
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-rose-600 dark:text-rose-400"
                }`}
              >
                {res3 !== null ? `${res3 > 0 ? "+" : ""}${res3.toFixed(2)}%` : "--"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
