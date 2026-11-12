"use client";

import { useState, useRef, useEffect } from "react";
import Dropzone from "@/components/Dropzone";
import { Download, RotateCcw, RotateCw, FlipHorizontal, FlipVertical } from "lucide-react";

export default function ImageRotator() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [rotation, setRotation] = useState<number>(0); // 0, 90, 180, 270
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    const url = URL.createObjectURL(selected);
    setPreviewUrl(url);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
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

      const isRotated90or270 = rotation === 90 || rotation === 270;
      canvas.width = isRotated90or270 ? img.height : img.width;
      canvas.height = isRotated90or270 ? img.width : img.height;

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      ctx.restore();
    };
  }, [previewUrl, rotation, flipH, flipV]);

  const rotateClockwise = () => setRotation((prev) => (prev + 90) % 360);
  const rotateCounterClockwise = () => setRotation((prev) => (prev - 90 + 360) % 360);
  const toggleFlipH = () => setFlipH(!flipH);
  const toggleFlipV = () => setFlipV(!flipV);

  const downloadImage = () => {
    if (!canvasRef.current || !file) return;
    const url = canvasRef.current.toDataURL(file.type || "image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `rotated-${file.name}`;
    a.click();
  };

  const resetAll = () => {
    setFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setRotation(0);
  };

  return (
    <div className="p-6 sm:p-10 space-y-6">
      {!file ? (
        <Dropzone
          onFilesSelected={handleFilesSelected}
          accept="image/*"
          description="Drop any photo to rotate 90/180 degrees or flip horizontally & vertically"
        />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            {/* Rotation & Flip Controls */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={rotateCounterClockwise}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold hover:border-brand-500"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>-90°</span>
              </button>
              <button
                onClick={rotateClockwise}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold hover:border-brand-500"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>+90°</span>
              </button>
              <button
                onClick={toggleFlipH}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold ${
                  flipH
                    ? "border-brand-500 bg-brand-50 text-brand-600 dark:bg-brand-950/60"
                    : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                }`}
              >
                <FlipHorizontal className="w-3.5 h-3.5" />
                <span>Flip H</span>
              </button>
              <button
                onClick={toggleFlipV}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold ${
                  flipV
                    ? "border-brand-500 bg-brand-50 text-brand-600 dark:bg-brand-950/60"
                    : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                }`}
              >
                <FlipVertical className="w-3.5 h-3.5" />
                <span>Flip V</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={resetAll}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-rose-500"
              >
                Reset
              </button>
              <button
                onClick={downloadImage}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download Result</span>
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-center min-h-[300px]">
            <canvas ref={canvasRef} className="max-h-80 max-w-full rounded-lg shadow-md object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}
