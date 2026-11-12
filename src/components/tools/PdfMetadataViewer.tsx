"use client";

import { useState } from "react";
import Dropzone from "@/components/Dropzone";
import { PDFDocument } from "pdf-lib";
import { Info, RotateCcw, FileText, CheckCircle2 } from "lucide-react";
import { formatBytes } from "@/lib/utils";

interface PdfMeta {
  title?: string;
  author?: string;
  subject?: string;
  creator?: string;
  producer?: string;
  creationDate?: string;
  modificationDate?: string;
  pageCount: number;
  fileName: string;
  fileSize: number;
}

export default function PdfMetadataViewer() {
  const [meta, setMeta] = useState<PdfMeta | null>(null);

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];

    try {
      const buffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer, { updateMetadata: false });

      setMeta({
        title: pdfDoc.getTitle() || "Untitled",
        author: pdfDoc.getAuthor() || "Not specified",
        subject: pdfDoc.getSubject() || "Not specified",
        creator: pdfDoc.getCreator() || "Not specified",
        producer: pdfDoc.getProducer() || "Not specified",
        creationDate: pdfDoc.getCreationDate()?.toLocaleString() || "Not specified",
        modificationDate: pdfDoc.getModificationDate()?.toLocaleString() || "Not specified",
        pageCount: pdfDoc.getPageCount(),
        fileName: file.name,
        fileSize: file.size,
      });
    } catch (err) {
      console.error("Failed to read PDF metadata", err);
    }
  };

  return (
    <div className="p-6 sm:p-10 space-y-6">
      {!meta ? (
        <Dropzone
          onFilesSelected={handleFilesSelected}
          accept="application/pdf"
          description="Drop any PDF file to inspect author, creator, page counts, and metadata"
        />
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              PDF Document Metadata Report
            </h3>
            <button
              onClick={() => setMeta(null)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-rose-500"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Inspect Another PDF</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "File Name", val: meta.fileName },
              { label: "File Size", val: formatBytes(meta.fileSize) },
              { label: "Total Page Count", val: `${meta.pageCount} pages` },
              { label: "Document Title", val: meta.title },
              { label: "Author", val: meta.author },
              { label: "Subject", val: meta.subject },
              { label: "Software Creator", val: meta.creator },
              { label: "PDF Producer", val: meta.producer },
              { label: "Creation Date", val: meta.creationDate },
              { label: "Modification Date", val: meta.modificationDate },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20"
              >
                <span className="text-[10px] uppercase font-bold text-slate-400">{item.label}</span>
                <div className="text-sm font-semibold text-slate-900 dark:text-white mt-1 break-all">
                  {item.val}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
