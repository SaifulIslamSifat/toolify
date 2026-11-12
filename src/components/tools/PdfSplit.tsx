"use client";

import { useState } from "react";
import Dropzone from "@/components/Dropzone";
import { PDFDocument } from "pdf-lib";
import { Download, Scissors, RotateCcw, AlertCircle } from "lucide-react";
import { formatBytes } from "@/lib/utils";

export default function PdfSplit() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [rangeInput, setRangeInput] = useState<string>("1");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [splitPdfUrl, setSplitPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    setError(null);

    try {
      const buffer = await selected.arrayBuffer();
      const doc = await PDFDocument.load(buffer);
      const total = doc.getPageCount();
      setPageCount(total);
      setRangeInput(total > 1 ? `1-${Math.min(2, total)}` : "1");
    } catch (err: any) {
      setError("Failed to read PDF. Ensure the file is not corrupted or password-protected.");
    }
  };

  const parsePageRanges = (input: string, maxPages: number): number[] => {
    const pages = new Set<number>();
    const parts = input.split(",").map((p) => p.trim());

    for (const part of parts) {
      if (part.includes("-")) {
        const [startStr, endStr] = part.split("-");
        const start = parseInt(startStr);
        const end = parseInt(endStr);
        if (!isNaN(start) && !isNaN(end)) {
          for (let p = Math.max(1, start); p <= Math.min(maxPages, end); p++) {
            pages.add(p - 1); // 0-indexed for pdf-lib
          }
        }
      } else {
        const page = parseInt(part);
        if (!isNaN(page) && page >= 1 && page <= maxPages) {
          pages.add(page - 1);
        }
      }
    }

    return Array.from(pages).sort((a, b) => a - b);
  };

  const splitPdf = async () => {
    if (!file) return;
    setError(null);
    setIsProcessing(true);

    try {
      const pageIndices = parsePageRanges(rangeInput, pageCount);
      if (pageIndices.length === 0) {
        setError("Invalid page range specified. (e.g., '1-3, 5')");
        setIsProcessing(false);
        return;
      }

      const buffer = await file.arrayBuffer();
      const sourcePdf = await PDFDocument.load(buffer);
      const newPdf = await PDFDocument.create();

      const copiedPages = await newPdf.copyPages(sourcePdf, pageIndices);
      copiedPages.forEach((p) => newPdf.addPage(p));

      const newPdfBytes = await newPdf.save();
      const blob = new Blob([newPdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });

      if (splitPdfUrl) URL.revokeObjectURL(splitPdfUrl);
      const url = URL.createObjectURL(blob);
      setSplitPdfUrl(url);
    } catch (err: any) {
      setError(err.message || "Failed to split PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadSplit = () => {
    if (!splitPdfUrl || !file) return;
    const a = document.createElement("a");
    a.href = splitPdfUrl;
    a.download = `extracted-pages-${file.name}`;
    a.click();
  };

  const resetAll = () => {
    setFile(null);
    setPageCount(0);
    if (splitPdfUrl) URL.revokeObjectURL(splitPdfUrl);
    setSplitPdfUrl(null);
    setError(null);
  };

  return (
    <div className="p-6 sm:p-10 space-y-6">
      {!file ? (
        <Dropzone
          onFilesSelected={handleFilesSelected}
          accept="application/pdf"
          description="Drop any PDF document to extract specific pages or ranges"
        />
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="text-xs text-slate-500">
              Document: <span className="font-bold text-slate-900 dark:text-white">{file.name}</span> (
              {pageCount} total pages, {formatBytes(file.size)})
            </div>
            <button
              onClick={resetAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-rose-500"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Choose Another File</span>
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Pages to Extract (e.g. 1-3, 5, 8)
              </label>
              <input
                type="text"
                value={rangeInput}
                onChange={(e) => setRangeInput(e.target.value)}
                placeholder="1-2, 4"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-base focus:outline-none focus:border-brand-500"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Total available pages: 1 through {pageCount}
              </span>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              {!splitPdfUrl ? (
                <button
                  onClick={splitPdf}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-xs shadow-md"
                >
                  <Scissors className="w-4 h-4" />
                  <span>{isProcessing ? "Extracting..." : "Extract Pages"}</span>
                </button>
              ) : (
                <button
                  onClick={downloadSplit}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Extracted PDF</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
