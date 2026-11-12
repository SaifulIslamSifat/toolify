"use client";

import { useState } from "react";
import { HardDrive, RotateCcw } from "lucide-react";

export default function StorageConverter() {
  const [value, setValue] = useState<string>("1024");
  const [unit, setUnit] = useState<string>("MB");
  const [base, setBase] = useState<number>(1024); // 1024 for binary (KiB, MiB), 1000 for decimal

  const num = parseFloat(value) || 0;

  const multipliers: Record<string, number> = {
    B: 1,
    KB: Math.pow(base, 1),
    MB: Math.pow(base, 2),
    GB: Math.pow(base, 3),
    TB: Math.pow(base, 4),
  };

  const bytes = num * (multipliers[unit] || 1);

  const units = ["B", "KB", "MB", "GB", "TB"];

  return (
    <div className="p-6 sm:p-10">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Standard:</span>
          <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
            <button
              onClick={() => setBase(1024)}
              className={`px-3 py-1 rounded-lg text-xs font-bold ${
                base === 1024
                  ? "bg-white dark:bg-slate-900 text-brand-600 shadow-sm"
                  : "text-slate-500"
              }`}
            >
              Binary (1024 B = 1 KB)
            </button>
            <button
              onClick={() => setBase(1000)}
              className={`px-3 py-1 rounded-lg text-xs font-bold ${
                base === 1000
                  ? "bg-white dark:bg-slate-900 text-brand-600 shadow-sm"
                  : "text-slate-500"
              }`}
            >
              Decimal (1000 B = 1 KB)
            </button>
          </div>
        </div>

        <button
          onClick={() => {
            setValue("1024");
            setUnit("MB");
          }}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white font-medium"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            Storage Value
          </label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-xl focus:outline-none focus:border-brand-500"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            From Unit
          </label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-base focus:outline-none focus:border-brand-500"
          >
            {units.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {units.map((u, idx) => {
          const val = bytes / Math.pow(base, idx);
          return (
            <div
              key={u}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 text-center"
            >
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{u}</span>
              <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-1 break-all">
                {val >= 0.000001 && val < 1000000000
                  ? val.toLocaleString(undefined, { maximumFractionDigits: 4 })
                  : val.toExponential(2)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
