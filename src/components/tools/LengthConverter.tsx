"use client";

import { useState } from "react";
import { Ruler, RotateCcw } from "lucide-react";

export default function LengthConverter() {
  const [value, setValue] = useState<string>("100");
  const [unit, setUnit] = useState<string>("cm");

  const num = parseFloat(value) || 0;

  // Normalize everything to meters
  const toMeters: Record<string, number> = {
    mm: 0.001,
    cm: 0.01,
    m: 1,
    km: 1000,
    in: 0.0254,
    ft: 0.3048,
    yd: 0.9144,
    mi: 1609.344,
  };

  const meters = num * (toMeters[unit] || 1);

  const conversions = [
    { label: "Centimeters", key: "cm", val: meters / 0.01, unit: "cm" },
    { label: "Meters", key: "m", val: meters, unit: "m" },
    { label: "Kilometers", key: "km", val: meters / 1000, unit: "km" },
    { label: "Inches", key: "in", val: meters / 0.0254, unit: "in" },
    { label: "Feet", key: "ft", val: meters / 0.3048, unit: "ft" },
    { label: "Miles", key: "mi", val: meters / 1609.344, unit: "mi" },
  ];

  return (
    <div className="p-6 sm:p-10">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
          Length & Distance Converter
        </h3>
        <button
          onClick={() => {
            setValue("100");
            setUnit("cm");
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
            <option value="cm">Centimeters (cm)</option>
            <option value="m">Meters (m)</option>
            <option value="km">Kilometers (km)</option>
            <option value="in">Inches (in)</option>
            <option value="ft">Feet (ft)</option>
            <option value="yd">Yards (yd)</option>
            <option value="mi">Miles (mi)</option>
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
              {conv.val.toLocaleString(undefined, { maximumFractionDigits: 5 })}
              <span className="text-xs font-normal text-slate-400 ml-1">{conv.unit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
