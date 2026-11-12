"use client";

import { useState } from "react";
import { Thermometer, RotateCcw } from "lucide-react";

export default function TemperatureConverter() {
  const [celsius, setCelsius] = useState<string>("25");
  const [fahrenheit, setFahrenheit] = useState<string>("77");
  const [kelvin, setKelvin] = useState<string>("298.15");

  const updateFromCelsius = (val: string) => {
    setCelsius(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setFahrenheit(((num * 9) / 5 + 32).toFixed(2));
      setKelvin((num + 273.15).toFixed(2));
    } else {
      setFahrenheit("");
      setKelvin("");
    }
  };

  const updateFromFahrenheit = (val: string) => {
    setFahrenheit(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      const c = ((num - 32) * 5) / 9;
      setCelsius(c.toFixed(2));
      setKelvin((c + 273.15).toFixed(2));
    } else {
      setCelsius("");
      setKelvin("");
    }
  };

  const updateFromKelvin = (val: string) => {
    setKelvin(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      const c = num - 273.15;
      setCelsius(c.toFixed(2));
      setFahrenheit(((c * 9) / 5 + 32).toFixed(2));
    } else {
      setCelsius("");
      setFahrenheit("");
    }
  };

  return (
    <div className="p-6 sm:p-10">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
          Bidirectional Temperature Converter
        </h3>
        <button
          onClick={() => updateFromCelsius("25")}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white font-medium"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            Celsius (°C)
          </label>
          <div className="relative">
            <input
              type="number"
              value={celsius}
              onChange={(e) => updateFromCelsius(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-black text-lg focus:outline-none focus:border-brand-500"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">°C</span>
          </div>
          <span className="block text-[11px] text-slate-400 mt-2">Freezing: 0°C | Boiling: 100°C</span>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            Fahrenheit (°F)
          </label>
          <div className="relative">
            <input
              type="number"
              value={fahrenheit}
              onChange={(e) => updateFromFahrenheit(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-black text-lg focus:outline-none focus:border-brand-500"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">°F</span>
          </div>
          <span className="block text-[11px] text-slate-400 mt-2">Freezing: 32°F | Boiling: 212°F</span>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            Kelvin (K)
          </label>
          <div className="relative">
            <input
              type="number"
              value={kelvin}
              onChange={(e) => updateFromKelvin(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-black text-lg focus:outline-none focus:border-brand-500"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">K</span>
          </div>
          <span className="block text-[11px] text-slate-400 mt-2">Absolute Zero: 0 K (-273.15°C)</span>
        </div>
      </div>
    </div>
  );
}
