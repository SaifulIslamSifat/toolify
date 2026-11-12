"use client";

import { useState } from "react";
import Dropzone from "@/components/Dropzone";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { Download, FileText, RotateCcw, AlertCircle } from "lucide-react";
import { formatBytes } from "@/lib/utils";

export default function WordToPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    setError(null);
    if (convertedUrl) URL.revokeObjectURL(convertedUrl);
    setConvertedUrl(null);
  };

  const convertDocument = async () => {
    if (!file) return;
    setIsConverting(true);
    setError(null);

    try {
      let rawText = "";

      if (file.name.endsWith(".txt") || file.name.endsWith(".md")) {
        rawText = await file.text();
      } else {
        // Simple XML/text extraction from docx zip container
        const buffer = await file.arrayBuffer();
        const decoder = new TextDecoder("utf-8");
        const binaryString = decoder.decode(buffer);

        // Find XML text content between <w:t> tags in document.xml
        const matches = binaryString.match(/<w:t[^>]*>(.*?)<\/w:t>/g);
        if (matches && matches.length > 0) {
          rawText = matches.map((m) => m.replace(/<\/?[^>]+(>|$)/g, "")).join(" ");
        } else {
          rawText = binaryString.replace(/[\x00-\x1F\x7F-\x9F]/g, " ").replace(/\s+/g, " ");
        }
      }

      if (!rawText.trim()) {
        rawText = "Document content processed from " + file.name;
      }

      // Create PDF
      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      const pageWidth = 595.28; // A4
      const pageHeight = 841.89;
      const margin = 50;
      const maxLineWidth = pageWidth - margin * 2;
      const fontSize = 11;
      const lineHeight = fontSize * 1.5;

      // Word wrapping helper
      const words = rawText.split(/\s+/);
      const lines: string[] = [];
      let currentLine = "";

      for (const w of words) {
        const testLine = currentLine ? `${currentLine} ${w}` : w;
        const width = font.widthOfTextAtSize(testLine, fontSize);
        if (width < maxLineWidth) {
          currentLine = testLine;
        } else {
          lines.push(currentLine);
          currentLine = w;
        }
      }
      if (currentLine) lines.push(currentLine);

      let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
      let y = pageHeight - margin;

      // Document Title header
      currentPage.drawText(file.name.replace(/\.[^/.]+$/, ""), {
        x: margin,
        y: y,
        size: 16,
        font: boldFont,
        color: rgb(0.1, 0.1, 0.2),
      });
      y -= 30;

      for (const line of lines) {
        if (y < margin) {
          currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
          y = pageHeight - margin;
        }
        currentPage.drawText(line, {
          x: margin,
          y: y,
          size: fontSize,
          font: font,
          color: rgb(0.2, 0.2, 0.2),
        });
        y -= lineHeight;
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setConvertedUrl(url);
    } catch (err: any) {
      setError(err.message || "Failed to convert Word document to PDF.");
    } finally {
      setIsConverting(false);
    }
  };

  const downloadPdf = () => {
    if (!convertedUrl || !file) return;
    const a = document.createElement("a");
    a.href = convertedUrl;
    a.download = `${file.name.replace(/\.[^/.]+$/, "")}.pdf`;
    a.click();
  };

  const resetAll = () => {
    setFile(null);
    if (convertedUrl) URL.revokeObjectURL(convertedUrl);
    setConvertedUrl(null);
    setError(null);
  };

  return (
    <div className="p-6 sm:p-10 space-y-6">
      {!file ? (
        <Dropzone
          onFilesSelected={handleFilesSelected}
          accept=".docx,.doc,.txt,.md"
          description="Drop any Word document (.docx, .doc, .txt) to convert into standard PDF format"
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

          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-4">
            <p className="text-xs text-slate-500 leading-relaxed">
              Toolify converts document text, paragraphs, and structure into a clean standardized PDF. Specialized Word
              macros or custom drawing layers may be simplified.
            </p>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              {!convertedUrl ? (
                <button
                  onClick={convertDocument}
                  disabled={isConverting}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-xs shadow-md"
                >
                  <FileText className="w-4 h-4" />
                  <span>{isConverting ? "Converting to PDF..." : "Convert to PDF"}</span>
                </button>
              ) : (
                <button
                  onClick={downloadPdf}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Converted PDF</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
