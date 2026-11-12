"use client";

import { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import { QrCode, Download, Copy, Check } from "lucide-react";
import { copyToClipboard } from "@/lib/utils";

export default function QrCodeGenerator() {
  const [text, setText] = useState<string>("https://toolify.local");
  const [darkColor, setDarkColor] = useState<string>("#000000");
  const [lightColor, setLightColor] = useState<string>("#ffffff");
  const [size, setSize] = useState<number>(300);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (canvasRef.current && text) {
      QRCode.toCanvas(canvasRef.current, text, {
        width: size,
        margin: 2,
        color: {
          dark: darkColor,
          light: lightColor,
        },
      }).catch((err) => console.error(err));
    }
  }, [text, darkColor, lightColor, size]);

  const downloadPng = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `toolify-qrcode-${Date.now()}.png`;
    a.click();
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
      // Fallback
    }
  };

  return (
    <div className="p-6 sm:p-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Controls */}
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              QR Code Content (URL, Text, or Wi-Fi)
            </label>
            <textarea
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="https://example.com or any text..."
              className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold text-sm focus:outline-none focus:border-brand-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Foreground Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={darkColor}
                  onChange={(e) => setDarkColor(e.target.value)}
                  className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent"
                />
                <span className="text-xs font-mono font-bold">{darkColor}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Background Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={lightColor}
                  onChange={(e) => setLightColor(e.target.value)}
                  className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent"
                />
                <span className="text-xs font-mono font-bold">{lightColor}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Resolution (Size: {size}px)
            </label>
            <input
              type="range"
              min="150"
              max="600"
              step="50"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-600"
            />
          </div>
        </div>

        {/* QR Preview & Download */}
        <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center">
          <div className="p-4 rounded-2xl bg-white shadow-card mb-6">
            <canvas ref={canvasRef} className="max-w-full rounded-lg" />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 w-full">
            <button
              onClick={downloadPng}
              disabled={!text}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download PNG</span>
            </button>
            <button
              onClick={copyImage}
              disabled={!text}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-bold text-xs hover:border-brand-500 shadow-sm transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>Copied Image</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Image</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
