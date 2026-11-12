"use client";

import { useState } from "react";
import { Coins, RotateCcw } from "lucide-react";

export default function LoanCalculator() {
  const [principal, setPrincipal] = useState<string>("250000");
  const [interestRate, setInterestRate] = useState<string>("6.5");
  const [years, setYears] = useState<string>("30");

  const p = parseFloat(principal) || 0;
  const annualR = parseFloat(interestRate) || 0;
  const y = parseFloat(years) || 0;

  let monthlyPayment = 0;
  let totalPayment = 0;
  let totalInterest = 0;

  if (p > 0 && annualR > 0 && y > 0) {
    const monthlyRate = annualR / 100 / 12;
    const numberOfPayments = y * 12;
    monthlyPayment =
      (p * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    totalPayment = monthlyPayment * numberOfPayments;
    totalInterest = totalPayment - p;
  }

  return (
    <div className="p-6 sm:p-10">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
          Loan & Mortgage Payment Calculator
        </h3>
        <button
          onClick={() => {
            setPrincipal("250000");
            setInterestRate("6.5");
            setYears("30");
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
              Loan Amount (Principal)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                $
              </span>
              <input
                type="number"
                min="1000"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-base focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Annual Interest Rate (APR %)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="30"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-base focus:outline-none focus:border-brand-500"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                %
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Loan Term (Years)
            </label>
            <div className="flex gap-2">
              {[15, 20, 30].map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setYears(term.toString())}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${
                    years === term.toString()
                      ? "border-brand-600 bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400"
                      : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {term} Years
                </button>
              ))}
              <input
                type="number"
                min="1"
                max="50"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                className="w-24 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-center text-xs focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Estimated Monthly Payment
            </span>
            <div className="mt-2 text-4xl sm:text-5xl font-black text-brand-600 dark:text-brand-400">
              ${monthlyPayment > 0 ? monthlyPayment.toFixed(2) : "0.00"}
              <span className="text-xs text-slate-400 font-normal"> / month</span>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Principal Amount:</span>
                <span className="font-bold text-slate-900 dark:text-white">${p.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Total Interest Paid:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  ${totalInterest > 0 ? totalInterest.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "0.00"}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Total Loan Cost:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  ${totalPayment > 0 ? totalPayment.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "0.00"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 text-[11px] text-slate-400">
            Based on fixed interest compounding monthly. Taxes and insurance not included.
          </div>
        </div>
      </div>
    </div>
  );
}
