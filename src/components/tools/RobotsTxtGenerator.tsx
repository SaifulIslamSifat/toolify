"use client";

import { useState } from "react";
import { Bot, Copy, Check, Download, Plus, Trash2 } from "lucide-react";
import { copyToClipboard } from "@/lib/utils";

interface Rule {
  id: string;
  userAgent: string;
  type: "Disallow" | "Allow";
  path: string;
}

export default function RobotsTxtGenerator() {
  const [sitemapUrl, setSitemapUrl] = useState<string>("https://toolify.local/sitemap.xml");
  const [rules, setRules] = useState<Rule[]>([
    { id: "1", userAgent: "*", type: "Disallow", path: "/admin" },
    { id: "2", userAgent: "*", type: "Disallow", path: "/api/" },
    { id: "3", userAgent: "*", type: "Allow", path: "/" },
  ]);
  const [copied, setCopied] = useState<boolean>(false);

  const addRule = () => {
    setRules((prev) => [
      ...prev,
      { id: Math.random().toString(36).substring(2, 7), userAgent: "*", type: "Disallow", path: "/" },
    ]);
  };

  const removeRule = (id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  };

  const updateRule = (id: string, field: keyof Rule, val: string) => {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: val } : r)));
  };

  // Compile output
  const generateRobotsTxt = () => {
    const lines: string[] = [];
    const grouped: Record<string, Rule[]> = {};

    rules.forEach((r) => {
      if (!grouped[r.userAgent]) grouped[r.userAgent] = [];
      grouped[r.userAgent].push(r);
    });

    Object.keys(grouped).forEach((agent) => {
      lines.push(`User-agent: ${agent}`);
      grouped[agent].forEach((r) => {
        lines.push(`${r.type}: ${r.path}`);
      });
      lines.push("");
    });

    if (sitemapUrl.trim()) {
      lines.push(`Sitemap: ${sitemapUrl.trim()}`);
    }

    return lines.join("\n");
  };

  const robotsOutput = generateRobotsTxt();

  const handleCopy = async () => {
    const success = await copyToClipboard(robotsOutput);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([robotsOutput], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "robots.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 sm:p-10 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
          Robots.txt Crawler Configuration
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-brand-500"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download robots.txt</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Rules Configurator */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              XML Sitemap URL
            </label>
            <input
              type="url"
              value={sitemapUrl}
              onChange={(e) => setSitemapUrl(e.target.value)}
              placeholder="https://yourdomain.com/sitemap.xml"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Crawler Directives & Paths
              </label>
              <button
                type="button"
                onClick={addRule}
                className="flex items-center gap-1 text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
              >
                <Plus className="w-3.5 h-3.5" /> Add Rule
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto">
              {rules.map((rule) => (
                <div
                  key={rule.id}
                  className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40"
                >
                  <input
                    type="text"
                    value={rule.userAgent}
                    onChange={(e) => updateRule(rule.id, "userAgent", e.target.value)}
                    placeholder="User-agent (*)"
                    className="w-24 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold"
                  />
                  <select
                    value={rule.type}
                    onChange={(e) => updateRule(rule.id, "type", e.target.value as any)}
                    className="px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold"
                  >
                    <option value="Disallow">Disallow</option>
                    <option value="Allow">Allow</option>
                  </select>
                  <input
                    type="text"
                    value={rule.path}
                    onChange={(e) => updateRule(rule.id, "path", e.target.value)}
                    placeholder="/path/"
                    className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono"
                  />
                  <button
                    onClick={() => removeRule(rule.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Generated robots.txt Preview
          </span>
          <pre className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 text-emerald-400 font-mono text-xs leading-relaxed max-h-80 overflow-y-auto whitespace-pre-wrap select-all">
            {robotsOutput}
          </pre>
        </div>
      </div>
    </div>
  );
}
