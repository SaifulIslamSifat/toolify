"use client";

import { useState } from "react";
import Dropzone from "@/components/Dropzone";
import { Download, RotateCcw, ArrowRight } from "lucide-react";
import { formatBytes } from "@/lib/utils";

interface ImageFormatConverterProps {
  defaultTarget?: "png" | "jpeg" | "webp";
}

export default function ImageFormatConverter({ defaultTarget = "png" }: ImageFormatConverterProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [targetFormat, setTargetFormat] = useState<"png" | "jpeg" | "webp">(defaultTarget);
  const [quality, setQuality] = useState<number>(90);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [convertedSize, setConvertedSize] = useState<number>(0);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    const url = URL.createObjectURL(selected);
    setPreviewUrl(url);
    processConversion(url, targetFormat, quality, selected.name);
  };

  const processConversion = (
    srcUrl: string,
    format: "png" | "jpeg" | "webp",
    q: number,
    fileName: string
  ) => {
    const img = new Image();
    img.src = srcUrl;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // If converting to JPEG, fill white background for transparent pixels
      if (format === "jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);

      const mime = `image/${format}`;
      canvas.toBlob(
        (blob) => {
          if (blob) {
            setConvertedSize(blob.size);
            if (convertedUrl) URL.revokeObjectURL(convertedUrl);
            setConvertedUrl(URL.createObjectURL(blob));
          }
        },
        mime,
        q / 100
      );
    };
  };

  const handleFormatChange = (fmt: "png" | "jpeg" | "webp") => {
    setTargetFormat(fmt);
    if (previewUrl && file) {
      processConversion(previewUrl, fmt, quality, file.name);
    }
  };

  const downloadFile = () => {
    if (!convertedUrl || !file) return;
    const ext = targetFormat === "jpeg" ? "jpg" : targetFormat;
    const a = document.createElement("a");
    a.href = convertedUrl;
    a.download = `${file.name.replace(/\.[^/.]+$/, "")}.${ext}`;
    a.click();
  };

  const resetAll = () => {
    setFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (convertedUrl) URL.revokeObjectURL(convertedUrl);
    setPreviewUrl(null);
    setConvertedUrl(null);
    setConvertedSize(0);
  };

  return (
    <div className="p-6 sm:p-10 space-y-6">
      {!file ? (
        <Dropzone
          onFilesSelected={handleFilesSelected}
          accept="image/jpeg,image/png,image/webp,image/gif"
          description={`Convert photos into high-fidelity ${targetFormat.toUpperCase()} format`}
        />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-500">Convert to:</span>
              <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
                {(["png", "jpeg", "webp"] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => handleFormatChange(fmt)}
                    className={`px-3 py-1.5 rounded-lg uppercase ${
                      targetFormat === fmt
                        ? "bg-white dark:bg-slate-900 text-brand-600 shadow-sm"
                        : "text-slate-500"
                    }`}
                  >
                    {fmt === "jpeg" ? "JPG" : fmt}
                  </button>
                ))}
              </div>
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
                onClick={downloadFile}
                disabled={!convertedUrl}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download {targetFormat.toUpperCase()} ({formatBytes(convertedSize)})</span>
              </button>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-center gap-6">
            <div className="text-center">
              <span className="text-xs font-bold text-slate-400 block mb-2">Original</span>
              {previewUrl && (
                <img src={previewUrl} alt="Original" className="h-48 max-w-full rounded-lg object-contain" />
              )}
            </div>
            <ArrowRight className="w-6 h-6 text-brand-600 flex-shrink-0" />
            <div className="text-center">
              <span className="text-xs font-bold text-brand-600 block mb-2">
                Converted ({targetFormat.toUpperCase()})
              </span>
              {convertedUrl && (
                <img src={convertedUrl} alt="Converted" className="h-48 max-w-full rounded-lg object-contain" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
