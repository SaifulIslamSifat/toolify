"use client";

import { useState } from "react";
import { Calendar, RotateCcw, Clock, Gift } from "lucide-react";

export default function AgeCalculator() {
  const todayStr = new Date().toISOString().split("T")[0];
  const [birthDate, setBirthDate] = useState<string>("1998-05-15");
  const [targetDate, setTargetDate] = useState<string>(todayStr);

  const calculateAge = () => {
    if (!birthDate || !targetDate) return null;
    const birth = new Date(birthDate);
    const target = new Date(targetDate);

    if (isNaN(birth.getTime()) || isNaN(target.getTime()) || birth > target) {
      return null;
    }

    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonthLastDay = new Date(target.getFullYear(), target.getMonth(), 0).getDate();
      days += prevMonthLastDay;
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    // Total differences
    const diffTime = Math.abs(target.getTime() - birth.getTime());
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = totalDays * 24;

    // Next birthday
    let nextBdayYear = target.getFullYear();
    const thisYearBday = new Date(nextBdayYear, birth.getMonth(), birth.getDate());
    if (thisYearBday < target) {
      nextBdayYear += 1;
    }
    const nextBday = new Date(nextBdayYear, birth.getMonth(), birth.getDate());
    const daysUntilNextBday = Math.ceil((nextBday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));

    return {
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      totalHours,
      daysUntilNextBday,
    };
  };

  const ageResult = calculateAge();

  return (
    <div className="p-6 sm:p-10">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Date of Birth & Age Calculator</h3>
        <button
          onClick={() => {
            setBirthDate("1998-05-15");
            setTargetDate(todayStr);
          }}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white font-medium"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Date of Birth
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-base font-semibold focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Age on Date (Defaults to Today)
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-base font-semibold focus:outline-none focus:border-brand-500"
            />
          </div>

          {ageResult && (
            <div className="p-4 rounded-2xl bg-brand-50 dark:bg-brand-950/40 border border-brand-100 dark:border-brand-900/60 flex items-center gap-3">
              <Gift className="w-5 h-5 text-brand-600 dark:text-brand-400 flex-shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-brand-900 dark:text-brand-200">Next Birthday: </span>
                <span className="text-brand-700 dark:text-brand-300">
                  {ageResult.daysUntilNextBday === 0
                    ? "🎉 Happy Birthday today!"
                    : `In ${ageResult.daysUntilNextBday} days`}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          {ageResult ? (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Exact Age</span>
                <div className="flex items-baseline gap-2 mt-2 flex-wrap">
                  <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white">
                    {ageResult.years}
                  </span>
                  <span className="text-lg font-bold text-slate-500">years,</span>
                  <span className="text-2xl sm:text-3xl font-black text-brand-600">
                    {ageResult.months}
                  </span>
                  <span className="text-base font-bold text-slate-500">months,</span>
                  <span className="text-2xl sm:text-3xl font-black text-brand-600">
                    {ageResult.days}
                  </span>
                  <span className="text-base font-bold text-slate-500">days</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 text-center">
                  <span className="block text-[10px] uppercase font-bold text-slate-400">Total Days</span>
                  <span className="text-base font-extrabold text-slate-900 dark:text-white">
                    {ageResult.totalDays.toLocaleString()}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 text-center">
                  <span className="block text-[10px] uppercase font-bold text-slate-400">Total Weeks</span>
                  <span className="text-base font-extrabold text-slate-900 dark:text-white">
                    {ageResult.totalWeeks.toLocaleString()}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 text-center">
                  <span className="block text-[10px] uppercase font-bold text-slate-400">Total Hours</span>
                  <span className="text-base font-extrabold text-slate-900 dark:text-white">
                    {ageResult.totalHours.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400">
              <Calendar className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-semibold">Please select a valid birth date</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
