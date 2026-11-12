"use client";

import { useState } from "react";
import Dropzone from "@/components/Dropzone";
import { Download, RotateCcw, Lock, Unlock } from "lucide-react";
import { formatBytes } from "@/lib/utils";

export default function ImageResizer() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [origWidth, setOrigWidth] = useState<number>(0);
  const [origHeight, setOrigHeight] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [lockAspect, setLockAspect] = useState<boolean>(true);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);

    const url = URL.createObjectURL(selected);
    setPreviewUrl(url);

    const img = new Image();
    img.src = url;
    img.onload = () => {
      setOrigWidth(img.width);
      setOrigHeight(img.height);
      setWidth(img.width);
      setHeight(img.height);
    };
  };

  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (lockAspect && origWidth > 0) {
      setHeight(Math.round((val / origWidth) * origHeight));
    }
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (lockAspect && origHeight > 0) {
      setWidth(Math.round((val / origHeight) * origWidth));
    }
  };

  const applyPercentage = (pct: number) => {
    if (origWidth > 0 && origHeight > 0) {
      setWidth(Math.round(origWidth * (pct / 100)));
      setHeight(Math.round(origHeight * (pct / 100)));
    }
  };

  const downloadResized = () => {
    if (!previewUrl || !file || width <= 0 || height <= 0) return;

    const img = new Image();
    img.src = previewUrl;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `resized-${width}x${height}-${file.name}`;
        a.click();
        URL.revokeObjectURL(url);
      }, file.type || "image/png");
    };
  };

  const resetAll = () => {
    setFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setOrigWidth(0);
    setOrigHeight(0);
    setWidth(0);
    setHeight(0);
  };

  return (
    <div className="p-6 sm:p-10 space-y-6">
      {!file ? (
        <Dropzone
          onFilesSelected={handleFilesSelected}
          accept="image/*"
          description="Drop any image to resize to custom dimensions or percentage"
        />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="text-xs text-slate-500">
              Original: <span className="font-bold text-slate-900 dark:text-white">{origWidth} × {origHeight} px</span>
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
                onClick={downloadResized}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download ({width} × {height} px)</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Dimensions controls */}
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4 items-center">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Width (px)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="10000"
                    value={width}
                    onChange={(e) => handleWidthChange(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-base focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Height (px)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="10000"
                    value={height}
                    onChange={(e) => handleHeightChange(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-base focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              {/* Lock aspect ratio */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setLockAspect(!lockAspect)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold ${
                    lockAspect
                      ? "border-brand-500 bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400"
                      : "border-slate-200 text-slate-400"
                  }`}
                >
                  {lockAspect ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                  <span>Maintain Aspect Ratio</span>
                </button>

                {/* Percentage shortcuts */}
                <div className="flex items-center gap-1.5">
                  {[25, 50, 75, 100, 150].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => applyPercentage(pct)}
                      className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:border-brand-500"
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Preview image */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-center flex items-center justify-center min-h-[260px] overflow-hidden">
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Resized Preview"
                  className="max-h-60 max-w-full object-contain rounded-lg shadow-sm"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
