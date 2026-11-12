"use client";

import { useState, useRef, useEffect } from "react";
import Dropzone from "@/components/Dropzone";
import { Download, RotateCcw, Crop } from "lucide-react";

export default function ImageCropper() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [aspect, setAspect] = useState<"free" | "1:1" | "16:9" | "4:3">("free");
  const [cropPercent, setCropPercent] = useState<number>(80);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    const url = URL.createObjectURL(selected);
    setPreviewUrl(url);
  };

  useEffect(() => {
    if (!previewUrl || !canvasRef.current) return;

    const img = new Image();
    img.src = previewUrl;
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      let cropW = img.width * (cropPercent / 100);
      let cropH = img.height * (cropPercent / 100);

      if (aspect === "1:1") {
        const side = Math.min(cropW, cropH);
        cropW = side;
        cropH = side;
      } else if (aspect === "16:9") {
        cropH = (cropW * 9) / 16;
      } else if (aspect === "4:3") {
        cropH = (cropW * 3) / 4;
      }

      // Center crop
      const startX = (img.width - cropW) / 2;
      const startY = (img.height - cropH) / 2;

      canvas.width = cropW;
      canvas.height = cropH;

      ctx.drawImage(img, startX, startY, cropW, cropH, 0, 0, cropW, cropH);
    };
  }, [previewUrl, aspect, cropPercent]);

  const downloadCropped = () => {
    if (!canvasRef.current || !file) return;
    const url = canvasRef.current.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `cropped-${file.name.replace(/\.[^/.]+$/, "")}.png`;
    a.click();
  };

  const resetAll = () => {
    setFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  return (
    <div className="p-6 sm:p-10 space-y-6">
      {!file ? (
        <Dropzone
          onFilesSelected={handleFilesSelected}
          accept="image/*"
          description="Drop any photo to crop to 1:1 avatar, 16:9 banner, or custom proportions"
        />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            {/* Aspect ratio presets */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
              {(["free", "1:1", "16:9", "4:3"] as const).map((ratio) => (
                <button
                  key={ratio}
                  onClick={() => setAspect(ratio)}
                  className={`px-3 py-1.5 rounded-lg ${
                    aspect === ratio
                      ? "bg-white dark:bg-slate-900 text-brand-600 shadow-sm"
                      : "text-slate-500"
                  }`}
                >
                  {ratio === "free" ? "Freeform" : ratio}
                </button>
              ))}
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
                onClick={downloadCropped}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download Cropped PNG</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-500">Crop Zoom:</span>
            <input
              type="range"
              min="30"
              max="100"
              value={cropPercent}
              onChange={(e) => setCropPercent(Number(e.target.value))}
              className="w-56 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-600"
            />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{cropPercent}% area</span>
          </div>

          {/* Canvas Crop preview */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-center min-h-[300px]">
            <canvas ref={canvasRef} className="max-h-80 max-w-full rounded-lg shadow-md object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}
