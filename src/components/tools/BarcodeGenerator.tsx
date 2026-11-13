"use client";

import { useState, useEffect, useRef } from "react";
import { Download, Copy, Check, RefreshCw, Barcode, Sliders, Type } from "lucide-react";
import { copyToClipboard } from "@/lib/utils";

const CODE128_PATTERNS: string[] = [
  "212222", "222122", "222221", "121223", "121322", "131222", "122213", "122312", "132212", "221213",
  "221312", "231212", "112232", "122132", "122231", "113222", "123122", "123221", "223211", "221132",
  "221231", "213212", "223112", "312131", "311222", "321122", "321221", "312212", "322112", "322211",
  "212123", "212321", "232121", "111323", "131123", "131321", "112313", "132113", "132311", "211313",
  "231113", "231311", "112133", "112331", "132131", "113123", "113321", "133121", "313121", "211331",
  "231131", "213113", "213311", "213131", "311123", "311321", "331121", "312113", "312311", "332111",
  "314111", "221411", "431111", "111224", "111422", "121124", "121421", "141122", "141221", "112214",
  "112412", "122114", "122411", "142112", "142211", "241211", "221114", "413111", "241112", "134111",
  "111242", "121142", "121241", "114212", "124112", "124211", "411212", "421112", "421211", "212141",
  "214121", "412121", "111143", "111341", "131141", "114113", "114311", "411113", "411311", "113141",
  "114131", "311141", "411131", "211412", "211214", "211232", "2331112"
];

function encodeCode128B(rawText: string): string {
  const text = rawText || "TOOLIFY";
  const startCode = 104; // Code 128B start
  let checksum = startCode;
  const indices: number[] = [startCode];

  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i) - 32;
    const safeCode = code >= 0 && code <= 95 ? code : 31; // fallback to '?'
    indices.push(safeCode);
    checksum += (i + 1) * safeCode;
  }
  indices.push(checksum % 103);
  indices.push(106); // Stop pattern

  return indices.map((idx) => CODE128_PATTERNS[idx]).join("");
}

