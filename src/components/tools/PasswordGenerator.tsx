"use client";

import { useState, useEffect } from "react";
import { KeyRound, Copy, Check, RefreshCw, Shield } from "lucide-react";
import { copyToClipboard } from "@/lib/utils";

export default function PasswordGenerator() {
  const [length, setLength] = useState<number>(18);
  const [useUpper, setUseUpper] = useState<boolean>(true);
  const [useLower, setUseLower] = useState<boolean>(true);
  const [useNumbers, setUseNumbers] = useState<boolean>(true);
  const [useSymbols, setUseSymbols] = useState<boolean>(true);

  const [password, setPassword] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  const generatePassword = () => {
    let charset = "";
    if (useUpper) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (useLower) charset += "abcdefghijklmnopqrstuvwxyz";
    if (useNumbers) charset += "0123456789";
    if (useSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    if (!charset) {
      setPassword("");
      return;
    }

    const randomValues = new Uint32Array(length);
    if (typeof window !== "undefined" && window.crypto) {
      window.crypto.getRandomValues(randomValues);
      let result = "";
      for (let i = 0; i < length; i++) {
        result += charset[randomValues[i] % charset.length];
      }
      setPassword(result);
    }
  };

  useEffect(() => {
    generatePassword();
  }, [length, useUpper, useLower, useNumbers, useSymbols]);

  // Entropy calculation
  const getPoolSize = () => {
    let pool = 0;
    if (useUpper) pool += 26;
    if (useLower) pool += 26;
    if (useNumbers) pool += 10;
    if (useSymbols) pool += 28;
    return pool;
  };

  const entropy = Math.round(length * Math.log2(getPoolSize() || 1));

  const getStrengthLabel = () => {
    if (entropy < 40) return { label: "Weak", color: "text-rose-500", bar: "w-1/4 bg-rose-500" };
    if (entropy < 60) return { label: "Fair", color: "text-amber-500", bar: "w-2/4 bg-amber-500" };
    if (entropy < 85) return { label: "Strong", color: "text-emerald-500", bar: "w-3/4 bg-emerald-500" };
    return { label: "Very Strong", color: "text-brand-500", bar: "w-full bg-brand-500" };
  };

  const strength = getStrengthLabel();

  const handleCopy = async () => {
    const success = await copyToClipboard(password);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-6 sm:p-10 space-y-8">
      {/* Generated Password Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 text-white flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full min-w-0">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Cryptographically Secure Password
          </span>
          <div className="text-xl sm:text-2xl font-mono font-bold tracking-wider text-emerald-400 break-all select-all mt-1">
            {password || "Select at least one character type"}
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto flex-shrink-0">
          <button
            onClick={generatePassword}
            title="Generate new password"
            className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button
            onClick={handleCopy}
            disabled={!password}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Password</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Strength meter */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-slate-500 flex items-center gap-1.5">
            <Shield className="w-4 h-4" /> Password Strength:
          </span>
          <span className={strength.color}>
            {strength.label} ({entropy} bits of entropy)
          </span>
        </div>
        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div className={`h-full transition-all duration-300 ${strength.bar}`} />
        </div>
      </div>

      {/* Customization Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Password Length:
            </label>
            <span className="text-sm font-black text-brand-600 dark:text-brand-400">{length} characters</span>
          </div>
          <input
            type="range"
            min="6"
            max="64"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
            <span>6</span>
            <span>16</span>
            <span>32</span>
            <span>64</span>
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-3 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={useUpper}
              onChange={(e) => setUseUpper(e.target.checked)}
              className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
            />
            <span>Include Uppercase Letters (A-Z)</span>
          </label>
          <label className="flex items-center gap-3 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={useLower}
              onChange={(e) => setUseLower(e.target.checked)}
              className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
            />
            <span>Include Lowercase Letters (a-z)</span>
          </label>
          <label className="flex items-center gap-3 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={useNumbers}
              onChange={(e) => setUseNumbers(e.target.checked)}
              className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
            />
            <span>Include Numbers (0-9)</span>
          </label>
          <label className="flex items-center gap-3 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={useSymbols}
              onChange={(e) => setUseSymbols(e.target.checked)}
              className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
            />
            <span>Include Symbols (!@#$%^&*)</span>
          </label>
        </div>
      </div>
    </div>
  );
}
