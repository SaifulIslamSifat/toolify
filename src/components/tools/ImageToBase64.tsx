"use client";

import { useState } from "react";
import Dropzone from "@/components/Dropzone";
import { Copy, Check, RotateCcw } from "lucide-react";
import { copyToClipboard, formatBytes } from "@/lib/utils";

export default function ImageToBase64() {
  const [file, setFile] = useState<File | null>(null);
  const [dataUri, setDataUri] = useState<string>("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setDataUri(reader.result);
      }
    };
    reader.readAsDataURL(selected);
  };

  const rawBase64 = dataUri.split(",")[1] || "";
  const htmlSnippet = `<img src="${dataUri}" alt="${file?.name || "image"}" />`;
  const cssSnippet = `background-image: url("${dataUri}");`;

  const handleCopy = async (key: string, content: string) => {
    const success = await copyToClipboard(content);
    if (success) {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const resetAll = () => {
    setFile(null);
    setDataUri("");
  };

  return (
    <div className="p-6 sm:p-10 space-y-6">
      {!file ? (
        <Dropzone
          onFilesSelected={handleFilesSelected}
          accept="image/*"
          description="Drop any image (PNG, JPG, SVG, WebP) to encode into Base64 & Data URI"
        />
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="text-xs text-slate-500">
              File: <span className="font-bold text-slate-900 dark:text-white">{file.name}</span> (
              {formatBytes(file.size)})
            </div>
            <button
              onClick={resetAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-rose-500"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Convert Another</span>
            </button>
          </div>

          <div className="space-y-4">
            {[
              { key: "datauri", title: "Complete Data URI", text: dataUri },
              { key: "html", title: "HTML <img> Tag", text: htmlSnippet },
              { key: "css", title: "CSS background-image Snippet", text: cssSnippet },
              { key: "raw", title: "Raw Base64 String", text: rawBase64 },
            ].map((item) => (
              <div
                key={item.key}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{item.title}</span>
                  <button
                    onClick={() => handleCopy(item.key, item.text)}
                    className="flex items-center gap-1 text-xs font-bold text-brand-600 dark:text-brand-400"
                  >
                    {copiedKey === item.key ? (
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
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 font-mono text-xs text-slate-700 dark:text-slate-300 max-h-24 overflow-y-auto break-all select-all">
                  {item.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
