"use client";

import { useState } from "react";
import Dropzone from "@/components/Dropzone";
import { PDFDocument } from "pdf-lib";
import { ArrowUp, ArrowDown, Trash2, Download, Layers, FileText, Check } from "lucide-react";
import { formatBytes } from "@/lib/utils";

interface PdfItem {
  id: string;
  file: File;
}

export default function PdfMerge() {
  const [items, setItems] = useState<PdfItem[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [mergedUrl, setMergedUrl] = useState<string | null>(null);

  const handleFilesSelected = (files: File[]) => {
    const newItems: PdfItem[] = files.map((f) => ({
      id: Math.random().toString(36).substring(2, 9),
      file: f,
    }));
    setItems((prev) => [...prev, ...newItems]);
    if (mergedUrl) {
      URL.revokeObjectURL(mergedUrl);
      setMergedUrl(null);
    }
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setItems((prev) => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const moveDown = (index: number) => {
    if (index === items.length - 1) return;
    setItems((prev) => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const mergePdfs = async () => {
    if (items.length < 2) return;
    setIsMerging(true);

    try {
      const mergedPdf = await PDFDocument.create();

      for (const item of items) {
        const arrayBuffer = await item.file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });

      if (mergedUrl) URL.revokeObjectURL(mergedUrl);
      const url = URL.createObjectURL(blob);
      setMergedUrl(url);
    } catch (err) {
      console.error("PDF Merge error", err);
    } finally {
      setIsMerging(false);
    }
  };

  const downloadMerged = () => {
    if (!mergedUrl) return;
    const a = document.createElement("a");
    a.href = mergedUrl;
    a.download = `merged-document-${Date.now()}.pdf`;
    a.click();
  };

  return (
    <div className="p-6 sm:p-10 space-y-6">
      <Dropzone
        onFilesSelected={handleFilesSelected}
        accept="application/pdf"
        multiple={true}
        description="Select or drop 2 or more PDF documents to merge into a single file"
      />

      {items.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Selected Files ({items.length}) - Drag or order as desired:
            </h4>
            <button
              onClick={() => setItems([])}
              className="text-xs text-rose-500 hover:underline font-semibold"
            >
              Clear All
            </button>
          </div>

          <div className="space-y-2">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center font-bold text-xs flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="min-w-0">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white truncate block">
                      {item.file.name}
                    </span>
                    <span className="text-xs text-slate-400">{formatBytes(item.file.size)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0 ml-3">
                  <button
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 disabled:opacity-30 hover:bg-slate-50"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => moveDown(index)}
                    disabled={index === items.length - 1}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 disabled:opacity-30 hover:bg-slate-50"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-rose-500 hover:bg-rose-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Merge & Download Action */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4">
            {!mergedUrl ? (
              <button
                onClick={mergePdfs}
                disabled={items.length < 2 || isMerging}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all"
              >
                <Layers className="w-4 h-4" />
                <span>{isMerging ? "Merging Documents..." : `Merge ${items.length} PDFs`}</span>
              </button>
            ) : (
              <button
                onClick={downloadMerged}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download Combined PDF</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
