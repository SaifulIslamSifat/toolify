"use client";

import { useState, useEffect } from "react";
import { Clock, RotateCcw, Copy, Check } from "lucide-react";
import { copyToClipboard } from "@/lib/utils";

export default function TimestampConverter() {
  const [currentEpoch, setCurrentEpoch] = useState<number>(Math.floor(Date.now() / 1000));
  const [inputEpoch, setInputEpoch] = useState<string>(Math.floor(Date.now() / 1000).toString());
  const [inputDate, setInputDate] = useState<string>(new Date().toISOString().slice(0, 16));
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentEpoch(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const epochNum = parseInt(inputEpoch) || 0;
  // If length is > 11, likely milliseconds
  const dateFromEpoch = new Date(epochNum > 9999999999 ? epochNum : epochNum * 1000);
  const isValidDate = !isNaN(dateFromEpoch.getTime()) && epochNum > 0;

  const epochFromDate = Math.floor(new Date(inputDate).getTime() / 1000);

  const handleCopy = async (val: string) => {
    const success = await copyToClipboard(val);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-6 sm:p-10 space-y-8">
      {/* Live Epoch Counter */}
      <div className="p-6 rounded-2xl bg-brand-50/60 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-900/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Clock className="w-6 h-6 text-brand-600 animate-pulse" />
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              Current Unix Epoch Time
            </span>
            <div className="text-2xl sm:text-3xl font-mono font-black text-slate-900 dark:text-white">
              {currentEpoch}
            </div>
          </div>
        </div>

        <button
          onClick={() => setInputEpoch(currentEpoch.toString())}
          className="px-4 py-2 rounded-xl bg-brand-600 text-white font-bold text-xs shadow-sm hover:bg-brand-700"
        >
          Use Current Time
        </button>
      </div>

      {/* Mode 1: Epoch to Date */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          1. Convert Unix Timestamp to Human Date
        </h4>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="number"
            value={inputEpoch}
            onChange={(e) => setInputEpoch(e.target.value)}
            placeholder="Enter seconds (e.g. 1773446400)..."
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold text-base focus:outline-none focus:border-brand-500"
          />
        </div>

        {isValidDate ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700">
              <span className="text-[11px] font-bold text-slate-400 uppercase">UTC Time</span>
              <div className="text-sm font-mono font-bold text-slate-900 dark:text-white mt-1">
                {dateFromEpoch.toUTCString()}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Your Local Time</span>
              <div className="text-sm font-mono font-bold text-slate-900 dark:text-white mt-1">
                {dateFromEpoch.toString()}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-xs text-rose-500 font-medium">Please enter a valid numeric Unix timestamp.</p>
        )}
      </div>

      {/* Mode 2: Date to Epoch */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          2. Convert Date & Time to Unix Timestamp
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <input
            type="datetime-local"
            value={inputDate}
            onChange={(e) => setInputDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold text-sm focus:outline-none focus:border-brand-500"
          />

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400">Timestamp:</span>
              <div className="font-mono font-bold text-base text-brand-600 dark:text-brand-400">
                {isNaN(epochFromDate) ? "--" : epochFromDate}
              </div>
            </div>
            {!isNaN(epochFromDate) && (
              <button
                onClick={() => handleCopy(epochFromDate.toString())}
                className="px-3 py-1.5 rounded-lg bg-brand-600 text-white font-bold text-xs"
              >
                Copy
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
