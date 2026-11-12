"use client";

import { useState } from "react";
import Dropzone from "@/components/Dropzone";
import { PDFDocument, degrees } from "pdf-lib";
import { Download, RotateCcw, RotateCw } from "lucide-react";
import { formatBytes } from "@/lib/utils";

export default function PdfRotate() {
  const [file, setFile] = useState<File | null>(null);
  const [rotationAngle, setRotationAngle] = useState<number>(90); // 90, 180, 270
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [rotatedUrl, setRotatedUrl] = useState<string | null>(null);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    setFile(files[0]);
    if (rotatedUrl) URL.revokeObjectURL(rotatedUrl);
    setRotatedUrl(null);
  };

  const processRotation = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const buffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer);
      const pages = pdfDoc.getPages();

      pages.forEach((page) => {
        const currentRotation = page.getRotation().angle;
        page.setRotation(degrees((currentRotation + rotationAngle) % 360));
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });

      if (rotatedUrl) URL.revokeObjectURL(rotatedUrl);
      const url = URL.createObjectURL(blob);
      setRotatedUrl(url);
    } catch (err) {
      console.error("PDF Rotation error", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadRotated = () => {
    if (!rotatedUrl || !file) return;
    const a = document.createElement("a");
    a.href = rotatedUrl;
    a.download = `rotated-${file.name}`;
    a.click();
  };

  const resetAll = () => {
    setFile(null);
    if (rotatedUrl) URL.revokeObjectURL(rotatedUrl);
    setRotatedUrl(null);
  };

  return (
    <div className="p-6 sm:p-10 space-y-6">
      {!file ? (
        <Dropzone
          onFilesSelected={handleFilesSelected}
          accept="application/pdf"
          description="Drop any PDF document to rotate all pages clockwise or counter-clockwise"
        />
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="text-xs text-slate-500">
              Document: <span className="font-bold text-slate-900 dark:text-white">{file.name}</span> (
              {formatBytes(file.size)})
            </div>
            <button
              onClick={resetAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-rose-500"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Choose Another File</span>
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-3">
                Select Rotation Angle
              </label>
              <div className="flex flex-wrap gap-3">
                {[
                  { angle: 90, label: "90° Clockwise" },
                  { angle: 180, label: "180° Upside Down" },
                  { angle: 270, label: "270° Counter-Clockwise" },
                ].map((item) => (
                  <button
                    key={item.angle}
                    onClick={() => {
                      setRotationAngle(item.angle);
                      if (rotatedUrl) {
                        URL.revokeObjectURL(rotatedUrl);
                        setRotatedUrl(null);
                      }
                    }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                      rotationAngle === item.angle
                        ? "border-brand-600 bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 shadow-sm"
                        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    <RotateCw className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              {!rotatedUrl ? (
                <button
                  onClick={processRotation}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-xs shadow-md"
                >
                  <RotateCw className="w-4 h-4" />
                  <span>{isProcessing ? "Rotating Pages..." : `Apply ${rotationAngle}° Rotation`}</span>
                </button>
              ) : (
                <button
                  onClick={downloadRotated}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Rotated PDF</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
