"use client";

import { useState } from "react";
import Dropzone from "@/components/Dropzone";
import { PDFDocument } from "pdf-lib";
import { Download, RotateCcw, FilePlus } from "lucide-react";
import { formatBytes } from "@/lib/utils";

export default function JpgToPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const handleFilesSelected = (selected: File[]) => {
    setFiles((prev) => [...prev, ...selected]);
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
  };

  const convertToPdf = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);

    try {
      const pdfDoc = await PDFDocument.create();

      for (const f of files) {
        const buffer = await f.arrayBuffer();
        let embeddedImage;

        if (f.type === "image/png") {
          embeddedImage = await pdfDoc.embedPng(buffer);
        } else {
          embeddedImage = await pdfDoc.embedJpg(buffer);
        }

        const { width, height } = embeddedImage.scale(1);
        const page = pdfDoc.addPage([width, height]);
        page.drawImage(embeddedImage, {
          x: 0,
          y: 0,
          width,
          height,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });

      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (err) {
      console.error("JPG to PDF error", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadPdf = () => {
    if (!pdfUrl) return;
    const a = document.createElement("a");
    a.href = pdfUrl;
    a.download = `images-to-pdf-${Date.now()}.pdf`;
    a.click();
  };

  const resetAll = () => {
    setFiles([]);
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    setPdfUrl(null);
  };

  return (
    <div className="p-6 sm:p-10 space-y-6">
      <Dropzone
        onFilesSelected={handleFilesSelected}
        accept="image/jpeg,image/png"
        multiple={true}
        description="Drop JPG or PNG photos to compile into a multi-page PDF document"
      />

      {files.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Selected Photos ({files.length}):
            </span>
            <button onClick={resetAll} className="text-xs text-rose-500 hover:underline font-semibold">
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {files.map((f, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold truncate"
              >
                <span className="text-brand-600 font-bold mr-1">#{idx + 1}</span> {f.name}
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            {!pdfUrl ? (
              <button
                onClick={convertToPdf}
                disabled={isProcessing}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all"
              >
                <FilePlus className="w-4 h-4" />
                <span>{isProcessing ? "Compiling PDF..." : `Convert ${files.length} Photos to PDF`}</span>
              </button>
            ) : (
              <button
                onClick={downloadPdf}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download Generated PDF</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
