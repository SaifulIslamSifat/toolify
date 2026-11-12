"use client";

import { useState } from "react";
import { Activity, RotateCcw, Info } from "lucide-react";

export default function BmiCalculator() {
  const [unitSystem, setUnitSystem] = useState<"metric" | "imperial">("metric");

  // Metric state
  const [heightCm, setHeightCm] = useState<string>("175");
  const [weightKg, setWeightKg] = useState<string>("70");

  // Imperial state
  const [heightFt, setHeightFt] = useState<string>("5");
  const [heightIn, setHeightIn] = useState<string>("9");
  const [weightLb, setWeightLb] = useState<string>("154");

  let bmi = 0;
  let healthyMinWeight = 0;
  let healthyMaxWeight = 0;

  if (unitSystem === "metric") {
    const h = parseFloat(heightCm) / 100;
    const w = parseFloat(weightKg);
    if (h > 0 && w > 0) {
      bmi = w / (h * h);
      healthyMinWeight = 18.5 * (h * h);
      healthyMaxWeight = 24.9 * (h * h);
    }
  } else {
    const ft = parseFloat(heightFt) || 0;
    const inch = parseFloat(heightIn) || 0;
    const totalInches = ft * 12 + inch;
    const w = parseFloat(weightLb);
    if (totalInches > 0 && w > 0) {
      bmi = (w * 703) / (totalInches * totalInches);
      healthyMinWeight = (18.5 * totalInches * totalInches) / 703;
      healthyMaxWeight = (24.9 * totalInches * totalInches) / 703;
    }
  }

  const getBmiCategory = (val: number) => {
    if (val === 0) return { label: "Enter measurements", color: "text-slate-400", bg: "bg-slate-100 dark:bg-slate-800" };
    if (val < 18.5) return { label: "Underweight", color: "text-blue-500", bg: "bg-blue-500" };
    if (val < 25) return { label: "Normal weight", color: "text-emerald-500", bg: "bg-emerald-500" };
    if (val < 30) return { label: "Overweight", color: "text-amber-500", bg: "bg-amber-500" };
    return { label: "Obese", color: "text-rose-500", bg: "bg-rose-500" };
  };

  const category = getBmiCategory(bmi);

  const resetForm = () => {
    setHeightCm("175");
    setWeightKg("70");
    setHeightFt("5");
    setHeightIn("9");
    setWeightLb("154");
  };

  return (
    <div className="p-6 sm:p-10">
      {/* Unit switch */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
          <button
            onClick={() => setUnitSystem("metric")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              unitSystem === "metric"
                ? "bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Metric (cm / kg)
          </button>
          <button
            onClick={() => setUnitSystem("imperial")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              unitSystem === "imperial"
                ? "bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Imperial (ft, in / lbs)
          </button>
        </div>

        <button
          onClick={resetForm}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white font-medium"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Input controls */}
        <div className="space-y-6">
          {unitSystem === "metric" ? (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Height (centimeters)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="50"
                    max="260"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-base font-semibold focus:outline-none focus:border-brand-500"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    cm
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Weight (kilograms)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="20"
                    max="300"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-base font-semibold focus:outline-none focus:border-brand-500"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    kg
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Height (Feet & Inches)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="8"
                      value={heightFt}
                      onChange={(e) => setHeightFt(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-base font-semibold focus:outline-none focus:border-brand-500"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      ft
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="11"
                      value={heightIn}
                      onChange={(e) => setHeightIn(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-base font-semibold focus:outline-none focus:border-brand-500"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      in
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Weight (Pounds)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="40"
                    max="650"
                    value={weightLb}
                    onChange={(e) => setWeightLb(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-base font-semibold focus:outline-none focus:border-brand-500"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    lbs
                  </span>
                </div>
              </div>
            </>
          )}

          <div className="flex items-start gap-2.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-xs text-slate-500 leading-relaxed">
            <Info className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
            <p>
              BMI is a general screening measure based on height and weight. It does not measure body fat percentage
              directly and is not a medical diagnosis.
            </p>
          </div>
        </div>

        {/* Results Card */}
        <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col justify-between h-full">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Your Result</span>
            <div className="flex items-baseline gap-3 mt-2">
              <span className="text-5xl sm:text-6xl font-black text-slate-900 dark:text-white">
                {bmi > 0 ? bmi.toFixed(1) : "--"}
              </span>
              <span className={`text-lg font-bold ${category.color}`}>{category.label}</span>
            </div>

            {/* Gauge progress bar */}
            <div className="mt-6">
              <div className="h-3 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex">
                <div className="w-[18.5%] bg-blue-400" title="Underweight (< 18.5)" />
                <div className="w-[25%] bg-emerald-400" title="Normal (18.5 - 24.9)" />
                <div className="w-[20%] bg-amber-400" title="Overweight (25 - 29.9)" />
                <div className="w-[36.5%] bg-rose-400" title="Obese (>= 30)" />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                <span>0</span>
                <span>18.5</span>
                <span>25</span>
                <span>30</span>
                <span>40+</span>
              </div>
            </div>

            {/* Healthy range */}
            {bmi > 0 && (
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Healthy Weight Range:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {unitSystem === "metric"
                      ? `${healthyMinWeight.toFixed(1)} kg - ${healthyMaxWeight.toFixed(1)} kg`
                      : `${healthyMinWeight.toFixed(1)} lbs - ${healthyMaxWeight.toFixed(1)} lbs`}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">WHO Classification:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{category.label}</span>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 text-[11px] text-slate-400">
            Formula: {unitSystem === "metric" ? "weight(kg) / [height(m)]²" : "703 × weight(lb) / [height(in)]²"}
          </div>
        </div>
      </div>
    </div>
  );
}