export default function BarcodeGenerator() {
  const [text, setText] = useState<string>("TOOLIFY-2026");
  const [scale, setScale] = useState<number>(2);
  const [barHeight, setBarHeight] = useState<number>(90);
  const [showText, setShowText] = useState<boolean>(true);
  const [barColor, setBarColor] = useState<string>("#0f172a");
  const [bgColor, setBgColor] = useState<string>("#ffffff");
  const [copied, setCopied] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const pattern = encodeCode128B(text);
    const quietZone = 24;
    let totalModules = 0;
    for (const d of pattern) {
      totalModules += parseInt(d, 10);
    }

    const barcodeWidth = totalModules * scale;
    const textHeight = showText ? 28 : 0;
    const totalWidth = barcodeWidth + quietZone * 2;
    const totalHeight = barHeight + quietZone * 2 + textHeight;

    canvas.width = totalWidth;
    canvas.height = totalHeight;

    // Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, totalWidth, totalHeight);

    // Draw bars
    ctx.fillStyle = barColor;
    let currentX = quietZone;
    let isBar = true;

    for (const d of pattern) {
      const width = parseInt(d, 10) * scale;
      if (isBar) {
        ctx.fillRect(currentX, quietZone, width, barHeight);
      }
      currentX += width;
      isBar = !isBar;
    }

    // Draw readable label
    if (showText && text) {
      ctx.fillStyle = barColor;
      ctx.font = `bold ${Math.max(12, scale * 6.5)}px monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, totalWidth / 2, quietZone + barHeight + textHeight / 2 + 2);
    }
  }, [text, scale, barHeight, showText, barColor, bgColor]);

  const downloadPng = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = `barcode-${(text || "code").toLowerCase().replace(/[^a-z0-9]/g, "-")}.png`;
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  const copyImage = async () => {
    if (!canvasRef.current) return;
    try {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return;
        const item = new ClipboardItem({ "image/png": blob });
        await navigator.clipboard.write([item]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } catch {
      // Fallback: copy text value
      await copyToClipboard(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl border border-pink-200 bg-pink-50/50 dark:border-pink-900/60 dark:bg-pink-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-pink-100 dark:bg-pink-900/60 text-pink-600 dark:text-pink-400 border border-pink-200 dark:border-pink-800 flex items-center justify-center shadow-sm flex-shrink-0">
            <Barcode className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Standard Code 128 Barcode Generator
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Generate scannable 1D barcodes for retail, inventory SKUs, shipping labels, and asset tags.
            </p>
          </div>
        </div>

        {/* Preset quick links */}
        <div className="flex flex-wrap gap-1.5 self-start sm:self-center">
          {["TOOLIFY-2026", "SKU-99281-A", "INV-84920", "PRODUCT-01"].map((preset) => (
            <button
              key={preset}
              onClick={() => setText(preset)}
              className="text-[11px] px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 font-mono transition-colors"
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Barcode Data / Text
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. ITEM-12345"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:border-brand-500 shadow-sm"
            />
            <p className="text-[11px] text-slate-400">
              Standard alphanumeric ASCII supported (A-Z, 0-9, hyphens, punctuation).
            </p>
          </div>

          {/* Sizing & Appearance sliders */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-5 shadow-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5" />
              <span>Barcode Dimensions</span>
            </h4>

            {/* Bar Height */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Bar Height</span>
                <span className="font-mono text-slate-800 dark:text-slate-200 font-bold">{barHeight}px</span>
              </div>
              <input
                type="range"
                min={40}
                max={150}
                step={5}
                value={barHeight}
                onChange={(e) => setBarHeight(Number(e.target.value))}
                className="w-full accent-brand-600 cursor-pointer"
              />
            </div>

            {/* Scale */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Bar Thickness / Scale</span>
                <span className="font-mono text-slate-800 dark:text-slate-200 font-bold">{scale}x</span>
              </div>
              <input
                type="range"
                min={1}
                max={4}
                step={1}
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
                className="w-full accent-brand-600 cursor-pointer"
              />
            </div>

            {/* Show Label */}
            <div className="flex items-center justify-between pt-1">
              <label className="text-xs text-slate-600 dark:text-slate-400 font-medium flex items-center gap-2 cursor-pointer">
                <Type className="w-3.5 h-3.5" />
                <span>Show Readable Text Below</span>
              </label>
              <input
                type="checkbox"
                checked={showText}
                onChange={(e) => setShowText(e.target.checked)}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 cursor-pointer"
              />
            </div>

            {/* Color Pickers */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="space-y-1">
                <label className="text-[11px] text-slate-500 font-medium">Bar Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={barColor}
                    onChange={(e) => setBarColor(e.target.value)}
                    className="w-8 h-8 rounded border-0 cursor-pointer p-0 bg-transparent"
                  />
                  <span className="text-xs font-mono text-slate-600 dark:text-slate-400">{barColor}</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-500 font-medium">Background</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-8 h-8 rounded border-0 cursor-pointer p-0 bg-transparent"
                  />
                  <span className="text-xs font-mono text-slate-600 dark:text-slate-400">{bgColor}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Live Barcode Preview
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Format: Code 128 (Scannable)
            </span>
          </div>

          <div className="min-h-[280px] p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 flex flex-col items-center justify-center shadow-inner overflow-x-auto">
            <div className="p-4 rounded-xl bg-white shadow-md inline-block max-w-full">
              <canvas ref={canvasRef} className="max-w-full h-auto block" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
            <button
              onClick={copyImage}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-slate-400 font-bold text-xs shadow-sm transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Image</span>
                </>
              )}
            </button>

            <button
              onClick={downloadPng}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-md hover:shadow-lg transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download PNG</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}