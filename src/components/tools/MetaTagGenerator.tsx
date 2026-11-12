"use client";

import { useState } from "react";
import { Share2, Copy, Check, Globe } from "lucide-react";
import { copyToClipboard } from "@/lib/utils";

export default function MetaTagGenerator() {
  const [title, setTitle] = useState<string>("Toolify - Free All-In-One Online Productivity Tools");
  const [description, setDescription] = useState<string>(
    "A modern, fast, and privacy-focused online utility platform. Free tools for image editing, PDF manipulation, converters, calculators, and developer utilities."
  );
  const [url, setUrl] = useState<string>("https://toolify.local");
  const [imageUrl, setImageUrl] = useState<string>("https://toolify.local/og-image.jpg");
  const [copied, setCopied] = useState<boolean>(false);

  const metaHtml = `<!-- Primary Meta Tags -->
<title>${title}</title>
<meta name="title" content="${title}">
<meta name="description" content="${description}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="${imageUrl}">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="${url}">
<meta property="twitter:title" content="${title}">
<meta property="twitter:description" content="${description}">
<meta property="twitter:image" content="${imageUrl}">`;

  const handleCopy = async () => {
    const success = await copyToClipboard(metaHtml);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-6 sm:p-10 space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Inputs */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Page Title</label>
              <span className={`text-[10px] font-bold ${title.length > 60 ? "text-amber-500" : "text-slate-400"}`}>
                {title.length}/60 chars
              </span>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Meta Description</label>
              <span className={`text-[10px] font-bold ${description.length > 160 ? "text-amber-500" : "text-slate-400"}`}>
                {description.length}/160 chars
              </span>
            </div>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium focus:outline-none focus:border-brand-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Canonical URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Open Graph Image URL (1200x630px)
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        {/* Live Previews */}
        <div className="space-y-6">
          {/* Google Search Mockup */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">
              Google Search Result Preview
            </span>
            <div className="text-xs text-slate-600 dark:text-slate-400 truncate">{url}</div>
            <h4 className="text-base text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer truncate">
              {title}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {description}
            </p>
          </div>

          {/* Social Share Card Mockup */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 overflow-hidden shadow-sm">
            <div className="h-32 bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400 text-xs font-bold">
              <span>Social Share Image (1200 × 630)</span>
            </div>
            <div className="p-3">
              <span className="text-[10px] uppercase font-bold text-slate-400 block truncate">
                {url.replace(/^https?:\/\//, "")}
              </span>
              <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate mt-0.5">{title}</h5>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">{description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* HTML Tag Output */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Generated HTML Meta Tags
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied Code</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy HTML Tags</span>
              </>
            )}
          </button>
        </div>
        <pre className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 text-emerald-400 font-mono text-xs leading-relaxed max-h-56 overflow-y-auto whitespace-pre-wrap select-all">
          {metaHtml}
        </pre>
      </div>
    </div>
  );
}
