"use client";

import { useState, useRef, useEffect } from "react";
import Dropzone from "@/components/Dropzone";
import { formatBytes } from "@/lib/utils";
import { Download, Minimize2, RotateCcw, ArrowRight } from "lucide-react";

export default function ImageCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [quality, setQuality] = useState<number>(75);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    setOriginalSize(selected.size);

    const url = URL.createObjectURL(selected);
    setPreviewUrl(url);
    compressImage(selected, quality);
  };

  const compressImage = (sourceFile: File, q: number) => {
    setIsProcessing(true);
    const img = new Image();
    const url = URL.createObjectURL(sourceFile);
    img.src = url;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);

      // Determine output format (JPEG or WebP for true compression)
      const outputMime = sourceFile.type === "image/png" ? "image/webp" : "image/jpeg";

      canvas.toBlob(
        (blob) => {
          setIsProcessing(false);
          if (blob) {
            setCompressedSize(blob.size);
            if (compressedUrl) URL.revokeObjectURL(compressedUrl);
            setCompressedUrl(URL.createObjectURL(blob));
          }
        },
        outputMime,
        q / 100
      );
      URL.revokeObjectURL(url);
    };
  };

  const handleQualityChange = (newQuality: number) => {
    setQuality(newQuality);
    if (file) {
      compressImage(file, newQuality);
    }
  };

  const downloadCompressed = () => {
    if (!compressedUrl || !file) return;
    const ext = file.type === "image/png" ? "webp" : "jpg";
    const a = document.createElement("a");
    a.href = compressedUrl;
    a.download = `compressed-${file.name.replace(/\.[^/.]+$/, "")}.${ext}`;
    a.click();
  };

  const resetAll = () => {
    setFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (compressedUrl) URL.revokeObjectURL(compressedUrl);
    setPreviewUrl(null);
    setCompressedUrl(null);
    setOriginalSize(0);
    setCompressedSize(0);
  };

  const percentSaved =
    originalSize > 0 && compressedSize > 0
      ? Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100))
      : 0;

  return (
    <div className="p-6 sm:p-10 space-y-6">
      {!file ? (
        <Dropzone
          onFilesSelected={handleFilesSelected}
          accept="image/jpeg,image/png,image/webp"
          maxSizeMB={25}
          description="Drop any JPG, PNG, or WebP photo to compress up to 85%"
        />
      ) : (
        <div className="space-y-6">
          {/* Action Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-500">Quality:</span>
              <input
                type="range"
                min="10"
                max="95"
                value={quality}
                onChange={(e) => handleQualityChange(Number(e.target.value))}
                className="w-48 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-600"
              />
              <span className="text-xs font-black text-brand-600 dark:text-brand-400 min-w-[35px]">
                {quality}%
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={resetAll}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-rose-500"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Upload Another</span>
              </button>
              <button
                onClick={downloadCompressed}
                disabled={isProcessing || !compressedUrl}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download ({formatBytes(compressedSize)})</span>
              </button>
            </div>
          </div>

          {/* Size metrics comparison */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Original Size</span>
                <div className="text-base font-extrabold text-slate-700 dark:text-slate-300">
                  {formatBytes(originalSize)}
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Compressed Size</span>
                <div className="text-base font-black text-brand-600 dark:text-brand-400">
                  {isProcessing ? "Optimizing..." : formatBytes(compressedSize)}
                </div>
              </div>
            </div>

            {percentSaved > 0 && (
              <div className="px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-black">
                🎉 Saved {percentSaved}% file size
              </div>
            )}
          </div>

          {/* Previews */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                Original Image
              </span>
              {previewUrl && (
                <div className="relative h-64 w-full flex items-center justify-center bg-slate-100 dark:bg-slate-950 rounded-xl overflow-hidden">
                  <img src={previewUrl} alt="Original" className="max-h-full max-w-full object-contain" />
                </div>
              )}
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
              <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider mb-2 block">
                Optimized Result
              </span>
              {compressedUrl && (
                <div className="relative h-64 w-full flex items-center justify-center bg-slate-100 dark:bg-slate-950 rounded-xl overflow-hidden">
                  <img src={compressedUrl} alt="Compressed" className="max-h-full max-w-full object-contain" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
