"use client";

import { useState } from "react";
import { Tag, RotateCcw } from "lucide-react";

export default function DiscountCalculator() {
  const [originalPrice, setOriginalPrice] = useState<string>("80");
  const [discountPercent, setDiscountPercent] = useState<string>("25");
  const [taxPercent, setTaxPercent] = useState<string>("8");

  const price = parseFloat(originalPrice) || 0;
  const discount = parseFloat(discountPercent) || 0;
  const tax = parseFloat(taxPercent) || 0;

  const moneySaved = price * (discount / 100);
  const discountedPrice = price - moneySaved;
  const taxAmount = discountedPrice * (tax / 100);
  const finalPrice = discountedPrice + taxAmount;

  return (
    <div className="p-6 sm:p-10">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
          Discount & Sale Price Calculator
        </h3>
        <button
          onClick={() => {
            setOriginalPrice("80");
            setDiscountPercent("25");
            setTaxPercent("8");
          }}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white font-medium"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Original Price ($)
            </label>
            <input
              type="number"
              min="0"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-base focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Discount (%)
            </label>
            <div className="flex items-center gap-2">
              {[10, 20, 25, 30, 50].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDiscountPercent(d.toString())}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${
                    discountPercent === d.toString()
                      ? "border-brand-600 bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400"
                      : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {d}%
                </button>
              ))}
              <input
                type="number"
                min="0"
                max="100"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(e.target.value)}
                className="w-20 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-center text-xs focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Sales Tax (%) (Optional)
            </label>
            <input
              type="number"
              min="0"
              value={taxPercent}
              onChange={(e) => setTaxPercent(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-base focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        {/* Results */}
        <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Final Price</span>
            <div className="mt-2 text-4xl sm:text-5xl font-black text-emerald-600 dark:text-emerald-400">
              ${finalPrice.toFixed(2)}
            </div>

            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">You Save:</span>
                <span className="font-bold text-emerald-600">${moneySaved.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Price Before Tax:</span>
                <span className="font-bold text-slate-900 dark:text-white">${discountedPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Tax Amount:</span>
                <span className="font-bold text-slate-900 dark:text-white">${taxAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
