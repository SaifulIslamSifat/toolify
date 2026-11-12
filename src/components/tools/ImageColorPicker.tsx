"use client";

import { useState, useRef, MouseEvent } from "react";
import Dropzone from "@/components/Dropzone";
import { Pipette, Copy, Check, RotateCcw } from "lucide-react";
import { copyToClipboard } from "@/lib/utils";

export default function ImageColorPicker() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedHex, setSelectedHex] = useState<string>("#4F46E5");
  const [selectedRgb, setSelectedRgb] = useState<string>("rgb(79, 70, 229)");
  const [selectedHsl, setSelectedHsl] = useState<string>("hsl(243, 75%, 59%)");
  const [palette, setPalette] = useState<string[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    const url = URL.createObjectURL(selected);
    setPreviewUrl(url);

    const img = new Image();
    img.src = url;
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);

      // Extract sample palette
      extractSamplePalette(ctx, img.width, img.height);
    };
  };

  const extractSamplePalette = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const colors: Set<string> = new Set();
    const stepX = Math.floor(w / 4);
    const stepY = Math.floor(h / 3);

    for (let x = stepX / 2; x < w; x += stepX) {
      for (let y = stepY / 2; y < h; y += stepY) {
        const pixel = ctx.getImageData(Math.floor(x), Math.floor(y), 1, 1).data;
        const hex = rgbToHex(pixel[0], pixel[1], pixel[2]);
        colors.add(hex);
      }
    }
    setPalette(Array.from(colors).slice(0, 6));
  };

  const rgbToHex = (r: number, g: number, b: number) =>
    "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  };

  const handleCanvasClick = (e: MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);

    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const hex = rgbToHex(pixel[0], pixel[1], pixel[2]);
    setSelectedHex(hex);
    setSelectedRgb(`rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`);
    setSelectedHsl(rgbToHsl(pixel[0], pixel[1], pixel[2]));
  };

  const handleCopy = async (key: string, val: string) => {
    const success = await copyToClipboard(val);
    if (success) {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const resetAll = () => {
    setFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setPalette([]);
  };

  return (
    <div className="p-6 sm:p-10 space-y-6">
      {!file ? (
        <Dropzone
          onFilesSelected={handleFilesSelected}
          accept="image/*"
          description="Drop any photo or screenshot to sample exact pixel colors and extract palettes"
        />
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-500 font-semibold">
              Click anywhere on the image to inspect and copy color values
            </span>
            <button
              onClick={resetAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-rose-500"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Upload Another</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Canvas Viewer */}
            <div className="lg:col-span-2 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-center overflow-auto max-h-[420px]">
              <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                className="max-h-96 max-w-full rounded-lg shadow-sm cursor-crosshair object-contain"
              />
            </div>

            {/* Selected Color Breakdown */}
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Selected Color
                </span>
                <div className="flex items-center gap-4 mt-2">
                  <div
                    className="w-16 h-16 rounded-2xl shadow-inner border border-black/10 flex-shrink-0"
                    style={{ backgroundColor: selectedHex }}
                  />
                  <div>
                    <span className="text-xl font-mono font-black text-slate-900 dark:text-white uppercase">
                      {selectedHex}
                    </span>
                    <span className="block text-xs font-mono text-slate-500">{selectedRgb}</span>
                  </div>
                </div>
              </div>

              {/* Copy codes */}
              <div className="space-y-3">
                {[
                  { key: "hex", label: "HEX", val: selectedHex.toUpperCase() },
                  { key: "rgb", label: "RGB", val: selectedRgb },
                  { key: "hsl", label: "HSL", val: selectedHsl },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700 text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-400 mr-2">{item.label}:</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{item.val}</span>
                    </div>
                    <button
                      onClick={() => handleCopy(item.key, item.val)}
                      className="text-brand-600 dark:text-brand-400 font-bold hover:underline"
                    >
                      {copiedKey === item.key ? "Copied" : "Copy"}
                    </button>
                  </div>
                ))}
              </div>

              {/* Extracted Palette */}
              {palette.length > 0 && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-500 block mb-2">Dominant Colors</span>
                  <div className="flex items-center gap-2">
                    {palette.map((col, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedHex(col)}
                        title={col}
                        className="w-8 h-8 rounded-xl shadow-sm border border-black/10 hover:scale-110 transition-transform"
                        style={{ backgroundColor: col }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
