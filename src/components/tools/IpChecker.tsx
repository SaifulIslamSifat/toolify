"use client";

import { useState, useEffect } from "react";
import { Network, Copy, Check, RefreshCw, ShieldCheck } from "lucide-react";
import { copyToClipboard } from "@/lib/utils";

interface IpData {
  ip: string;
  userAgent: string;
  protocol: string;
  host: string;
  headers: Record<string, string>;
}

export default function IpChecker() {
  const [data, setData] = useState<IpData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const fetchIpInfo = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/network/ip");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIpInfo();
  }, []);

  const handleCopy = async () => {
    if (!data) return;
    const success = await copyToClipboard(data.ip);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-6 sm:p-10 space-y-8">
      {/* IP Spotlight Box */}
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-white flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Your Public IP Address
          </span>
          <div className="text-3xl sm:text-5xl font-mono font-black text-emerald-400 mt-2 select-all">
            {loading ? "Detecting IP..." : data?.ip || "Unknown"}
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Connection Protocol: {data?.protocol.toUpperCase() || "HTTPS"}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto flex-shrink-0">
          <button
            onClick={fetchIpInfo}
            className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
            title="Refresh IP"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={handleCopy}
            disabled={!data}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-sm shadow-md"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Copied IP</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy IP</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Network details & headers */}
      {data && (
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Client Browser & Network Environment
          </h4>

          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 text-xs">
            <span className="font-bold text-slate-500 block mb-1">User Agent:</span>
            <span className="font-mono text-slate-800 dark:text-slate-200 break-all">{data.userAgent}</span>
          </div>

          <div>
            <span className="text-xs font-bold text-slate-500 block mb-2">Received Request Headers:</span>
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 font-mono text-xs text-slate-300 space-y-1.5 max-h-64 overflow-y-auto">
              {Object.entries(data.headers).map(([key, val]) => (
                <div key={key} className="break-all">
                  <span className="text-brand-400 font-bold">{key}:</span>{" "}
                  <span className="text-slate-200">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
