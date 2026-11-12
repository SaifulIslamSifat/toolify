"use client";

import { useState } from "react";
import { Scale, RotateCcw } from "lucide-react";

export default function WeightConverter() {
  const [value, setValue] = useState<string>("70");
  const [unit, setUnit] = useState<string>("kg");

  const num = parseFloat(value) || 0;

  // Convert to grams
  const toGrams: Record<string, number> = {
    mg: 0.001,
    g: 1,
    kg: 1000,
    oz: 28.34952,
    lb: 453.59237,
    stone: 6350.293,
  };

  const grams = num * (toGrams[unit] || 1);

  const conversions = [
    { label: "Kilograms", key: "kg", val: grams / 1000, unit: "kg" },
    { label: "Pounds", key: "lb", val: grams / 453.59237, unit: "lbs" },
    { label: "Grams", key: "g", val: grams, unit: "g" },
    { label: "Ounces", key: "oz", val: grams / 28.34952, unit: "oz" },
    { label: "Stones", key: "stone", val: grams / 6350.293, unit: "st" },
  ];

  return (
    <div className="p-6 sm:p-10">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
          Weight & Mass Converter
        </h3>
        <button
          onClick={() => {
            setValue("70");
            setUnit("kg");
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
            Value to Convert
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
            <option value="kg">Kilograms (kg)</option>
            <option value="lb">Pounds (lbs)</option>
            <option value="g">Grams (g)</option>
            <option value="oz">Ounces (oz)</option>
            <option value="stone">Stones (st)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {conversions.map((conv) => (
          <div
            key={conv.key}
            className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20"
          >
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{conv.label}</span>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
              {conv.val.toLocaleString(undefined, { maximumFractionDigits: 4 })}
              <span className="text-xs font-normal text-slate-400 ml-1">{conv.unit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
