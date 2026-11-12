"use client";

import { useState } from "react";
import { Wifi, Globe, CheckCircle2, XCircle, Clock, ShieldCheck, ArrowRight } from "lucide-react";

interface StatusResult {
  online: boolean;
  statusCode?: number;
  statusText?: string;
  responseTimeMs?: number;
  finalUrl?: string;
  contentType?: string;
  server?: string;
  error?: string;
}

export default function WebsiteStatusChecker() {
  const [url, setUrl] = useState<string>("https://google.com");
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<StatusResult | null>(null);

  const checkStatus = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/network/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setResult({
        online: false,
        error: err.message || "Failed to contact checker service",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 sm:p-10 space-y-6">
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
          Enter Website URL to Check
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-base focus:outline-none focus:border-brand-500"
          />
          <button
            onClick={checkStatus}
            disabled={loading || !url.trim()}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all flex-shrink-0"
          >
            <Wifi className={`w-4 h-4 ${loading ? "animate-pulse" : ""}`} />
            <span>{loading ? "Checking Status..." : "Check Status"}</span>
          </button>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>SSRF Protected: Private IPs, localhosts, and cloud metadata ports are safely filtered.</span>
        </div>
      </div>

      {result && (
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          {result.error ? (
            <div className="p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-start gap-3">
              <XCircle className="w-6 h-6 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-rose-900 dark:text-rose-200">Host Unreachable or Blocked</h4>
                <p className="text-xs text-rose-700 dark:text-rose-300 mt-1">{result.error}</p>
              </div>
            </div>
          ) : (
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {result.online ? (
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
                      <XCircle className="w-7 h-7" />
                    </div>
                  )}
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Status</span>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                      {result.online ? "Online & Reachable" : "Reported Issues"}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono font-bold text-xs text-slate-700 dark:text-slate-300">
                    HTTP {result.statusCode} {result.statusText}
                  </div>
                  <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{result.responseTimeMs} ms</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-200 dark:border-slate-700 text-xs">
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">Resolved Endpoint</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block mt-0.5">
                    {result.finalUrl}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">Content-Type</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block mt-0.5">
                    {result.contentType}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">Server Software</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block mt-0.5">
                    {result.server}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
